import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { signInquiry } from '../server/inquirySignature.js';

const source = await readFile('supabase/functions/inquiry/_generated/dashboard.ts', 'utf8');
assert.doesNotMatch(source, /from ['"]\.{1,2}\//);
const previousDeno = globalThis.Deno;
let handler, registrations = 0;
const env = { SITE_ORIGIN: 'http://127.0.0.1:4187', RATE_LIMIT_SECRET: 'fixture-only-shared-secret-longer-than-32-bytes' };
globalThis.Deno = { env: { get: name => env[name] }, serve(value) { handler = value; registrations++; } };
try {
  await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  assert.equal(registrations, 1);
  assert.equal(typeof handler, 'function');
  const unsigned = await handler(new Request('https://example.com/functions/v1/inquiry'));
  assert.equal(unsigned.status, 401);
  const fields = { method: 'GET', timestamp: String(Date.now()), origin: env.SITE_ORIGIN, ip: '', body: '', purpose: 'status' };
  const signed = await handler(new Request('https://example.com/functions/v1/inquiry', { headers: {
    'X-Inquiry-Origin': fields.origin, 'X-Inquiry-Timestamp': fields.timestamp,
    'X-Inquiry-Purpose': fields.purpose, 'X-Inquiry-Signature': signInquiry(fields, env.RATE_LIMIT_SECRET),
  } }));
  assert.equal(signed.status, 200);
  assert.deepEqual(await signed.json(), { mode: 'preview' });
  console.log('PASS dashboard bundle bootstraps without local imports, rejects unsigned calls and stays preview without database credentials. No email sent.');
} finally { if (previousDeno === undefined) delete globalThis.Deno; else globalThis.Deno = previousDeno; }
