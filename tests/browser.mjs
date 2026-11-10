import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const port = process.env.BROWSER_DEBUG_PORT || '9237';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4187';
const designReference = process.env.DESIGN_REFERENCE_URL;
const tab = await (await fetch('http://127.0.0.1:' + port + '/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map(), errors = [], requests = [];
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.id) { const task = pending.get(data.id); pending.delete(data.id); data.error ? task?.reject(new Error(data.error.message)) : task?.resolve(data.result); }
  else if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text);
  else if (data.method === 'Network.requestWillBeSent') requests.push(data.params.request.url);
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async expression => { const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description); return result.result.value; };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(expression) { for (let i = 0; i < 200; i++) { if (await evaluate(expression)) return; await sleep(40); } throw new Error('Timed out: ' + expression); }
async function navigate(path) {
  await send('Page.navigate', { url: base + path });
  await waitFor('location.pathname === ' + JSON.stringify(new URL(base + path).pathname) + ' && !!document.querySelector("main h1")');
  await evaluate('document.fonts.ready');
  await evaluate('Promise.all([...document.images].filter(i=>i.loading!=="lazy").map(i=>i.decode().catch(()=>{})))');
}
async function metrics(width, height = 1000) { await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 }); }
async function capture(name) {
  await evaluate('Promise.all([...document.images].filter(i=>i.loading!=="lazy").map(i=>i.decode().catch(()=>{})))');
  await evaluate('Promise.all(document.getAnimations().filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})))');
  await writeFile('.sites/rewrite-' + name + '.png', Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
}
try {
  await mkdir('.sites/qa-downloads',{recursive:true});await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
  await send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:process.cwd()+'/.sites/qa-downloads'});
  const routes=['/','/services','/capabilities','/products','/quality','/process','/about','/faq','/contact'];
  for(const width of [1440,820,390,320]){
    await metrics(width);
    for(const route of routes){
      await navigate(route);
      const state=await evaluate('(()=>{const m=document.querySelector("main");return{overflow:document.documentElement.scrollWidth>innerWidth+1,h1:m.querySelectorAll("h1").length,font:getComputedStyle(m.querySelector("h1")).fontFamily,icons:document.querySelectorAll(".nav-icon").length,newLayout:!!m.querySelector(".rewrite-page,.rw-shell,.rw-comparison,.rw-timeline"),broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),factSlot:/\\bF(?:3|5|6|8|9|10|11|13|14|15|16|17|19)\\b|\\[confirm/.test(m.innerText)};})()');
      assert.equal(state.overflow,false,route+' '+width);assert.equal(state.h1,1);assert.match(state.font,/Manrope/);assert.equal(state.icons,0);assert.equal(state.newLayout,false);assert.deepEqual(state.broken,[]);assert.equal(state.factSlot,false);
      if(route==='/services'){
        const comparison=await evaluate('(()=>{const cards=["oem","odm","co-development"].map(id=>document.getElementById(id));return{tabs:document.querySelectorAll("main [role=tab]").length,cards:cards.map(e=>({top:e.getBoundingClientRect().top,left:e.getBoundingClientRect().left,fields:[...document.querySelectorAll("td[data-model="+e.id+"]")].map(d=>({height:d.getBoundingClientRect().height,display:getComputedStyle(d).display,visibility:getComputedStyle(d).visibility}))})),text:document.querySelector("main").innerText};})()');
        assert.equal(comparison.tabs,0);assert.doesNotMatch(comparison.text,/fill.only|\bF[0-9]+\b/);
        assert.match(comparison.text,/Formula ownership, quote terms, included tests, minimum quantities and timelines are pending confirmation/);
        for(const card of comparison.cards){assert.equal(card.fields.length,4);assert.ok(card.fields.every(f=>f.height>0&&f.display!=='none'&&f.visibility==='visible'));}
        if(width>800)assert.ok(comparison.cards.every(c=>Math.abs(c.top-comparison.cards[0].top)<1));
        else assert.ok(comparison.cards[1].top>comparison.cards[0].top&&comparison.cards[2].top>comparison.cards[1].top);
      }
      if(route==='/capabilities'){
        const methods=await evaluate('(()=>{const m=document.querySelector("main");return{hiddenControls:m.querySelectorAll("[role=tab],[role=tabpanel],details").length,headings:[...m.querySelectorAll("section[data-method] h3")].map(e=>e.textContent),sections:[...m.querySelectorAll("section[data-method]")].map(e=>({height:e.getBoundingClientRect().height,display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility,text:e.querySelector(".cap-panel-description").innerText})),text:m.innerText};})()');
        assert.equal(methods.hiddenControls,0);assert.deepEqual(methods.headings,['Formulation','Colloid and emulsion science','Materials selection','Process engineering','Scale-up','Quality control']);assert.ok(methods.sections.every(s=>s.height>0&&s.display!=='none'&&s.visibility==='visible'&&s.text.length>40));assert.doesNotMatch(methods.text,/\bNDA\b|\bF[0-9]+\b|\[confirm/);
      }
      if(route==='/products'){
        const products=await evaluate('(()=>{const m=document.querySelector("main");return{title:m.querySelector("h1").textContent,text:m.innerText,images:m.querySelectorAll("img").length,categories:[...m.querySelectorAll(".prod-discovery article h3")].map(e=>e.textContent),nav:[...document.querySelectorAll(".header a")].filter(a=>a.getAttribute("href")==="/products").map(a=>a.querySelector(".nav-label").textContent.trim()),briefLink:document.querySelector(".prod-topic-nav a:last-child").getAttribute("href")};})()');
        assert.equal(products.title,'What we make');assert.deepEqual(products.nav,['What we make']);assert.deepEqual(products.categories,['Skincare','Personal care']);assert.equal(products.images,3);assert.equal(await evaluate('[...document.querySelectorAll("main figure")].filter(f=>f.innerText.includes("AI-GENERATED CONCEPT")).length'),3);assert.equal(products.briefLink,'/contact#product-brief-guidance');assert.doesNotMatch(products.text,/\b(?:serums?|creams?|lotions?|cleansers?|masks?|butters?|shampoos?|conditioners?|balms?|primers?|foundations?|bottles?|tubes?|jars?|sachets?|pails?|lipsticks?|mascara|gloss|pending|candidate|confirmation)\b|\bF[0-9]+\b|\[confirm/i);
      }
      if(route==='/contact'){
        const guidance=await evaluate('document.querySelector(".contact-brief-copy").innerText');assert.match(guidance,/What to include in your brief/);assert.match(guidance,/Describe the product, who it is for, where it will be used and what you want it to do/);assert.match(guidance,/Explain the desired feel, appearance, and application experience/);assert.match(guidance,/Share packaging ideas, dispensing requirements, and intended markets/);assert.match(guidance,/first-order quantity estimate/);assert.match(guidance,/target launch date/);assert.doesNotMatch(guidance,/\bNDA\b|\+?1[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/);
      }
      if(route==='/quality'){
        const quality=await evaluate('(()=>{const m=document.querySelector("main"),t=m.querySelector("table");return{columns:[...t.querySelectorAll("thead th")].map(e=>e.textContent),rows:t.querySelectorAll("tbody tr").length,cells:[...t.querySelectorAll("tbody th,tbody td")].map(e=>({height:e.getBoundingClientRect().height,visibility:getComputedStyle(e).visibility,text:e.innerText})),hidden:m.querySelectorAll("details,[role=tab],[role=tabpanel]").length,text:m.innerText,certificate:m.querySelector(".qlt-certification").innerText,images:[...m.querySelectorAll("figure")].map(f=>({caption:f.querySelector("figcaption").innerText,alt:f.querySelector("img").alt}))};})()');
        assert.deepEqual(quality.columns,['Test','What it checks','Where it is performed','Whether it is included in a project']);assert.equal(quality.rows,1);assert.equal(quality.hidden,0);assert.ok(quality.cells.every(c=>c.height>0&&c.visibility==='visible'));assert.match(quality.cells[0].text,/QC \/ specification review/);assert.match(quality.cells[2].text,/Not confirmed/);assert.match(quality.cells[3].text,/Not confirmed/);assert.match(quality.certificate,/We hold ISO 22716 certification through 2027/);assert.doesNotMatch(quality.certificate,/issuer|Intertek|scope|expiry|\d{4}-\d{2}-\d{2}/i);assert.doesNotMatch(quality.text,/stability|freeze.thaw|microbial|packaging compatibility|preservative challenge|\bF[0-9]+\b|confirm with Cody|\[confirm|every shipment|in minutes/i);assert.equal(quality.images.length,2);assert.ok(quality.images.every(i=>i.caption.includes('AI-GENERATED CONCEPT')&&i.alt.startsWith('AI-generated')));
      }
      if(route==='/process'){
        const process=await evaluate('(()=>{const m=document.querySelector("main"),stages=[...m.querySelectorAll("li[data-stage]")];return{titles:stages.map(e=>e.querySelector("h3").textContent),hidden:m.querySelectorAll("[role=tab],[role=tabpanel],details").length,checkpoints:stages.map(e=>({text:e.querySelector(".prc-approval dd").innerText,height:e.querySelector(".prc-approval dd").getBoundingClientRect().height,visibility:getComputedStyle(e.querySelector(".prc-approval dd")).visibility})),text:m.innerText,reorder:m.querySelector(".prc-reorder").innerText,reorderLink:m.querySelector(".prc-reorder a").getAttribute("href")};})()');
        assert.deepEqual(process.titles,['Inquiry','Brief and quote','Formulate or transfer formula','Samples and testing','Pilot batch','Production and shipping']);assert.equal(process.hidden,0);assert.equal(process.checkpoints.length,6);assert.ok(process.checkpoints.every(c=>c.height>0&&c.visibility==='visible'&&c.text.length>15));assert.match(process.checkpoints[2].text,/Review and approve the sample/);assert.match(process.checkpoints[4].text,/Review and approve the pilot units/);assert.match(process.checkpoints[5].text,/Authorize production against the approved specification/);assert.match(process.reorder,/previous specification/);assert.match(process.reorder,/changes to the formula, packaging or target market/);assert.ok(process.reorderLink.startsWith('/contact?question='));assert.doesNotMatch(process.text,/\bF[0-9]+\b|\[confirm|MOQ|turnaround|lead times?|ownership|NDA|quote terms|shipment documents|release documents|awaiting confirmation|\b\d+\s*(?:days?|weeks?|months?|units?|kg)\b/i);
      }
      if(route==='/about'){
        const about=await evaluate('(()=>{const m=document.querySelector("main");return{mission:m.querySelector(".about-mission-statement").textContent,address:m.querySelector("address").textContent,founded:m.querySelector(".about-company-facts dd").textContent,story:m.querySelector(".about-story-copy p").textContent,technology:m.querySelector(".about-values").innerText,text:m.innerText,images:[...m.querySelectorAll("img")].map(i=>({src:i.getAttribute("src"),alt:i.alt})),caption:m.querySelector("figcaption").textContent};})()');
        assert.equal(about.mission,'Beauty should not come at the cost of compromise.');assert.equal(about.address,'2221 Oakland Rd, San Jose, CA 95131');assert.equal(about.founded,'2016');assert.match(about.story,/We were founded in 2016/);assert.match(about.technology,/manufacturing execution system \(MES\)/);assert.match(about.technology,/lot traceability across production/);assert.match(about.technology,/cameras on the production line/);assert.match(about.technology,/robotic cells in simulation before production/);assert.match(about.technology,/machine learning on our production data/);assert.doesNotMatch(about.text,/\bF[0-9]+\b|\[confirm|withheld|awaiting confirmation|confirm with Cody|industry.leading|square feet|employees|production capacity|in minutes/i);assert.equal(about.images.length,1);assert.match(about.images[0].src,/babylon-hero.*\.png/);assert.match(about.images[0].alt,/AI-generated/);assert.match(about.caption,/NOT A FACILITY PHOTOGRAPH/);
      }
      if(route==='/faq'){
        const faq=await evaluate('(()=>{const m=document.querySelector("main");return{questions:[...m.querySelectorAll(".faq-list summary")].map(s=>s.children[0].textContent),answers:[...m.querySelectorAll(".faq-answer p")].map(p=>p.textContent),review:m.querySelectorAll(".faq-review,.site-review").length,text:m.textContent};})()');
        assert.equal(faq.questions.length,8);assert.ok(faq.answers.every(a=>a.length>15));assert.equal(faq.review,0);
        assert.ok(faq.answers.includes('We hold ISO 22716 certification through 2027.'));
        assert.ok(faq.answers.includes('We are based at 2221 Oakland Rd, San Jose, CA 95131.'));
        assert.doesNotMatch(faq.text,/\bF[0-9]+\b|\[confirm|pending|awaiting confirmation|Reviewed:|minimum order quantity|lead times?|formula ownership|certification scope|exact expiry|Amazon|3PL|MoCRA|INCI/i);
      }
      console.log('PASS original layout '+width+'px '+route);
    }
  }
  const compareRoutes={
    '/':['.header','.header .brand','.header .nav-icon','.header .header-cta','.hero','.hero h1','.hero .intro p','.circular-photo','.process-strip','.partnership-models','.partnership-panel','.footer-invitation'],
    '/services':['.page-intro','.page-intro h1','.method-card'],
    '/capabilities':['.cap-hero-grid','.cap-hero h1','.cap-method-study','.cap-discretion'],
    '/products':['.prod-hero-heading','.prod-hero h1','.prod-topic-nav','.prod-invitation'],
    '/quality':['.qlt-hero-grid','.qlt-hero h1','.qlt-certification','.qlt-records-grid'],
    '/process':['.prc-hero-grid','.prc-hero h1','.prc-tabs','.prc-stage-panel'],
    '/about':['.about-story','.about-values-grid','.about-value','.about-mission'],
  };
  if(designReference)for(const width of [1440,390]){
    await metrics(width);
    for(const [route,selectors] of Object.entries(compareRoutes)){
      const expression='('+JSON.stringify(selectors)+').map(selector=>{const el=document.querySelector(selector);if(!el)return{selector,missing:true};const s=getComputedStyle(el);return{selector,...Object.fromEntries(["fontFamily","fontSize","fontWeight","color","backgroundColor","borderTopWidth","borderTopColor","borderRadius","paddingTop","paddingRight","paddingBottom","paddingLeft","gap","letterSpacing"].map(k=>[k,s[k]]))};})';
      await send('Page.navigate',{url:designReference+route});await waitFor('!!document.querySelector("main h1")');await evaluate('document.fonts.ready');
      const reference=await evaluate(expression);assert.ok(reference.every(s=>!s.missing));
      if(['/','/services','/quality'].includes(route))await capture('reference-'+(route==='/'?'home':route.slice(1))+'-'+width);
      await navigate(route);const restored=await evaluate(expression);assert.deepEqual(restored,reference,'Approved styles differ '+route+' '+width);
      if(['/','/services','/quality'].includes(route))await capture('restored-'+(route==='/'?'home':route.slice(1))+'-'+width);
      console.log('PASS 4afdd96 style comparison '+width+'px '+route);
    }
  }
  await metrics(1440);await navigate('/');assert.ok(await evaluate('!!document.querySelector(".orbit-system,.chemistry-art-animated,.frame-hero-canvas")'));
  await evaluate('[...document.querySelectorAll(".header .nav-links a")].find(a=>a.getAttribute("href")==="/products").click()');await waitFor('location.pathname==="/products"');
  await navigate('/services');assert.equal(await evaluate('document.querySelectorAll("main [role=tab]").length'),0);
  for(const model of ['oem','odm','co-development']){
    const state=await evaluate('(()=>{const e=document.getElementById('+JSON.stringify(model)+');return{fields:[...document.querySelectorAll("td[data-model="+e.id+"]")].map(d=>d.querySelector("span").textContent),values:[...document.querySelectorAll("td[data-model="+e.id+"]")].map(d=>({text:d.querySelector("p").innerText,visible:d.getBoundingClientRect().height>0})),top:e.getBoundingClientRect().top};})()');
    assert.deepEqual(state.fields,['You bring','We do','Formula ownership','Your approval steps']);assert.ok(state.values.every(v=>v.visible&&v.text.length>10));assert.match(state.values[2].text,/awaiting confirmation/);
  }
  assert.ok(await evaluate('(()=>{const e=["oem","odm","co-development"].map(id=>document.getElementById(id).getBoundingClientRect());return e.every(r=>Math.abs(r.top-e[0].top)<1)&&e[1].left>e[0].right&&e[2].left>e[1].right;})()'));
  await evaluate('[...document.querySelectorAll(".partnership-cta")].find(a=>a.textContent.startsWith("Start with ODM")).click()');await waitFor('location.pathname==="/contact"&&!!document.querySelector(".project-form")');assert.equal(await evaluate('document.querySelector("select[name=model]").value'),'ODM');
  await navigate('/services#co-development');await waitFor('document.getElementById("co-development").getBoundingClientRect().top<300');assert.ok(await evaluate('document.getElementById("co-development").getBoundingClientRect().top>=document.querySelector(".header").getBoundingClientRect().bottom'));
  await navigate('/capabilities');const methodImages=await evaluate('(async()=>{const images=[...document.querySelectorAll(".cap-study-photo")];for(const img of images){img.loading="eager";await img.decode();}return images.map(i=>i.src);})()');assert.equal(new Set(methodImages).size,6);
  await evaluate('document.querySelectorAll("main nav a")[4].focus()');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await waitFor('location.hash==="#scale-up"&&document.getElementById("scale-up").getBoundingClientRect().top<300');assert.ok(await evaluate('document.getElementById("scale-up").getBoundingClientRect().top>=document.querySelector(".header").getBoundingClientRect().bottom'));
  await navigate('/capabilities#quality-control');await waitFor('document.getElementById("quality-control").getBoundingClientRect().top<300');assert.equal(await evaluate('document.querySelectorAll("section[data-method]").length'),6);
  await navigate('/quality');await evaluate('Promise.all([...document.querySelectorAll("main img")].map(async i=>{i.loading="eager";await i.decode();}))');await evaluate('document.querySelector(".qlt-hero-copy a").click()');await waitFor('location.hash==="#quality-topics"&&document.querySelector("table").getBoundingClientRect().height>0');assert.equal(await evaluate('document.querySelectorAll("main table tbody tr").length'),1);assert.match(await evaluate('document.querySelector(".qlt-record-entries").innerText'),/manufacturing execution system \(MES\)/);
  await navigate('/process');assert.equal(await evaluate('document.querySelectorAll("li[data-stage]").length'),6);await evaluate('Promise.all([...document.querySelectorAll(".prc-stage-image img")].map(async i=>{i.loading="eager";await i.decode();}))');await evaluate('document.querySelectorAll(".prc-tabs a")[4].focus()');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await waitFor('location.hash==="#pilot-production"&&document.getElementById("pilot-production").getBoundingClientRect().top<300');
  await navigate('/process#formulate-or-transfer-formula');await waitFor('document.getElementById("formula").getBoundingClientRect().top<300');assert.ok(await evaluate('document.getElementById("formula").getBoundingClientRect().top>=document.querySelector(".header").getBoundingClientRect().bottom'));assert.equal(await evaluate('document.querySelectorAll("li[data-stage]").length'),6);
  await navigate('/about');assert.equal(await evaluate('document.querySelector(".about-mission-statement").textContent'),'Beauty should not come at the cost of compromise.');assert.equal(await evaluate('document.querySelectorAll(".about-value").length'),3);
  await navigate('/faq');assert.equal(await evaluate('document.querySelectorAll(".faq-list details").length'),8);
  await evaluate('document.querySelector(".faq-list summary").focus()');
  for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key:'Enter',code:'Enter',windowsVirtualKeyCode:13,...(type==='keyDown'?{text:'\r'}:{})});
  await waitFor('document.querySelector(".faq-list details").open');
  assert.ok(await evaluate('document.querySelector(".faq-answer p").textContent.length>30'));
  for(const [category,count] of [['Products',1],['Quality',2],['All questions',8]]){
    await evaluate('([...document.querySelectorAll(".faq-filters button")].find(b=>b.textContent.startsWith('+JSON.stringify(category)+'))).click()');
    await waitFor('document.querySelectorAll(".faq-list details").length==='+count);
    assert.equal(await evaluate('document.querySelector(".faq-filters button[aria-pressed=true]").textContent.startsWith('+JSON.stringify(category)+')'),true);
  }
  await evaluate('document.querySelector(".faq-list summary").click()');
  const followup=await evaluate('document.querySelector(".faq-answer a").getAttribute("href")');
  await evaluate('document.querySelector(".faq-answer a").click()');
  await waitFor('location.pathname==="/contact"&&!!document.querySelector(".project-form")');
  assert.equal(await evaluate('location.search'),new URL(followup,base).search);
  assert.equal(await evaluate('!!document.querySelector(".assistant-toggle")'),false);
  for(const width of [1101,1100,390,320]){await metrics(width);await navigate('/');const menu=await evaluate('getComputedStyle(document.querySelector(".menu-toggle")).display');assert.equal(menu==='none',width>1100);if(width<=1100){await evaluate('document.querySelector(".menu-toggle").click()');assert.equal(await evaluate('document.querySelector("#main-navigation a").getAttribute("href")'),'/about');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});assert.equal(await evaluate('document.activeElement.classList.contains("menu-toggle")'),true);}}
  await metrics(1440);await navigate('/');
  const chemistry=await evaluate('(()=>{const s=document.querySelector(".science-scroll"),pin=s.firstElementChild;const top=parseFloat(getComputedStyle(pin).top)||96;return{start:s.getBoundingClientRect().top+scrollY-top,distance:s.offsetHeight-pin.offsetHeight};})()');
  assert.ok(chemistry.distance>0);await evaluate('scrollTo(0,'+(chemistry.start+chemistry.distance*.85)+')');await waitFor('Number(document.querySelector(".chemistry-art-animated").dataset.progress)>.5');const down=await evaluate('Number(document.querySelector(".chemistry-art-animated").dataset.progress)');await evaluate('scrollTo(0,'+chemistry.start+')');await waitFor('Number(document.querySelector(".chemistry-art-animated").dataset.progress)<.2');
  const film=await evaluate('(()=>{const s=document.querySelector(".frame-hero"),stage=s.querySelector(".frame-hero-stage");const top=parseFloat(getComputedStyle(stage).top)||0;return{start:s.getBoundingClientRect().top+scrollY-top,distance:s.offsetHeight-stage.offsetHeight};})()');
  await evaluate('scrollTo(0,'+(film.start+film.distance*.7)+')');await waitFor('document.querySelector(".frame-hero-canvas").dataset.ready==="true"&&Number(document.querySelector(".frame-hero-canvas").dataset.frame)>40');const forward=await evaluate('Number(document.querySelector(".frame-hero-canvas").dataset.frame)');await evaluate('scrollTo(0,'+(film.start+film.distance*.1)+')');await waitFor('Number(document.querySelector(".frame-hero-canvas").dataset.frame)<'+forward);
  console.log('PASS original chemistry and cinematic animations scrub forward and reverse');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await waitFor('Number(document.querySelector(".chemistry-art-animated").dataset.progress)===0');
  assert.deepEqual(errors,[]);assert.deepEqual(requests.filter(url=>/^https?:/.test(url)&&!url.startsWith(base)&&!(designReference&&url.startsWith(designReference))),[]);
  console.log('PASS original selectors/accordion/stepper, image switching, approved copy, hidden disconnected chatbot, keyboard navigation and reduced motion.');
} finally {ws.close();await fetch('http://127.0.0.1:'+port+'/json/close/'+tab.id).catch(()=>{});}
