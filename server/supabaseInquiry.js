import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { normalizeInquiry, validateInquiry } from '../src/inquirySchema.js';
import { verifyInquirySignature } from './inquirySignature.js';

function respond(status, body, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}

async function readBody(request) {
  if (Number(request.headers.get('content-length') || 0) > 12000) throw new Error('too_large');
  const chunks = []; let size = 0;
  const reader = request.body?.getReader();
  if (!reader) return '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 12000) { await reader.cancel(); throw new Error('too_large'); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}

function databaseKey(env) {
  if (env?.SUPABASE_SECRET_KEYS) {
    try {
      const values = Object.values(JSON.parse(env.SUPABASE_SECRET_KEYS));
      const key = values.find(value => typeof value === 'string' && value.startsWith('sb_secret_'));
      if (key) return key;
    } catch { /* Invalid configuration is reported as unavailable. */ }
  }
  return env?.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
}

function databaseReady(env) {
  try { return new URL(env?.SUPABASE_URL).protocol === 'https:' && Boolean(databaseKey(env)); }
  catch { return false; }
}

function digest(value, secret) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

async function storeInquiry({ env, fetcher, data, ip }) {
  const key = databaseKey(env);
  const sessionHash = digest(data.sessionId, env.RATE_LIMIT_SECRET.trim());
  const sourceHash = digest(ip, env.RATE_LIMIT_SECRET.trim());
  const submissionKey = digest(JSON.stringify({ ...data, website: undefined, sessionId: undefined }), `${env.RATE_LIMIT_SECRET.trim()}:${data.sessionId}`);
  const headers = { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=representation' };
  if (!key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${key}`;
  const response = await fetcher(new URL('/rest/v1/rpc/submit_contact_inquiry', env.SUPABASE_URL), {
    method: 'POST', headers, signal: AbortSignal.timeout(15000), body: JSON.stringify({
      p_name: data.name, p_work_email: data.email, p_brand_company: data.company,
      p_work_model: data.model, p_product_type: data.product,
      p_other_product_type: data.otherProduct || null, p_formula_status: data.formula || null,
      p_quantity_estimate: data.quantity || null, p_target_launch: data.launch || null,
      p_target_markets: data.markets, p_message: data.message || null,
      p_submission_key: submissionKey, p_source_ip_hash: sourceHash, p_session_hash: sessionHash,
    }),
  });
  const text = await response.text();
  let result = null;
  try { result = text ? JSON.parse(text) : null; } catch { /* Never expose a database response. */ }
  if (response.ok && (typeof result === 'number' || Array.isArray(result) || result?.id)) return { success: true };
  if (response.status === 429 || result?.message === 'contact_rate_limited') return { rateLimited: true };
  return { success: false };
}

export function createSupabaseInquiryHandler({ env, fetcher = fetch, now = Date.now } = {}) {
  return async request => {
    if (!['GET', 'POST'].includes(request.method)) return respond(405, { error: 'Method not allowed.' }, { Allow: 'GET, POST' });
    if (!env?.RATE_LIMIT_SECRET || Buffer.byteLength(env.RATE_LIMIT_SECRET.trim()) < 32) return respond(503, { error: 'Secure submission is not configured.' });
    let body;
    try { body = request.method === 'POST' ? await readBody(request) : ''; }
    catch { return respond(413, { error: 'The request is too large.' }); }
    const origin = request.headers.get('x-inquiry-origin') || '';
    const ip = request.headers.get('x-inquiry-ip') || '';
    const purpose = request.headers.get('x-inquiry-purpose') || 'status';
    if (!['status', 'audit'].includes(purpose)) return respond(401, { error: 'Unauthorized request.' });
    const fields = { method: request.method, timestamp: request.headers.get('x-inquiry-timestamp'), origin, ip, body, purpose };
    if (!verifyInquirySignature(fields, request.headers.get('x-inquiry-signature'), env.RATE_LIMIT_SECRET.trim(), now())) return respond(401, { error: 'Unauthorized request.' });
    if (origin !== env.SITE_ORIGIN?.trim()) return respond(403, { error: 'This request origin is not allowed.' });
    if (request.method === 'GET') return respond(200, { mode: databaseReady(env) ? 'live' : 'preview', ...(purpose === 'audit' ? { diagnostics: { database: databaseReady(env) ? 'configured' : 'missing_configuration' } } : {}) });
    if (purpose !== 'status') return respond(401, { error: 'Unauthorized request.' });
    if (!isIP(ip)) return respond(400, { error: 'Secure request identity is missing.' });
    if (!databaseReady(env)) return respond(503, { error: 'Secure inquiry storage is not configured.' });
    let data;
    try { data = normalizeInquiry(JSON.parse(body)); }
    catch { return respond(400, { error: 'Please check your project details.' }); }
    const invalid = validateInquiry(data);
    if (invalid) return respond(400, { error: invalid });
    if (data.website) return respond(400, { error: 'This inquiry could not be processed.' });
    if (typeof data.sessionId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(data.sessionId)) return respond(400, { error: 'Please refresh the form and try again.' });
    try {
      const stored = await storeInquiry({ env, fetcher, data, ip });
      if (stored.success) return respond(200, { success: true });
      if (stored.rateLimited) return respond(429, { error: 'Too many attempts. Please try again in 15 minutes.' }, { 'Retry-After': '900' });
    } catch { /* Return a stable message without database or credential detail. */ }
    return respond(503, { error: 'Your inquiry could not be saved. Please try again.' });
  };
}
