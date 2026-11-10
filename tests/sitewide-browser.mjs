import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pageSEO, siteOrigin, canonicalURL } from '../src/seo.js';
import { staticPreview } from './staticPreview.mjs';
const preview = await staticPreview();
const port = process.env.BROWSER_DEBUG_PORT || '9237';
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {method:'PUT'})).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
let sequence=0;const pending=new Map(),errors=[],requests=[];
ws.addEventListener('message',event=>{const data=JSON.parse(event.data);if(data.id){const task=pending.get(data.id);pending.delete(data.id);data.error?task?.reject(new Error(data.error.message)):task?.resolve(data.result);}else if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails.text);else if(data.method==='Network.requestWillBeSent')requests.push(data.params.request.url);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitFor(expression){for(let i=0;i<200;i++){if(await evaluate(expression))return;await sleep(35);}throw new Error('Timed out: '+expression);}
async function navigate(route){await send('Page.navigate',{url:preview.base+route});await waitFor('location.pathname==='+JSON.stringify(new URL(route,preview.base).pathname)+'&&!!document.querySelector("main h1")');await evaluate('document.fonts.ready');await evaluate('Promise.all([...document.images].filter(i=>i.loading!=="lazy").map(i=>i.decode().catch(()=>{})))');}
async function metrics(width){await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});}
async function capture(name){await mkdir('.sites',{recursive:true});await writeFile(`.sites/sitewide-${name}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));}
try{
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Page.bringToFront');
  await send('Emulation.setScriptExecutionDisabled',{value:true});
  for(const width of [1440,390,320]){
    await metrics(width);
    for(const [route,metadata] of Object.entries(pageSEO)){
      await navigate(route);
      const state=await evaluate('(()=>{const m=document.querySelector("main");const visible=e=>e.getBoundingClientRect().height>0&&getComputedStyle(e).display!=="none";return{title:document.title,description:document.querySelector("meta[name=description]").content,h1:m.querySelectorAll("h1").length,opacity:getComputedStyle(m.querySelector("h1")).opacity,font:getComputedStyle(m.querySelector("h1")).fontFamily,body:[...m.querySelectorAll("p")].filter(e=>visible(e)&&!e.matches(".kicker,.about-chapter-label,.about-chapter-detail,.process-tagline")).map(e=>({text:e.textContent.slice(0,60),size:parseFloat(getComputedStyle(e).fontSize)})),labels:[...m.querySelectorAll(".kicker,.section-label>span,[class*=eyebrow]")].filter(visible).map(e=>parseFloat(getComputedStyle(e).fontSize)),overflow:document.documentElement.scrollWidth>innerWidth+1,icons:m.querySelectorAll(".nav-icon,.orbit-system").length,navIcons:document.querySelectorAll(".nav-icon").length,text:m.innerText};})()');
      assert.equal(state.title,metadata.title);assert.equal(state.description,metadata.description);assert.equal(state.h1,1);assert.equal(state.opacity,'1');assert.match(state.font,/Manrope/);assert.equal(state.overflow,false,route+' '+width);assert.equal(state.navIcons,0);assert.equal(state.icons,0);assert.ok(state.body.every(p=>p.size>=17),route+' body sizes: '+JSON.stringify(state.body.filter(p=>p.size<17)));assert.ok(state.labels.every(s=>s>=12),route+' labels');assert.doesNotMatch(state.text,/\bF(?:5|6|10)\b|\[confirm|DEVELOPMENT ONLY/);
      if(width!==320)await capture((route==='/'?'home':route.slice(1))+'-nojs-'+width);
      console.log('PASS initial HTML, metadata, readable type, no overflow or hidden heading: '+route+' '+width);
    }
  }
  for(const route of ['/services/','/services.html','/index.html','/index'])assert.equal((await fetch(preview.base+route,{redirect:'manual'})).status,308);
  assert.equal((await fetch(preview.base+'/not-a-public-page')).status,404);
  await send('Emulation.setScriptExecutionDisabled',{value:false});await metrics(1440);await navigate('/');
  await waitFor('!!document.querySelector(".hero")');
  await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  await evaluate('window.__seoNavigationProbe=true');
  await evaluate('[...document.querySelectorAll(".header .nav-links a")].find(a=>a.getAttribute("href")==="/quality").click()');
  await waitFor('location.pathname==="/quality"&&document.title==='+JSON.stringify(pageSEO['/quality'].title));
  assert.equal(await evaluate('window.__seoNavigationProbe'),true,'metadata updates without a full page reload');
  assert.equal(await evaluate('document.querySelector("meta[name=description]").content'),pageSEO['/quality'].description);
  assert.equal(await evaluate('document.querySelector("link[rel=canonical]")?.href||null'),canonicalURL('/quality'));
  await navigate('/services');await send('Accessibility.enable');
  const ax=(await send('Accessibility.getFullAXTree')).nodes;
  assert.ok(ax.some(n=>n.role?.value==='table'&&n.name?.value==='Compare OEM, ODM and co-development'));
  assert.equal(ax.filter(n=>n.role?.value==='columnheader').length,4);
  assert.equal(ax.filter(n=>n.role?.value==='rowheader').length,5);
  const contrasts=await evaluate('(()=>{const rgb=s=>(s.match(/[\\d.]+/g)||[]).map(Number),lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);return [...document.querySelectorAll(".page-intro-copy p,.section-label>span,[class*=fieldLabel]")].filter(e=>e.getBoundingClientRect().height>0&&e.textContent.trim()).map(e=>{let bg=[253,251,246];for(let p=e;p;p=p.parentElement){const c=rgb(getComputedStyle(p).backgroundColor);if(c.length===3||c[3]===1){bg=c;break;}}const a=lum(rgb(getComputedStyle(e).color)),b=lum(bg);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05);});})()');
  assert.ok(contrasts.length>10&&contrasts.every(value=>value>=4.5),'sampled body/label contrast meets 4.5:1');
  await metrics(390);await navigate('/about');await evaluate('document.querySelector(".menu-toggle").focus()');
  for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
  await waitFor('document.querySelector(".menu-toggle").getAttribute("aria-expanded")==="true"');
  await waitFor('!!document.activeElement.closest("#main-navigation")');
  assert.equal(await evaluate('document.activeElement.getAttribute("href")'),'/about');
  for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  assert.equal(await evaluate('document.activeElement.classList.contains("menu-toggle")'),true);
  assert.ok(await evaluate('parseFloat(getComputedStyle(document.activeElement).outlineWidth)>=2'));
  for(const route of ['/about?review=1','/faq?review=1']){await navigate(route);assert.equal(await evaluate('!!document.querySelector(".site-review,.about-review")'),false);}
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await navigate('/');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".frame-hero-stage")).position'),'relative');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".about-chapter")).opacity'),'1');
  assert.equal(await evaluate('!!document.querySelector(".orbit-system,button[aria-label*=Pause]")'),false);
  assert.deepEqual(errors,[]);assert.deepEqual(requests.filter(url=>/^https?:/.test(url)&&!url.startsWith(preview.base)),[]);
  console.log('PASS built-site keyboard focus/menu, SPA metadata, reduced motion, draft exclusion, clean redirects and real 404 fixture; no external requests');
  console.log(siteOrigin?'Canonical domain configured.':'Final domain pending; preview noindex/canonical withholding confirmed.');
}finally{ws.close();await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`).catch(()=>{});await preview.close();}
