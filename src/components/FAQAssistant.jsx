import { useEffect, useRef, useState } from 'react';
import { company } from '../content.js';
import { FAQ_MAX_LENGTH, FAQ_WINDOW_SECONDS } from '../faqPolicy.js';
import { Link } from '../router.jsx';
import assistantMascot from '../assets/chatbot/babylon-gate-assistant.webp';
import '../assistant.css';

const unavailable = 'The FAQ service could not be reached. Please try again or contact Babylon.';
const randomId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, '0')).join('');

function Handoff({ question, close }) {
  return <div className="assistant-message-handoff"><Link to={`/contact?question=${encodeURIComponent(question)}`} onClick={close}>Send this question to Babylon ↗</Link><a href={`mailto:${company.email}?subject=${encodeURIComponent('Babylon project question')}&body=${encodeURIComponent(question)}`}>Email Babylon ↗</a></div>;
}

export default function FAQAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [inputError, setInputError] = useState('');
  const [service, setService] = useState({ mode: 'checking', questions: [] });
  const [checkAttempt, setCheckAttempt] = useState(0);
  const [sending, setSending] = useState(false);
  const [limitedUntil, setLimitedUntil] = useState(0);
  const input = useRef(null);
  const toggle = useRef(null);
  const log = useRef(null);
  const session = useRef(null);
  const activeRequest = useRef(null);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const rateLimited = limitedUntil > Date.now();

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; activeRequest.current?.abort(); };
  }, []);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const close = event => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 10000);
    setService(previous => ({ ...previous, mode: 'checking' }));
    fetch('/api/faq', { signal: controller.signal, credentials: 'same-origin', cache: 'no-store' })
      .then(async response => {
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (response.ok && data.mode === 'prototype') return setService({ mode: 'prototype', questions: [] });
        if (response.ok && data.mode === 'ready' && Array.isArray(data.questions)) {
          const questions = data.questions.filter(item => typeof item.id === 'string' && typeof item.question === 'string' && item.question.trim() && item.question.length <= FAQ_MAX_LENGTH);
          if (questions.length) return setService({ mode: 'ready', questions, usesAI: data.usesAI === true });
        }
        setService({ mode: 'unavailable', questions: [] });
      })
      .catch(() => { if (!controller.signal.aborted || timedOut) setService({ mode: 'unavailable', questions: [] }); })
      .finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, [open, checkAttempt]);

  useEffect(() => {
    if (!limitedUntil) return;
    const timer = setTimeout(() => setLimitedUntil(0), Math.max(0, limitedUntil - Date.now()));
    return () => clearTimeout(timer);
  }, [limitedUntil]);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, sending, open]);

  function closePanel() { setOpen(false); toggle.current?.focus(); }

  function sessionId() {
    if (session.current) return session.current;
    try {
      const stored = sessionStorage.getItem('babylon-faq-session');
      if (/^[a-zA-Z0-9-]{16,80}$/.test(stored || '')) session.current = stored;
    } catch { /* Session storage is optional; the IP limit still applies. */ }
    if (!session.current) session.current = randomId();
    try { sessionStorage.setItem('babylon-faq-session', session.current); } catch { /* Keep it in memory. */ }
    return session.current;
  }

  function append(message) { setMessages(previous => [...previous.slice(-39), message]); }
  function update(id, changes) { setMessages(previous => previous.map(message => message.id === id ? { ...message, ...changes } : message)); }

  async function submitQuestion(rawQuestion, questionId) {
    if (inFlight.current || rateLimited || service.mode === 'checking') return;
    const text = rawQuestion.trim();
    if (!text) { setInputError('Enter a question before sending.'); input.current?.focus(); return; }
    if (rawQuestion.length > FAQ_MAX_LENGTH) { setInputError(`Please keep your question within ${FAQ_MAX_LENGTH} characters.`); input.current?.focus(); return; }
    setInputError('');
    const id = randomId();
    setQuestion('');
    if (service.mode !== 'ready') {
      append({ id, question: text, state: service.mode, answer: service.mode === 'prototype' ? 'There is no approved FAQ answer available in this prototype. Please contact Babylon with your question.' : unavailable, handoff: true });
      return;
    }

    inFlight.current = true;
    setSending(true);
    append({ id, question: text, state: 'loading' });
    const controller = new AbortController();
    activeRequest.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
    try {
      const response = await fetch('/api/faq', {
        method: 'POST', credentials: 'same-origin', signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId(), ...(questionId ? { questionId } : {}) }),
      });
      const data = await response.json();
      if (!mounted.current) return;
      if (response.status === 429) {
        const seconds = Math.min(FAQ_WINDOW_SECONDS, Math.max(1, Number(response.headers.get('Retry-After')) || Number(data.retryAfter) || FAQ_WINDOW_SECONDS));
        setLimitedUntil(Date.now() + seconds * 1000);
        update(id, { state: 'limited', answer: 'The question limit has been reached. Please try again later or contact Babylon.', handoff: true });
      } else if (!response.ok) {
        if (data.mode === 'prototype') setService({ mode: 'prototype', questions: [] });
        else if (response.status >= 500) setService({ mode: 'unavailable', questions: [] });
        update(id, { state: data.mode === 'prototype' ? 'prototype' : 'error', answer: data.mode === 'prototype' ? 'The assistant is a prototype and cannot provide approved answers yet. Please contact Babylon.' : unavailable, handoff: true });
      } else if (data.matched === true && typeof data.answer === 'string' && data.answer.trim() && typeof data.faqId === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.reviewedAt || '')) {
        update(id, { state: 'answered', answer: data.answer, reviewedAt: data.reviewedAt });
      } else if (data.matched === false && data.answer === null) {
        update(id, { state: 'unknown', answer: 'No approved FAQ answer is available for this question. Please contact Babylon.', handoff: true });
      } else throw new Error('Invalid FAQ response');
    } catch {
      if (mounted.current) update(id, { state: 'error', answer: timedOut ? 'The request timed out. Please try again or contact Babylon.' : unavailable, handoff: true });
    } finally {
      clearTimeout(timer);
      activeRequest.current = null;
      inFlight.current = false;
      if (mounted.current) setSending(false);
    }
  }

  function ask(event) { event.preventDefault(); void submitQuestion(question); }
  const statusLabel = { checking: 'Checking connection', prototype: 'Prototype', ready: 'Approved FAQ', unavailable: 'Unavailable' }[service.mode];
  const disclosure = {
    checking: 'Checking whether approved FAQ answers and the secure service are available.',
    prototype: 'Prototype. Approved FAQ answers or the secure backend are not connected yet. Use the handoff or email option for help.',
    ready: 'Answers come only from Babylon’s approved FAQ. Questions outside that FAQ go to the team.',
    unavailable: 'The FAQ service is unavailable right now. You can still contact Babylon directly.',
  }[service.mode];

  return <div className="assistant-shell">
    {open && <section id="faq-assistant" className="assistant-panel" role="dialog" aria-modal="false" aria-labelledby="assistant-heading">
      <div className="assistant-heading"><div><span className="kicker">BABYLON / FAQ ASSISTANT</span><h2 id="assistant-heading">A little guidance.</h2></div><button type="button" aria-label="Close FAQ assistant" onClick={closePanel}>×</button></div>
      <div className="assistant-service-state" data-mode={service.mode} role="status"><span className="prototype-pill">{statusLabel}</span>{service.mode !== 'ready' && service.mode !== 'checking' && <button type="button" disabled={sending} onClick={() => setCheckAttempt(value => value + 1)}>Check connection ↻</button>}</div>
      <p className="assistant-disclosure">{disclosure}{service.mode === 'ready' && service.usesAI && ' Rephrased questions are processed by OpenAI to find an approved FAQ. Do not include confidential information.'}</p>
      <div ref={log} className="assistant-messages" role="log" aria-label="FAQ conversation" aria-live="polite" aria-relevant="additions text" aria-busy={sending}>
        {messages.length === 0 && <p className="assistant-empty">Ask a question, browse the FAQ, or contact the Babylon team.</p>}
        {messages.map(message => <article key={message.id} className="assistant-message" data-state={message.state}><p className="assistant-question">{message.question}</p>{message.answer && <p className="assistant-answer">{message.answer}</p>}{message.reviewedAt && <p className="assistant-reviewed">FAQ reviewed {message.reviewedAt}</p>}{message.handoff && <Handoff question={message.question} close={closePanel} />}</article>)}
      </div>
      {sending && <p className="assistant-loading" role="status">Checking the approved FAQ…</p>}
      {service.mode === 'ready' && messages.length === 0 && <div className="assistant-suggestions" aria-label="Approved FAQ questions">{service.questions.slice(0, 3).map(item => <button type="button" key={item.id} disabled={sending || rateLimited} onClick={() => void submitQuestion(item.question, item.id)}>{item.question}<span aria-hidden="true">↗</span></button>)}</div>}
      <div className="assistant-actions"><Link to="/faq" onClick={closePanel}>Browse FAQ ↗</Link><Link to="/contact" onClick={closePanel}>Human handoff ↗</Link><a href={`mailto:${company.email}`}>Email Babylon ↗</a></div>
      <form onSubmit={ask} noValidate><label htmlFor="assistant-question">Your question</label><div className="assistant-input-row"><input id="assistant-question" ref={input} value={question} onChange={event => { setQuestion(event.target.value); setInputError(''); }} maxLength={FAQ_MAX_LENGTH} autoComplete="off" aria-invalid={inputError ? 'true' : undefined} aria-describedby={`assistant-message-limit${inputError ? ' assistant-input-notice' : ''}`} /><button type="submit" disabled={sending || rateLimited || service.mode === 'checking'} aria-label="Ask FAQ assistant">↑</button></div><div className="assistant-form-footer"><span id="assistant-message-limit">{question.length}/{FAQ_MAX_LENGTH} characters</span><span>History clears on reload</span></div>{inputError && <p id="assistant-input-notice" className="assistant-notice" role="alert">{inputError}</p>}{rateLimited && <p className="assistant-notice" role="status">Question limit reached. Please contact Babylon or try again later.</p>}</form>
    </section>}
    <button ref={toggle} type="button" className="assistant-toggle" aria-label={open ? 'Close FAQ assistant' : 'Open FAQ assistant'} title={open ? 'Close FAQ assistant' : 'Open FAQ assistant'} aria-expanded={open} aria-controls="faq-assistant" onClick={() => setOpen(previous => !previous)}>{open ? <svg className="assistant-launcher-close" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false"><path d="m14 14 20 20m0-20L14 34" /></svg> : <img className="assistant-launcher-mascot" src={assistantMascot} alt="" aria-hidden="true" width="192" height="192" draggable="false" />}</button>
  </div>;
}
