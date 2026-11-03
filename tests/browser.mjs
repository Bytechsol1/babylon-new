import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
const port = process.env.BROWSER_DEBUG_PORT || '9237';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4187';
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0; const pending = new Map(); const errors = []; const requests = [];
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.id) { const task = pending.get(data.id); if (task) { pending.delete(data.id); data.error ? task.reject(data.error) : task.resolve(data.result); } }
  else if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text);
  else if (data.method === 'Network.requestWillBeSent') requests.push(data.params.request.url);
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async expression => { const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description); return result.result.value; };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(expression) { for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await sleep(50); } throw new Error(`Timed out: ${expression}`); }
async function navigate(path) {
  await send('Page.navigate', { url: base + path });
  await waitFor(`location.pathname === ${JSON.stringify(new URL(base + path).pathname)} && !!document.querySelector('main h1')`);
  await evaluate('document.fonts.ready');
  await evaluate('Promise.all(Array.from(document.images).filter(i => i.loading !== "lazy").map(i => i.decode().catch(()=>{})))');
  await sleep(100);
}
async function metrics(width, height = 900) { await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 }); }
async function screenshot(name) { await sleep(1000); await writeFile(`.sites/${name}.png`, Buffer.from((await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })).data, 'base64')); }
try {
  await mkdir('.sites/qa-downloads', { recursive: true });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: `${process.cwd()}/.sites/qa-downloads` });
  const routes = ['/', '/services', '/capabilities', '/products', '/quality', '/process', '/about', '/faq', '/contact'];
  for (const width of [1440, 820, 390, 320]) {
    await metrics(width, width < 600 ? 844 : 1000);
    for (const route of routes) {
      await navigate(route);
      const state = await evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth, headings:document.querySelectorAll('main h1').length, font:getComputedStyle(document.querySelector('h1')).fontFamily, title:document.title, brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src), form:!!document.querySelector('.project-form')})`);
      assert.equal(state.overflow, false, `${route} at ${width}px overflows`); assert.equal(state.headings, 1, `${route} h1`); assert.match(state.font, /Manrope/); assert.deepEqual(state.brokenImages, []);
      console.log(`PASS ${width}px ${route}`);
    }
  }
  await metrics(1440, 1000); await navigate('/'); await screenshot('qa-home-desktop');
  await evaluate('document.querySelector(".hero-image-controls button").click()'); assert.equal(await evaluate('document.querySelector(".orbit-system").classList.contains("is-paused")'), true);
  await navigate('/services#odm'); assert.equal(await evaluate('document.querySelector("[role=tab][aria-selected=true]").textContent.includes("ODM")'), true);
  await evaluate('document.querySelector("[role=tab][aria-selected=true]").dispatchEvent(new KeyboardEvent("keydown", {key:"ArrowRight",bubbles:true}))');
  assert.equal(await evaluate('document.querySelector("[role=tab][aria-selected=true]").textContent.includes("Co-development")'), true);
  await screenshot('qa-services-desktop');
  await navigate('/faq'); await evaluate('Array.from(document.querySelectorAll(".faq-filters button")).find(b=>b.textContent.startsWith("Planning")).click()');
  assert.equal(await evaluate('document.querySelectorAll(".faq-list details").length'), 3);
  await evaluate('document.querySelector(".faq-list summary").click()'); assert.equal(await evaluate('document.querySelector(".faq-list details").open'), true);
  assert.equal(await evaluate('document.querySelectorAll(".faq-answer .faq-review").length'), 0);
  assert.match(await evaluate('document.querySelector(".faq-answer").innerText'), /Ask Babylon about this/);
  assert.equal(await evaluate('document.querySelector("main").innerText.includes("[confirm")'), false);
  await navigate('/contact?model=OEM&product=Other&question=Can%20we%20discuss%20a%20new%20format%3F');
  assert.equal(await evaluate('document.querySelector("select[name=model]").value'), 'OEM');
  assert.equal(await evaluate('document.querySelector("input[name=otherProduct]").required'), true);
  assert.equal(await evaluate('document.querySelector("textarea[name=message]").value'), 'Can we discuss a new format?');
  assert.equal(await evaluate('document.querySelector(".project-form").checkValidity()'), false);
  await evaluate(`(()=>{const f=document.querySelector('.project-form');for(const [name,value] of Object.entries({name:'Browser Test',email:'owner@example.com',company:'Test Brand',otherProduct:'New format'}))f.elements[name].value=value;f.requestSubmit()})()`);
  await waitFor('!!document.querySelector(".form-result")'); assert.match(await evaluate('document.querySelector(".form-result").textContent'), /nothing has been sent/);
  await screenshot('qa-contact-desktop');
  await metrics(390, 844); await navigate('/'); await screenshot('qa-home-mobile');
  await evaluate('document.querySelector(".menu-toggle").click()'); assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'), 'true');
  assert.equal(await evaluate('document.querySelector("#main-navigation a").getAttribute("href")'), '/about');
  await evaluate('document.querySelector("#main-navigation a").click()'); await waitFor('location.pathname === "/about"'); assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'), 'false');
  await evaluate('window.history.back()'); await waitFor('location.pathname === "/"');
  await navigate('/contact'); await screenshot('qa-contact-mobile');
  await evaluate('document.querySelector(".assistant-toggle").click()'); await waitFor('document.querySelector(".assistant-service-state").dataset.mode!=="checking"');
  // Use the native input setter so React's controlled state sees the change.
  await evaluate(`(()=>{const i=document.querySelector('#assistant-question');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(i,'What is your price?');i.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await evaluate('document.querySelector(".assistant-panel form").requestSubmit()'); await waitFor('document.querySelectorAll(".assistant-question").length===1');
  assert.match(await evaluate('document.querySelector(".assistant-messages").innerText'), /no approved FAQ answer/);
  assert.match(await evaluate('document.querySelector(".assistant-message-handoff a").getAttribute("href")'), /\/contact\?question=/);
  assert.equal(await evaluate('document.querySelector("#assistant-question").maxLength'), 500);
  await screenshot('qa-assistant-mobile');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  assert.equal(await evaluate('!!document.querySelector(".assistant-panel")'), false);
  await navigate('/missing-page'); assert.match(await evaluate('document.querySelector("h1").textContent'), /different path/);
  assert.deepEqual(errors, []);
  assert.deepEqual(requests.filter(url => /^https?:/.test(url) && !url.startsWith(base)), [], 'No third-party requests before consent or security-check action');
  console.log('PASS interactions, validation, brief download, FAQ handoff, navigation history, image loading, and no pre-consent third-party requests.');
  console.log('Runtime errors:', errors);
} finally { ws.close(); await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`).catch(() => {}); }
