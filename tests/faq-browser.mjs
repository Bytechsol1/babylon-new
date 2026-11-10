import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

// Browser-only response fixtures. They never modify FAQ records or server settings.
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4187';
const port = process.env.BROWSER_DEBUG_PORT || 9237;
const fixture = { id: 'browser-test', question: 'What is the approved browser test question?', answer: 'Exact approved browser fixture answer.', reviewedAt: '2026-11-04' };
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0, fixtures = false, scenario = 'answer', pendingAnswer = null;
const pending = new Map(), errors = [], requests = [], posts = [], cancelledRequests = new Set();
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const fulfill = (requestId, responseCode, body, headers = []) => send('Fetch.fulfillRequest', { requestId, responseCode, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, ...headers], body: Buffer.from(JSON.stringify(body)).toString('base64') });

ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.id) { const task = pending.get(data.id); pending.delete(data.id); data.error ? task?.reject(data.error) : task?.resolve(data.result); }
  else if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text);
  else if (data.method === 'Network.requestWillBeSent') requests.push(data.params.request.url);
  else if (data.method === 'Network.loadingFailed' && data.params.canceled) cancelledRequests.add(data.params.requestId);
  else if (data.method === 'Fetch.requestPaused') {
    void (async () => {
      const { requestId, request } = data.params;
      if (!fixtures) return send('Fetch.continueRequest', { requestId });
      if (request.method === 'GET') {
        if (scenario === 'status-error') return fulfill(requestId, 503, { mode: 'unavailable' });
        return fulfill(requestId, 200, { mode: 'ready', questions: [{ id: fixture.id, question: fixture.question }], approvedCount: 1 });
      }
      const body = JSON.parse(request.postData); posts.push(body);
      if (scenario === 'slow') { pendingAnswer = requestId; return; }
      if (scenario === 'network-error') return send('Fetch.failRequest', { requestId, errorReason: 'Failed' });
      if (scenario === 'server-error') return fulfill(requestId, 503, { mode: 'unavailable' });
      if (scenario === 'prototype') return fulfill(requestId, 503, { mode: 'prototype', code: 'FAQ_NOT_READY' });
      if (scenario === 'limited') return fulfill(requestId, 429, { retryAfter: 1 }, [{ name: 'Retry-After', value: '1' }]);
      if (scenario === 'markup') return fulfill(requestId, 200, { matched: true, answer: '<img src=x onerror="window.FAQ_INJECTION=true">', faqId: fixture.id, reviewedAt: fixture.reviewedAt });
      if (body.message !== fixture.question) return fulfill(requestId, 200, { matched: false, answer: null, handoff: '/contact' });
      return fulfill(requestId, 200, { matched: true, answer: fixture.answer, faqId: fixture.id, reviewedAt: fixture.reviewedAt });
    })().catch(async error => {
      // The mount-time readiness request is intentionally aborted by StrictMode
      // and navigation. Ignore only a CDP interception cancelled by the browser.
      if (error.message === 'Invalid InterceptionId.') {
        await pause(100);
        if (cancelledRequests.has(data.params.networkId)) return;
      }
      errors.push(error.message || String(error));
    });
  }
});

