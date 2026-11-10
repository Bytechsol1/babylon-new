import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

// Provider/widget fixtures are isolated to this browser tab. No real email is sent.
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4187';
const port = process.env.BROWSER_DEBUG_PORT || 9237;
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0, fixtures = false, scenario = 'success', held = null;
const pending = new Map(), errors = [], posts = [], requests = [], cancelledRequests = new Set();
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const fulfill = (requestId, responseCode, body, contentType = 'application/json') => send('Fetch.fulfillRequest', { requestId, responseCode, responseHeaders: [{ name: 'Content-Type', value: contentType }], body: Buffer.from(contentType === 'application/json' ? JSON.stringify(body) : body).toString('base64') });
const widgetFixture = `(() => {
  let options, next = 0;
  window.__contactSecurity = { expire() { options['expired-callback'](); }, fail() { options['error-callback'](); } };
  window.turnstile = {
    render(element, value) { options = value; element.textContent = 'Security test fixture'; queueMicrotask(() => options.callback('browser-security-token')); return next++; },
    reset() { queueMicrotask(() => options.callback('browser-renewed-token')); }, remove() {}
  };
})()`;
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.id) { const task = pending.get(data.id); pending.delete(data.id); data.error ? task?.reject(new Error(data.error.message)) : task?.resolve(data.result); }
  else if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text);
  else if (data.method === 'Network.requestWillBeSent') requests.push(data.params.request.url);
  else if (data.method === 'Network.loadingFailed' && data.params.canceled) cancelledRequests.add(data.params.requestId);
  else if (data.method === 'Fetch.requestPaused') {
    void (async () => {
      const { requestId, request } = data.params;
      if (request.url.startsWith('https://challenges.cloudflare.com/turnstile/')) {
        if (!fixtures) throw new Error('Real security script requested before configuration.');
        return scenario === 'widget-error' ? send('Fetch.failRequest', { requestId, errorReason: 'Failed' }) : fulfill(requestId, 200, widgetFixture, 'application/javascript');
      }
      if (!fixtures) return send('Fetch.continueRequest', { requestId });
      if (request.url.endsWith('/api/config')) return scenario === 'config-error' ? fulfill(requestId, 503, {}) : scenario === 'pending' ? fulfill(requestId,200,{mode:'preview'}) : fulfill(requestId, 200, { mode: 'live', siteKey: 'browser-public-site-key' });
      const body = JSON.parse(request.postData); posts.push(body);
      if (scenario === 'slow') { held = requestId; return; }
      if (scenario === 'network-error') return send('Fetch.failRequest', { requestId, errorReason: 'Failed' });
      if (scenario === 'server-error') return fulfill(requestId, 502, { error: 'Delivery could not be confirmed. Please try again.' });
      if (scenario === 'sender-unverified') return fulfill(requestId, 502, { code: 'EMAIL_SENDER_UNVERIFIED', error: 'Email sending is awaiting sender verification. Your inquiry has not been sent.' });
      if (scenario === 'test-recipient-restricted') return fulfill(requestId, 502, { code: 'EMAIL_TEST_RECIPIENT_RESTRICTED', error: 'Email delivery is not enabled for Babylon yet. Your inquiry has not been sent.' });
      if (scenario === 'limited') return fulfill(requestId, 429, { error: 'Too many attempts. Please try again in 15 minutes.' });
      if (scenario === 'invalid-success') return fulfill(requestId, 200, { success: false });
      return fulfill(requestId, 200, { success: true });
    })().catch(async error => {
      // StrictMode and page navigation abort obsolete config/script GETs. CDP may
      // report the abort just after an attempted fixture fulfillment.
      if (error.message === 'Invalid InterceptionId.') {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (cancelledRequests.has(data.params.networkId)) return;
      }
      errors.push(String(error));
    });
  }
});
const evaluate = async expression => { const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text); return result.result.value; };
async function waitFor(expression) { for (let i = 0; i < 200; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 35)); } throw new Error('Timed out: ' + expression); }
async function navigate() { await send('Page.navigate', { url: base + '/contact' }); await waitFor('!!document.querySelector(".project-form") && document.querySelector(".project-form").getAttribute("aria-busy")==="false"'); await evaluate('document.fonts.ready'); }
async function fixture(mode = 'success') { fixtures = true; scenario = mode; await navigate(); }
async function fill() {
  await evaluate(`(() => {
    const form = document.querySelector('.project-form');
    for (const [name, value] of Object.entries({name:'Browser Contact Test',email:'owner@example.com',company:'Test Brand'})) form.elements[name].value = value;
    for (const [name, value] of Object.entries({model:'OEM',product:'Creams'})) { form.elements[name].value = value; form.elements[name].dispatchEvent(new Event('change', {bubbles:true})); }
  })()`);
  await waitFor('document.querySelector("select[name=product]").value === "Creams"');
}
async function prepare() { await evaluate('document.querySelector(".security-area button").click()'); await waitFor('document.querySelector(".security-area button").textContent.includes("complete")'); }
async function submit() { await evaluate('document.querySelector(".project-form").requestSubmit()'); }
async function capture(name) { await mkdir('.sites', { recursive: true }); await writeFile(`.sites/contact-${name}.png`, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64')); }

try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: `${process.cwd()}/.sites/qa-downloads` });
  await send('Fetch.enable', { patterns: [{ urlPattern: base + '/api/config' }, { urlPattern: base + '/api/inquiry' }, { urlPattern: 'https://challenges.cloudflare.com/turnstile/v0/api.js*' }] });
  for (const width of [1440, 820, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
    await navigate();
    const state = await evaluate(`(() => { const form = document.querySelector('.project-form'); return {
      banner: !!document.querySelector('.form-mode'), disabled: form.querySelector('[type=submit]').disabled, label:form.querySelector('[type=submit]').firstChild.textContent.trim(),
      required: ['name','email','company','model','product'].every(name => form.elements[name].required), emailType: form.elements.email.type,
      mailto: !!document.querySelector('main a[href^="mailto:"]'), overflow: document.documentElement.scrollWidth > innerWidth + 1
    }; })()`);
    assert.equal(state.banner,false); assert.equal(state.disabled,false); assert.equal(state.label,'Submit email'); assert.ok(state.required); assert.equal(state.emailType, 'email'); assert.equal(state.mailto, false); assert.equal(state.overflow, false);
    assert.doesNotMatch(await evaluate('document.querySelector(".project-form").innerText'),/Email setup pending|Email submission is not configured yet/);
    console.log(`PASS actual form: ${width}px, no setup banner, Submit email button, required fields, no mailto or overflow`);
  }
  assert.equal(await evaluate('!!document.querySelector(".form-download")'), false);
  assert.doesNotMatch(await evaluate('document.querySelector(".project-form").innerText'), /Download project brief|Your project brief is downloaded|No inquiry has been sent|save a copy/i);
  assert.equal(posts.length, 0);
  console.log('PASS removed brief download and unsent/download messages; no inquiry submitted');

  await fixture('pending');await fill();
  const pendingPosts=posts.length, configCount=requests.filter(url=>url.endsWith('/api/config')).length;
  await submit();await waitFor('!!document.querySelector(".form-result.error")');
  assert.equal(posts.length,pendingPosts);assert.ok(requests.filter(url=>url.endsWith('/api/config')).length>configCount);
  assert.equal(await evaluate('document.querySelector("input[name=name]").value'),'Browser Contact Test');
  assert.equal(await evaluate('!!document.querySelector(".form-result.success")'),false);
  scenario='success';await evaluate('document.querySelector(".form-connection-retry").click()');
  await waitFor('document.querySelector(".security-area button")?.textContent.includes("complete")');
  await submit();await waitFor('!!document.querySelector(".form-result.success")');
  console.log('PASS setup completed after page load: Submit rechecks readiness, pending never sends, Retry restores secure submission without losing fields');

  await fixture('slow'); await fill();
  const before = posts.length;
  await submit(); await waitFor('!!document.querySelector(".form-result.error")'); assert.equal(posts.length, before);
  await prepare();
  await evaluate('document.querySelector(".project-form").requestSubmit();document.querySelector(".project-form").requestSubmit()');
  await waitFor('!!document.querySelector(".form-pending")');
  assert.ok(await evaluate('document.querySelector(".project-fields").disabled && document.querySelector(".project-form [type=submit]").disabled'));
  for (let i = 0; i < 100 && !held; i++) await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(posts.length, before + 1); assert.ok(held);
  assert.match(posts.at(-1).sessionId, /^[a-zA-Z0-9-]{16,80}$/); assert.equal(posts.at(-1).model, 'OEM'); assert.equal(posts.at(-1).product, 'Creams');
  assert.ok(!Object.hasOwn(posts.at(-1), 'to')); assert.ok(!Object.hasOwn(posts.at(-1), 'apiKey'));
  await fulfill(held, 200, { success: true }); held = null;
  await waitFor('!!document.querySelector(".form-result.success")');
  assert.match(await evaluate('document.querySelector(".form-result").textContent'), /info@babylonllc.com/);
  assert.equal(await evaluate('document.querySelector("input[name=name]").value'), '');
  assert.equal(await evaluate('document.activeElement.classList.contains("form-result")'), true);
  console.log('PASS security prerequisite, loading, duplicate-submit protection, request shape and acknowledged success');

  for (const mode of ['server-error', 'network-error', 'limited', 'invalid-success', 'sender-unverified', 'test-recipient-restricted']) {
    await fixture(mode); await fill(); await prepare(); await submit(); await waitFor('!!document.querySelector(".form-result.error")');
    assert.equal(await evaluate('document.querySelector("input[name=name]").value'), 'Browser Contact Test');
    assert.ok(!await evaluate('!!document.querySelector(".form-result.success")'));
    assert.equal(await evaluate('document.querySelector(".project-fields").disabled'), false);
  }
  console.log('PASS server/network/limit errors and false-success responses preserve fields');

  await fixture('server-error'); await fill(); await prepare(); await submit(); await waitFor('!!document.querySelector(".form-result.error")');
  const failedSession = posts.at(-1).sessionId;
  scenario = 'success'; await prepare(); await submit(); await waitFor('!!document.querySelector(".form-result.success")'); assert.equal(posts.at(-1).sessionId, failedSession);
  console.log('PASS a fresh security check can retry without losing the stable session');

  await fixture('config-error'); assert.equal(await evaluate('document.querySelector(".project-form [type=submit]").disabled'),false);
  await fill();await submit();await waitFor('!!document.querySelector(".form-result.error")');
  scenario = 'success'; await evaluate('document.querySelector(".form-connection-retry").click()'); await waitFor('document.querySelector(".security-area button")?.textContent.includes("complete")');
  await fill(); await prepare(); await evaluate('window.__contactSecurity.expire()');
  const expiredCount = posts.length; await submit(); await waitFor('!!document.querySelector(".form-result.error")'); assert.equal(posts.length, expiredCount);
  await prepare(); await evaluate('window.__contactSecurity.fail()'); await waitFor('document.querySelector(".form-result.error")?.textContent.includes("security check")');
  await fixture('widget-error'); await fill(); await evaluate('document.querySelector(".security-area button").click()'); await waitFor('document.querySelector(".form-result.error")?.textContent.includes("could not load")');
  console.log('PASS config retry, expired/failed security tokens and script loading errors');

  await fixture(); await fill(); await prepare(); await evaluate('document.querySelector("input[name=email]").value="invalid"');
  assert.equal(await evaluate('document.querySelector(".project-form").checkValidity()'), false);
  const invalidCount = posts.length; await submit(); assert.equal(posts.length, invalidCount);
  await fill(); await evaluate('document.querySelector(".project-form").scrollIntoView({block:"start"})'); await capture('ready-mobile');
  assert.deepEqual(errors, []);
  assert.deepEqual(requests.filter(url => /^https?:/.test(url) && !url.startsWith(base) && !url.startsWith('https://challenges.cloudflare.com/turnstile/')), []);
  console.log('PASS native email validation, visible form states, no unexpected external requests or runtime errors');
} finally { ws.close(); await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`).catch(() => {}); }
