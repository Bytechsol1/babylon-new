import { useEffect, useRef, useState } from 'react';
import { models, productTypes, formulaStatuses, quantities, markets, validateInquiry } from '../inquirySchema.js';

async function readSubmissionConfig(signal) {
  const response = await fetch('/api/config', { signal, credentials: 'same-origin', cache: 'no-store' });
  const value = await response.json();
  if (response.ok && value?.mode === 'live') return { mode: 'live' };
  if (response.ok && value?.mode === 'preview') return { mode: 'preview' };
  return { mode: 'error' };
}

export default function ProjectForm() {
  const params = new URLSearchParams(window.location.search);
  const [config, setConfig] = useState({ mode: 'checking' });
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [product, setProduct] = useState(productTypes.includes(params.get('product')) ? params.get('product') : '');
  const form = useRef(null);
  const statusRef = useRef(null);
  const sessionId = useRef(null);
  const attempts = useRef([]);
  const inFlight = useRef(false);
  const activeRequest = useRef(null);
  const mounted = useRef(true);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; activeRequest.current?.abort(); }; }, []);
  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 10000);
    setConfig({ mode: 'checking' });
    readSubmissionConfig(controller.signal)
      .then(value => { if (!controller.signal.aborted) setConfig(value); })
      .catch(() => { if (!controller.signal.aborted || timedOut) setConfig({ mode: 'error' }); })
      .finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);
  useEffect(() => { if (status) statusRef.current?.focus(); }, [status]);

  function dataFromForm() {
    const fields = new FormData(form.current);
    return {
      name: String(fields.get('name') || '').trim(), email: String(fields.get('email') || '').trim(),
      company: String(fields.get('company') || '').trim(), model: fields.get('model'), product: fields.get('product'),
      otherProduct: String(fields.get('otherProduct') || '').trim(), formula: fields.get('formula') || '',
      quantity: fields.get('quantity') || '', launch: fields.get('launch') || '', markets: fields.getAll('markets'),
      message: String(fields.get('message') || '').trim(), website: fields.get('website') || '',
    };
  }

  function inquirySession() {
    if (sessionId.current) return sessionId.current;
    try { const saved = sessionStorage.getItem('babylon-inquiry-session'); if (/^[a-zA-Z0-9-]{16,80}$/.test(saved || '')) sessionId.current = saved; } catch { /* Storage is optional. */ }
    if (!sessionId.current) sessionId.current = crypto.randomUUID();
    try { sessionStorage.setItem('babylon-inquiry-session', sessionId.current); } catch { /* Keep it in memory. */ }
    return sessionId.current;
  }

  async function refreshConnection() {
    if (inFlight.current) return;
    inFlight.current = true; setRefreshing(true); setStatus(null);
    const controller = new AbortController(); activeRequest.current = controller;
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const next = await readSubmissionConfig(controller.signal);
      if (!mounted.current) return;
      setConfig(next);
      setStatus(next.mode === 'live'
        ? { type: 'info', text: 'Secure inquiry storage is ready. You can submit the form now.' }
        : { type: 'error', text: 'Inquiry storage is temporarily unavailable. Your details are still here; please try again.' });
    } catch {
      if (mounted.current) { setConfig({ mode: 'error' }); setStatus({ type: 'error', text: 'Secure inquiry storage could not be reached. Your details are still here; please retry.' }); }
    } finally {
      clearTimeout(timer); activeRequest.current = null; inFlight.current = false;
      if (mounted.current) setRefreshing(false);
    }
  }

  async function submit(event) {
    event.preventDefault(); if (inFlight.current) return;
    setStatus(null);
    const data = dataFromForm();
    if (data.website) { setStatus({ type: 'error', text: 'This inquiry could not be processed.' }); return; }
    const error = validateInquiry(data);
    if (error) { setStatus({ type: 'error', text: error }); return; }
    if (config.mode !== 'live') { await refreshConnection(); return; }
    const now = Date.now(); attempts.current = attempts.current.filter(time => now - time < 60000);
    if (attempts.current.length >= 3) { setStatus({ type: 'error', text: 'Please wait a minute before trying again.' }); return; }
    attempts.current.push(now); inFlight.current = true; setSending(true);
    const controller = new AbortController(); activeRequest.current = controller;
    const timer = setTimeout(() => controller.abort(), 35000);
    try {
      const response = await fetch('/api/inquiry', { method: 'POST', credentials: 'same-origin', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, sessionId: inquirySession() }) });
      const result = await response.json();
      if (!response.ok || result?.success !== true) throw Object.assign(new Error('Submission not acknowledged.'), { publicMessage: typeof result?.error === 'string' ? result.error : 'Your inquiry could not be saved. Your details are still here; please try again.' });
      if (!mounted.current) return;
      form.current.reset(); setProduct('');
      setStatus({ type: 'success', text: 'Thank you. Your inquiry has been saved for the Babylon team to review.' });
    } catch (error) {
      if (mounted.current) setStatus({ type: 'error', text: error.publicMessage || 'Your inquiry could not be saved. Your details are still here; please try again.' });
    } finally {
      clearTimeout(timer); activeRequest.current = null; inFlight.current = false;
      if (mounted.current) setSending(false);
    }
  }

  return <form id="project-inquiry" ref={form} className="project-form" onSubmit={submit} aria-busy={sending || refreshing || config.mode === 'checking'}>
    <p className="form-required-note">Fields marked <span aria-hidden="true">*</span> are required.</p>
    <fieldset className="project-fields" disabled={sending || refreshing}><legend className="sr-only">Project details</legend><div className="form-grid">
      <label>Your name <span aria-hidden="true">*</span><input name="name" autoComplete="name" required maxLength={120} /></label>
      <label>Work email <span aria-hidden="true">*</span><input type="email" name="email" autoComplete="email" required maxLength={254} /></label>
      <label className="full-field">Brand / company <span aria-hidden="true">*</span><input name="company" autoComplete="organization" required maxLength={160} /></label>
      <label>Work model <span aria-hidden="true">*</span><select name="model" required defaultValue={models.includes(params.get('model')) ? params.get('model') : ''}><option value="" disabled>Select a partnership</option>{models.map(value => <option key={value}>{value}</option>)}</select></label>
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
    </div></fieldset>
    <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {(refreshing || config.mode === 'checking') && <p className="form-pending" role="status">Checking secure inquiry storage…</p>}
    {sending && <p className="form-pending" role="status">Saving your inquiry. Please keep this page open.</p>}
    {status && <p ref={statusRef} tabIndex={-1} className={`form-result ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.text}</p>}
    {status?.type === 'error' && config.mode !== 'live' && <button type="button" className="form-connection-retry" disabled={refreshing} onClick={refreshConnection}>Retry connection</button>}
    {status?.type === 'error' && config.mode === 'live' && <button type="button" className="form-connection-retry" disabled={sending} onClick={() => form.current?.requestSubmit()}>Retry submission</button>}
    <div className="form-submit-row"><button type="submit" className="button" disabled={sending || refreshing || config.mode === 'checking'}>{sending ? 'Submitting…' : refreshing ? 'Checking connection…' : 'Submit inquiry'}<span aria-hidden="true">↗</span></button>{config.mode === 'live' && <p>Your details are stored securely for the Babylon team to review.</p>}</div>
  </form>;
}