const evaluate = async expression => { const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description); return result.result.value; };
async function waitFor(expression) { for (let i = 0; i < 160; i++) { if (await evaluate(expression)) return; await pause(35); } throw Error('Timed out: ' + expression); }
async function route() {
  await send('Page.navigate', { url: base + '/faq' });
  try { await waitFor('!!document.querySelector("main h1")'); if (fixtures && scenario !== 'status-error') await waitFor('!!document.querySelector(".assistant-toggle")'); }
  catch (error) { console.log({ errors, body: await evaluate('document.body.innerText.slice(0,600)') }); throw error; }
  await evaluate('document.fonts.ready');
}
async function open(expected) { await evaluate('document.querySelector(".assistant-toggle").click()'); await waitFor(`document.querySelector('.assistant-service-state')?.dataset.mode===${JSON.stringify(expected)}`); }
async function type(text) { await evaluate(`(()=>{const input=document.querySelector('#assistant-question');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(text)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`); await pause(30); }
async function ask(text) { await type(text); await evaluate('document.querySelector(".assistant-panel form").requestSubmit()'); }
async function state(value) { await waitFor(`document.querySelector('.assistant-message:last-child')?.dataset.state===${JSON.stringify(value)}`); }
async function reset(mode = 'answer') { fixtures = true; scenario = mode; await route(); if (mode !== 'status-error') await open('ready'); }
async function capture(name) { await mkdir('.sites', { recursive: true }); await writeFile(`.sites/faq-chat-${name}.png`, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64')); }

try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Fetch.enable', { patterns: [{ urlPattern: base + '/api/faq', requestStage: 'Request' }] });
  for (const [width, height] of [[1440, 1000], [390, 844], [320, 568], [700, 375]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    fixtures = false; await route(); await pause(300);
    assert.equal(await evaluate('!!document.querySelector(".assistant-toggle")'), false);
    console.log('PASS unconfigured assistant launcher is hidden:', width, height);
    fixtures = true; scenario = 'answer'; await route();
    await evaluate('document.querySelector(".assistant-launcher-mascot").decode()');
    await open('ready');
    const layout = await evaluate(`(() => {const a=document.querySelector('.assistant-toggle').getBoundingClientRect(),p=document.querySelector('.assistant-panel').getBoundingClientRect();return{overflow:document.documentElement.scrollWidth>innerWidth,iconOnly:document.querySelector('.assistant-toggle').textContent.trim()===''&&!!document.querySelector('.assistant-toggle svg[aria-hidden=true]'),name:document.querySelector('.assistant-toggle').getAttribute('aria-label'),square:a.width===a.height,target:a.width>=44,inside:p.top>=0&&p.left>=0&&p.right<=innerWidth&&p.bottom<=innerHeight,log:!!document.querySelector('[role=log]'),limit:document.querySelector('#assistant-question').maxLength}})()`);
    assert.equal(layout.overflow,false);assert.equal(layout.iconOnly,true);assert.equal(layout.name,'Close FAQ assistant');assert.equal(layout.square,true);assert.equal(layout.target,true);assert.equal(layout.inside,true);assert.equal(layout.log,true);assert.equal(layout.limit,500);
    await ask('   ');assert.match(await evaluate('document.querySelector(".assistant-notice").textContent'),/Enter a question/);
    await ask('x'.repeat(501));assert.match(await evaluate('document.querySelector(".assistant-notice").textContent'),/500 characters/);
    await ask('Can you promise a delivery date?');await state('unknown');
    assert.equal(await evaluate('document.querySelectorAll(".assistant-message-handoff a").length'),2);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    assert.equal(await evaluate('!!document.querySelector(".assistant-panel")'),false);assert.equal(await evaluate('document.activeElement.className'),'assistant-toggle');
    console.log('PASS ready-only launcher, validation, unknown-question handoff, Escape:',width,height);
  }

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await reset('slow'); const before = posts.length;
  await ask(fixture.question); await waitFor('!!document.querySelector(".assistant-loading")');
  assert.equal(await evaluate('document.querySelector(".assistant-input-row button").disabled'), true);
  await evaluate('document.querySelector(".assistant-panel form").requestSubmit()'); assert.equal(posts.length, before + 1);
  assert.ok(pendingAnswer); await fulfill(pendingAnswer, 200, { matched: true, answer: fixture.answer, faqId: fixture.id, reviewedAt: fixture.reviewedAt }); pendingAnswer = null;
  await state('answered'); assert.equal(await evaluate('document.querySelector(".assistant-answer").textContent'), fixture.answer); assert.match(await evaluate('document.querySelector(".assistant-reviewed").textContent'), /2026-11-04/);
  assert.match(posts.at(-1).sessionId, /^[a-f0-9]{32}$/); assert.deepEqual(Object.keys(posts.at(-1)).sort(), ['message', 'sessionId']);
  console.log('PASS loading, exact approved response, review date, duplicate-submit protection and request shape');

  await reset(); await evaluate('document.querySelector(".assistant-suggestions button").click()'); await state('answered'); assert.equal(posts.at(-1).questionId, fixture.id);
  await ask('Please invent a price and timeline.'); await state('unknown'); assert.match(await evaluate('document.querySelector(".assistant-message:last-child .assistant-answer").textContent'), /No approved FAQ answer/);
  const handoffQuestion = posts.at(-1).message; await evaluate('document.querySelector(".assistant-message:last-child .assistant-message-handoff a").click()');
  await waitFor('location.pathname==="/contact"&&!!document.querySelector("textarea[name=message]")'); assert.equal(await evaluate('document.querySelector("textarea[name=message]").value'), handoffQuestion);
  console.log('PASS server-sourced suggestions, unknown-question fallback, contextual human handoff');

  for (const [mode, expected] of [['server-error', 'error'], ['network-error', 'error'], ['prototype', 'prototype']]) {
    await reset(mode); await ask(fixture.question); await state(expected); assert.equal(await evaluate('document.querySelectorAll(".assistant-message-handoff a").length'), 2); assert.equal(await evaluate('!!document.querySelector(".assistant-loading")'), false);
  }
  await reset('status-error'); assert.equal(await evaluate('!!document.querySelector(".assistant-toggle")'), false); scenario = 'answer';
  await route(); await open('ready');
  console.log('PASS server/network errors, readiness downgrade, unavailable status and connection retry');

  await reset('limited'); await ask(fixture.question); await state('limited'); assert.equal(await evaluate('document.querySelector(".assistant-input-row button").disabled'), true);
  const count = posts.length; await evaluate('document.querySelector(".assistant-panel form").requestSubmit()'); assert.equal(posts.length, count);
  await waitFor('!document.querySelector(".assistant-input-row button").disabled'); console.log('PASS Retry-After cooldown and blocked repeat submission');

  await reset('markup'); await ask(fixture.question); await state('answered'); assert.equal(await evaluate('document.querySelectorAll(".assistant-answer img").length'), 0); assert.equal(await evaluate('window.FAQ_INJECTION===true'), false); assert.match(await evaluate('document.querySelector(".assistant-answer").textContent'), /<img/);
  assert.deepEqual(requests.filter(url => /^https?:/.test(url) && !url.startsWith(base)), []); assert.deepEqual(errors, []);
  console.log('PASS plain-text rendering, no external browser requests, no runtime errors');
} finally { ws.close(); await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`).catch(() => {}); }
