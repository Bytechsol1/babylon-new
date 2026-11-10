import { Buffer } from 'node:buffer';
import { isIP } from 'node:net';
import { normalizeInquiry, validateInquiry } from '../src/inquirySchema.js';
import { clientIP, checkOrigin, readJSON, reply } from './security.js';
import { signInquiry } from './inquirySignature.js';

export const proxyRequiredEnv = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'SITE_ORIGIN', 'RATE_LIMIT_SECRET'];
export const usesSupabase = env => Boolean(env.SUPABASE_URL?.trim() || env.SUPABASE_PUBLISHABLE_KEY?.trim());
export function proxyConfigIssues(env) {
  const missing = proxyRequiredEnv.filter(name => !env[name]?.trim());
  const invalid = [];
  const check = (name, validate) => { if (!missing.includes(name)) { try { if (!validate()) invalid.push(name); } catch { invalid.push(name); } } };
  check('SUPABASE_URL', () => { const url = new URL(env.SUPABASE_URL.trim()); return url.protocol === 'https:' && url.origin === env.SUPABASE_URL.trim() && /^[a-z0-9]+\.supabase\.co$/.test(url.hostname); });
  check('SUPABASE_PUBLISHABLE_KEY', () => /^sb_publishable_[A-Za-z0-9_-]{20,200}$/.test(env.SUPABASE_PUBLISHABLE_KEY.trim()));
  check('SITE_ORIGIN', () => { const url = new URL(env.SITE_ORIGIN.trim()); return url.origin === env.SITE_ORIGIN.trim() && (url.protocol === 'https:' || url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)); });
  check('RATE_LIMIT_SECRET', () => Buffer.byteLength(env.RATE_LIMIT_SECRET.trim()) >= 32);
  return { missing, invalid };
}
export async function callInquiryFunction({ env, method, body = '', ip = '', purpose = 'status', fetcher = fetch, now = Date.now }) {
  const fields = { method, timestamp: String(now()), origin: new URL(env.SITE_ORIGIN.trim()).origin, ip, body, purpose };
  const signature = signInquiry(fields, env.RATE_LIMIT_SECRET.trim());
  return fetcher(new URL('/functions/v1/inquiry', env.SUPABASE_URL.trim()), {
    method, headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY.trim(), 'Content-Type': 'application/json', Origin: fields.origin,
      'X-Inquiry-Origin': fields.origin, 'X-Inquiry-IP': fields.ip, 'X-Inquiry-Timestamp': fields.timestamp, 'X-Inquiry-Signature': signature, 'X-Inquiry-Purpose': purpose },
    ...(method === 'POST' ? { body } : {}), signal: AbortSignal.timeout(30000),
  });
}
export function createSupabaseProxy({ env = process.env, fetcher = fetch, now = Date.now, configuration = false } = {}) {
  return async (req, res) => {
    const method = configuration ? 'GET' : 'POST';
    if (req.method !== method) { res.setHeader('Allow', method); return reply(res, 405, { error: 'Method not allowed.' }); }
    const issues = proxyConfigIssues(env);
    if (issues.missing.length || issues.invalid.length) return reply(res, configuration ? 200 : 503, configuration
      ? { mode: 'preview', reason: 'server_configuration', missing: issues.missing, invalid: issues.invalid }
      : { code: 'INQUIRY_NOT_CONFIGURED', error: 'Secure inquiry storage is not configured yet. Please try again later.' });
    if (!configuration && !checkOrigin(req, env)) return reply(res, 403, { error: 'This request origin is not allowed.' });
    try {
      let body = '', ip = '';
      if (!configuration) {
        const data = normalizeInquiry(await readJSON(req));
        const invalid = validateInquiry(data);
        if (invalid) return reply(res, 400, { error: invalid });
        if (data.website) return reply(res, 400, { error: 'This inquiry could not be processed.' });
        if (typeof data.sessionId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(data.sessionId)) return reply(res,400,{error:'Please refresh the form and try again.'});
        ip = clientIP(req, env);
        if (!isIP(ip || '')) return reply(res, 503, { error: 'Secure submission is temporarily unavailable. Please try again.' });
        body = JSON.stringify(data);
      }
      const remote = await callInquiryFunction({ env, method, body, ip, purpose: configuration ? 'audit' : 'status', fetcher, now });
      const result = await remote.json();
      if (configuration) {
        if ([401,403,404].includes(remote.status)) return reply(res,200,{mode:'preview',reason:'edge_unreachable'});
        if (!remote.ok) return reply(res, 503, { error: 'Secure inquiry storage is unavailable.' });
        return reply(res, 200, result?.mode === 'live' ? { mode: 'live' } : {
          mode: 'preview', reason: 'edge_configuration',
          ...(result?.diagnostics?.database ? { database: result.diagnostics.database } : {}),
          ...(Array.isArray(result?.diagnostics?.missing) ? { edgeMissing: result.diagnostics.missing } : {}),
        });
      }
      if (remote.ok && result?.success === true) return reply(res, 200, { success: true });
      if (remote.status === 429) { res.setHeader('Retry-After', '900'); return reply(res, 429, { error: 'Too many attempts. Please try again in 15 minutes.' }); }
      return reply(res, remote.status === 400 ? 400 : 503, { error: remote.status === 400 ? 'Please check your project details and try again.' : 'Your inquiry could not be saved. Your details are still in the form; please try again.' });
    } catch (error) {
      const requestErrors = {400:'Please check the request data.',413:'The request is too large.',415:'Please send JSON data.'};
      if (requestErrors[error?.status] && requestErrors[error.status] === error.message) return reply(res, error.status, {error:error.message});
      return reply(res, 503, { error: 'Submission is temporarily unavailable. Please try again.' });
    }
  };
}
