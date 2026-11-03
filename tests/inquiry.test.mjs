import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createInquiryHandler } from '../api/inquiry.js';
import faqHandler from '../api/faq.js';
import { validateInquiry, inquiryText } from '../src/inquirySchema.js';
import { approvedFAQ, getApprovedFAQ, certification, certificationVisible } from '../src/content.js';
import { readJSON } from '../server/security.js';

const env = { SITE_ORIGIN: 'https://babylon.example', TURNSTILE_SITE_KEY: 'public', TURNSTILE_SECRET_KEY: 'secret', UPSTASH_REDIS_REST_URL: 'https://redis.example', UPSTASH_REDIS_REST_TOKEN: 'token', RATE_LIMIT_SECRET: 'test-private-rate-key', RESEND_API_KEY: 'key', INQUIRY_FROM: 'Babylon <projects@babylon.example>', INQUIRY_TO: 'cody@babylon.example', VERCEL: '1' };
const data = () => ({ name: 'Test Brand Owner', email: 'owner@example.com', company: 'Test Brand', model: 'OEM', product: 'Creams', otherProduct: '', formula: '', quantity: '', launch: '', markets: [], message: '', website: '', token: 'single-use-token', sessionId: '12345678-1234-1234-1234-123456789abc' });
function response() { return { headers: {}, statusCode: 0, setHeader(key, value) { this.headers[key] = value; }, end(value) { this.body = JSON.parse(value); } }; }
function request(body = data(), changes = {}) { return { method: 'POST', headers: { origin: env.SITE_ORIGIN, 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.123', 'x-forwarded-for': 'forged-ip' }, body, ...changes }; }
const jsonResponse = (body, ok = true) => ({ ok, json: async () => body });
async function run({ body = data(), requestChanges, configuration = env, limiter = 1, challenge = { success: true, action: 'inquiry', hostname: 'babylon.example' }, delivered = true, fail = false } = {}) {
  const calls = []; const res = response();
  const fetcher = async (url, options) => {
    calls.push({ url, ...options });
    if (fail) throw new Error('offline');
    if (url === env.UPSTASH_REDIS_REST_URL) return jsonResponse({ result: limiter });
    if (url.includes('siteverify')) return jsonResponse(challenge);
    if (url === 'https://api.resend.com/emails') return jsonResponse(delivered ? { id: 'delivery-test' } : {}, delivered);
    throw new Error('Unexpected external request');
  };
  await createInquiryHandler({ env: configuration, fetcher })(request(body, requestChanges), res);
  return { res, calls };
}
test('required and optional inquiry fields validate independently', () => {
  assert.equal(validateInquiry(data()), null);
  for (const field of ['name', 'email', 'company', 'model', 'product']) assert.ok(validateInquiry({ ...data(), [field]: '' }), field);
  assert.ok(validateInquiry({ ...data(), product: 'Other' }));
  assert.equal(validateInquiry({ ...data(), product: 'Other', otherProduct: 'A new format' }), null);
  assert.ok(validateInquiry({ ...data(), quantity: 'Custom free text' }));
  assert.ok(validateInquiry({ ...data(), message: 'x'.repeat(3001) }));
  assert.ok(validateInquiry({ ...data(), markets: ['Invented'] }));
  assert.ok(validateInquiry({ ...data(), launch: '2027-13' }));
});
test('brief contains optional planning details without inventing values', () => {
  assert.match(inquiryText(data()), /Target launch: Not provided/);
  assert.match(inquiryText({ ...data(), product: 'Other', otherProduct: 'Custom format', markets: ['US', 'EU'] }), /Product: Other — Custom format/);
});
test('unconfigured backend fails closed without contacting providers', async () => {
  const { res, calls } = await run({ configuration: {} }); assert.equal(res.statusCode, 503); assert.equal(calls.length, 0);
});
test('method and origin are enforced before any third-party requests', async () => {
  assert.equal((await run({ requestChanges: { method: 'GET' } })).res.statusCode, 405);
  const result = await run({ requestChanges: { headers: { origin: 'https://attacker.example' } } });
  assert.equal(result.res.statusCode, 403); assert.equal(result.calls.length, 0);
});
test('honeypot, malformed fields, and absent challenge token are rejected', async () => {
  for (const body of [null, { ...data(), website: 'spam' }, { ...data(), email: 'invalid' }, { ...data(), token: '' }]) {
    const { res, calls } = await run({ body }); assert.equal(res.statusCode, 400); assert.equal(calls.length, 0);
  }
});
test('rate limiting is durable, atomic, and hashes IP and session identifiers', async () => {
  const { res, calls } = await run({ limiter: 0 }); assert.equal(res.statusCode, 429); assert.equal(calls.length, 1);
  const command = JSON.parse(calls[0].body); assert.equal(command[0], 'EVAL'); assert.equal(command[2], '2');
  assert.match(command[3], /^babylon:inquiry:ip:[a-f0-9]{64}$/); assert.match(command[4], /^babylon:inquiry:session:[a-f0-9]{64}$/);
  assert.equal(command[5], '3'); assert.equal(command[6], '900');
  assert.ok(!calls[0].body.includes('192.0.2.123')); assert.ok(!calls[0].body.includes(data().sessionId));
});
test('failed, wrong-action, and wrong-host challenges never deliver an email', async () => {
  for (const challenge of [{ success: false }, { success: true, action: 'other', hostname: 'babylon.example' }, { success: true, action: 'inquiry', hostname: 'attacker.example' }]) {
    const { res, calls } = await run({ challenge }); assert.equal(res.statusCode, 400); assert.equal(calls.length, 2);
  }
});
test('success only follows verified challenge and acknowledged email delivery', async () => {
  const { res, calls } = await run(); assert.equal(res.statusCode, 200); assert.equal(res.body.success, true); assert.equal(calls.length, 3);
  const verification = JSON.parse(calls[1].body); assert.equal(verification.remoteip, '192.0.2.123');
  const email = JSON.parse(calls[2].body); assert.deepEqual(email.to, [env.INQUIRY_TO]); assert.equal(email.reply_to, data().email); assert.match(email.text, /Test Brand/);
});
test('provider failures do not return false success or expose internal errors', async () => {
  assert.equal((await run({ delivered: false })).res.statusCode, 502);
  const { res } = await run({ fail: true }); assert.equal(res.statusCode, 503); assert.ok(!JSON.stringify(res.body).includes('offline'));
});
test('oversized and malformed JSON are rejected', async () => {
  await assert.rejects(readJSON(request('invalid')), { status: 400 });
  await assert.rejects(readJSON(request({ message: 'x'.repeat(12001) })), { status: 413 });
  const req = Readable.from(['{"message":"', 'x'.repeat(13000), '"}']); req.headers = { 'content-type': 'application/json' };
  await assert.rejects(readJSON(req), { status: 413 });
});
test('certification hides after confirmed year or exact expiry and supports manual removal', () => {
  assert.equal(certificationVisible(new Date('2027-12-31T12:00:00Z')), true);
  assert.equal(certificationVisible(new Date('2028-01-01T00:00:00Z')), false);
  certification.confirmedExpiry = '2027-06-01';
  assert.equal(certificationVisible(new Date('2027-06-01T00:00:00Z')), false);
  certification.confirmedExpiry = null; certification.enabled = false;
  assert.equal(certificationVisible(new Date('2026-11-02T00:00:00Z')), false); certification.enabled = true;
});
test('draft FAQ content never becomes chatbot knowledge and backend stays a prototype', async () => {
  assert.equal(approvedFAQ.length, 0);
  const res = response(); await faqHandler(request(), res); assert.equal(res.statusCode, 503); assert.match(res.body.error, /prototype/);
});
test('FAQ approval requires non-empty content and a real calendar review date', () => {
  const approved = { id: 'reviewed', status: 'approved', answer: 'Reviewer-approved text.', reviewedAt: '2026-11-02' };
  const entries = [approved, { ...approved, id: 'draft', status: 'pending' }, { ...approved, id: 'blank', answer: ' ' }, { ...approved, id: 'missing-date', reviewedAt: null }, { ...approved, id: 'invalid-date', reviewedAt: '2026-02-30' }];
  assert.deepEqual(getApprovedFAQ(entries).map(item => item.id), ['reviewed']);
});
