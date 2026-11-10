import { createHmac } from 'node:crypto';
import { Buffer } from 'node:buffer';
export function reply(res, code, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.statusCode = code; res.end(JSON.stringify(body));
}
export function checkOrigin(req, env = process.env) {
  try { return req.headers.origin === new URL(env.SITE_ORIGIN).origin; } catch { return false; }
}
export async function readJSON(req) {
  if (String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/json') throw Object.assign(new Error('Please send JSON data.'), { status: 415 });
  if (Number(req.headers['content-length'] || 0) > 12000) throw Object.assign(new Error('The request is too large.'), { status: 413 });
  if (req.body !== undefined) {
    const text = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(text) > 12000) throw Object.assign(new Error('The request is too large.'), { status: 413 });
    try { return JSON.parse(text); } catch { throw Object.assign(new Error('Please check the request data.'), { status: 400 }); }
  }
  let size = 0; const chunks = [];
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > 12000) throw Object.assign(new Error('The request is too large.'), { status: 413 });
    chunks.push(Buffer.from(chunk));
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw Object.assign(new Error('Please check the request data.'), { status: 400 }); }
}
export function clientIP(req, env = process.env) {
  // Trust only Vercel's overwritten platform header, never arbitrary X-Forwarded-For.
  return env.VERCEL ? String(req.headers['x-vercel-forwarded-for'] || '').split(',')[0].trim() : req.socket?.remoteAddress;
}
export async function redis(command, env = process.env, fetcher = fetch) {
  const response = await fetcher(env.UPSTASH_REDIS_REST_URL, {
    method: 'POST', headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command), signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Rate limit service unavailable.');
  const result = await response.json();
  if (result.error) throw new Error('Rate limit service unavailable.');
  return result.result;
}
export async function rateLimit(req, sessionId, namespace, limit, windowSeconds, env = process.env, fetcher = fetch) {
  const ip = clientIP(req, env);
  if (!ip || typeof sessionId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(sessionId)) return false;
  const hash = value => createHmac('sha256', env.RATE_LIMIT_SECRET).update(value).digest('hex');
  const script = "for i=1,2 do if tonumber(redis.call('GET',KEYS[i]) or '0') >= tonumber(ARGV[1]) then return 0 end end for i=1,2 do local n=redis.call('INCR',KEYS[i]); if n == 1 then redis.call('EXPIRE',KEYS[i],ARGV[2]) end end return 1";
  return Number(await redis(['EVAL', script, '2', `babylon:${namespace}:ip:${hash(ip)}`, `babylon:${namespace}:session:${hash(sessionId)}`, String(limit), String(windowSeconds)], env, fetcher)) === 1;
}
