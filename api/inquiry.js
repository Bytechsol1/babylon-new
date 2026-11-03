import { validateInquiry, inquiryText } from '../src/inquirySchema.js';
import { inquiryReady, checkOrigin, reply, readJSON, rateLimit, clientIP } from '../server/security.js';

export function createInquiryHandler({ env = process.env, fetcher = fetch } = {}) {
  return async function handler(req, res) {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(res, 405, { error: 'Method not allowed.' }); }
    if (!inquiryReady(env)) return reply(res, 503, { error: 'Inquiry submission is not connected. Please download your project brief in the local preview.' });
    if (!checkOrigin(req, env)) return reply(res, 403, { error: 'This request origin is not allowed.' });
    try {
      const data = await readJSON(req);
      const invalid = validateInquiry(data);
      if (invalid) return reply(res, 400, { error: invalid });
      if (data.website) return reply(res, 400, { error: 'This inquiry could not be processed.' });
      if (typeof data.token !== 'string' || !data.token || data.token.length > 2048) return reply(res, 400, { error: 'Please complete the security check.' });
      if (!await rateLimit(req, data.sessionId, 'inquiry', 3, 900, env, fetcher)) { res.setHeader('Retry-After', '900'); return reply(res, 429, { error: 'Too many attempts. Please try again in 15 minutes.' }); }
      const verificationResponse = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: data.token, remoteip: clientIP(req, env) }), signal: AbortSignal.timeout(10000),
      });
      if (!verificationResponse.ok) throw new Error('Security check service unavailable.');
      const verification = await verificationResponse.json();
      if (!verification.success || verification.action !== 'inquiry' || verification.hostname !== new URL(env.SITE_ORIGIN).hostname) return reply(res, 400, { error: 'The security check was not accepted. Please retry it.' });
      const delivery = await fetcher('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: env.INQUIRY_FROM, to: [env.INQUIRY_TO], reply_to: data.email, subject: 'New Babylon project inquiry', text: inquiryText(data) }), signal: AbortSignal.timeout(10000),
      });
      if (!delivery.ok) return reply(res, 502, { error: 'Delivery could not be confirmed. Your details are still in the form; please try again.' });
      const result = await delivery.json();
      if (!result.id) throw new Error('Delivery was not acknowledged.');
      return reply(res, 200, { success: true });
    } catch (error) {
      return reply(res, error.status || 503, { error: error.status ? error.message : 'Submission is temporarily unavailable. Your details are still in the form; please try again.' });
    }
  };
}
export default createInquiryHandler();
