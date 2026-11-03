import { useEffect, useRef, useState } from 'react';
import { models, productTypes, formulaStatuses, quantities, markets, validateInquiry, inquiryText } from '../inquirySchema.js';

export function downloadText(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
let securityScript;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!securityScript) securityScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => { script.remove(); securityScript = null; reject(new Error('The security check could not load. Please try again.')); };
    document.head.appendChild(script);
  });
  return securityScript;
}
export default function ProjectForm() {
  const params = new URLSearchParams(window.location.search);
  const [config, setConfig] = useState({ mode: 'preview' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [product, setProduct] = useState(productTypes.includes(params.get('product')) ? params.get('product') : '');
  const [token, setToken] = useState('');
  const [securityStarted, setSecurityStarted] = useState(false);
  const widgetContainer = useRef(null);
  const widget = useRef(null);
  const form = useRef(null);
  const statusRef = useRef(null);
  const sessionId = useRef(crypto.randomUUID());
  const attempts = useRef([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/config', { signal: controller.signal }).then(response => response.ok ? response.json() : null).then(value => { if (value?.mode === 'live' && value.siteKey) setConfig(value); }).catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!securityStarted || config.mode !== 'live') return;
    let disposed = false;
    loadTurnstile().then(turnstile => {
      if (disposed) return;
      widget.current = turnstile.render(widgetContainer.current, {
        sitekey: config.siteKey, action: 'inquiry', appearance: 'interaction-only',
        callback: value => { setToken(value); setStatus(null); },
        'expired-callback': () => setToken(''),
        'error-callback': () => { setToken(''); setStatus({ error: true, text: 'The security check needs another try. Use “Retry security check” below.' }); },
      });
    }).catch(error => { if (!disposed) setStatus({ error: true, text: error.message }); });
    return () => { disposed = true; if (widget.current !== null) window.turnstile?.remove(widget.current); widget.current = null; };
  }, [securityStarted, config.mode, config.siteKey]);
  useEffect(() => { if (status) statusRef.current?.focus(); }, [status]);
  function dataFromForm() {
    const fields = new FormData(form.current);
    return { name: String(fields.get('name') || '').trim(), email: String(fields.get('email') || '').trim(), company: String(fields.get('company') || '').trim(), model: fields.get('model'), product: fields.get('product'), otherProduct: String(fields.get('otherProduct') || '').trim(), formula: fields.get('formula') || '', quantity: fields.get('quantity') || '', launch: fields.get('launch') || '', markets: fields.getAll('markets'), message: String(fields.get('message') || '').trim(), website: fields.get('website') || '' };
  }
  async function submit(event) {
    event.preventDefault(); if (sending) return;
    setStatus(null);
    const data = dataFromForm();
    if (data.website) { setStatus({ error: true, text: 'This inquiry could not be processed.' }); return; }
    const error = validateInquiry(data);
    if (error) { setStatus({ error: true, text: error }); return; }
    const now = Date.now(); attempts.current = attempts.current.filter(time => now - time < 60000);
    if (attempts.current.length >= 3) { setStatus({ error: true, text: 'Please wait a minute before trying again.' }); return; }
    attempts.current.push(now);
    if (config.mode !== 'live') {
      downloadText('babylon-project-brief.txt', `${inquiryText(data)}\n\nLOCAL PREVIEW — This brief has not been sent to Babylon.`);
      setStatus({ error: false, text: 'Your project brief is downloaded. This is a local preview; nothing has been sent to Babylon.' }); return;
    }
    if (!token) { setStatus({ error: true, text: 'Please prepare or retry the security check before sending.' }); return; }
    setSending(true);
    try {
      const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, token, sessionId: sessionId.current }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your inquiry could not be sent. Please try again.');
      form.current.reset(); setProduct('');
      setStatus({ error: false, text: 'Your inquiry has been sent to Babylon. Thank you for sharing your project.' });
    } catch (error) { setStatus({ error: true, text: error.message || 'Connection interrupted. Your details are still here; please try again.' }); }
    finally { setSending(false); setToken(''); if (widget.current !== null) window.turnstile?.reset(widget.current); }
  }
  return <form ref={form} className="project-form" onSubmit={submit}>
    <div className={`form-mode ${config.mode === 'live' ? 'live' : ''}`}><span className="status-dot" aria-hidden="true" /><div><strong>{config.mode === 'live' ? 'Project inquiry' : 'LOCAL PREVIEW · DOWNLOAD ONLY'}</strong><p>{config.mode === 'live' ? 'Your inquiry will be sent securely to Babylon.' : 'Submission is not connected. Complete the form to download your brief; no details are sent.'}</p></div></div>
    <p className="form-required-note">Fields marked <span aria-hidden="true">*</span> are required.</p>
    <div className="form-grid">
      <label>Your name <span aria-hidden="true">*</span><input name="name" autoComplete="name" required maxLength={120} /></label>
      <label>Work email <span aria-hidden="true">*</span><input type="email" name="email" autoComplete="email" required maxLength={254} /></label>
      <label className="full-field">Brand / company <span aria-hidden="true">*</span><input name="company" autoComplete="organization" required maxLength={160} /></label>
      <label>How do you want to work? <span aria-hidden="true">*</span><select name="model" required defaultValue={models.includes(params.get('model')) ? params.get('model') : ''}><option value="" disabled>Select a partnership</option>{models.map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Product type <span aria-hidden="true">*</span><select name="product" required value={product} onChange={event => setProduct(event.target.value)}><option value="" disabled>Select a product format</option>{productTypes.map(value => <option key={value}>{value}</option>)}</select></label>
      {product === 'Other' && <label className="full-field">Tell us the product type <span aria-hidden="true">*</span><input name="otherProduct" required maxLength={160} /></label>}
      <p className="field-help full-field">Product formats are subject to capability confirmation.</p>
      <label>Formula status <span className="optional">optional</span><select name="formula" defaultValue=""><option value="">Select if known</option>{formulaStatuses.map(value => <option key={value}>{value}</option>)}</select></label>
      <label>First order quantity <span className="optional">optional</span><select name="quantity" defaultValue="" aria-describedby="quantity-help"><option value="">Choose an estimated range</option>{quantities.map(value => <option key={value}>{value}</option>)}</select></label>
      <p className="field-help full-field" id="quantity-help">Quantity ranges help frame the discussion. They are not confirmed MOQs or accepted order sizes.</p>
      <label className="full-field">Target launch <span className="optional">optional · month / year</span><input type="month" name="launch" min="2026-01" max="2099-12" /></label>
      <fieldset className="full-field markets-field"><legend>Target markets <span className="optional">optional</span></legend><div>{markets.map(value => <label key={value}><input type="checkbox" name="markets" value={value} />{value}</label>)}</div></fieldset>
      <label className="full-field">Anything else we should know? <span className="optional">optional</span><textarea name="message" maxLength={3000} rows={5} defaultValue={params.get('question')?.slice(0, 3000) || ''} aria-describedby="message-help" /></label>
      <p id="message-help" className="field-help full-field">Up to 3,000 characters. Please do not include confidential formulas or proprietary process settings.</p>
    </div>
    <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {config.mode === 'live' && <div className="security-area"><button className="arrow-link" type="button" onClick={() => { if (securityStarted && widget.current !== null) { setToken(''); window.turnstile?.reset(widget.current); } else { setSecurityStarted(false); requestAnimationFrame(() => setSecurityStarted(true)); } }}>{token ? 'Security check complete' : securityStarted ? 'Retry security check' : 'Prepare secure submission'}<span aria-hidden="true">↗</span></button><div ref={widgetContainer} /></div>}
    {status && <p ref={statusRef} tabIndex={-1} className={`form-result ${status.error ? 'error' : ''}`} role={status.error ? 'alert' : 'status'}>{status.text}</p>}
    <div className="form-submit-row"><button type="submit" className="button" disabled={sending}>{sending ? 'Sending your inquiry…' : config.mode === 'live' ? 'Send project inquiry' : 'Download project brief'}<span aria-hidden="true">↗</span></button><p>{config.mode === 'live' ? 'Only the details you enter are sent with your inquiry.' : 'A text file, saved on your device.'}</p></div>
  </form>;
}
