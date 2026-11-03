import { inquiryReady, reply } from '../server/security.js';
export default function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return reply(res, 405, { error: 'Method not allowed.' }); }
  const live = inquiryReady();
  return reply(res, 200, { mode: live ? 'live' : 'preview', ...(live ? { siteKey: process.env.TURNSTILE_SITE_KEY } : {}) });
}
