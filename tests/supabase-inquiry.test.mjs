import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createInquiryHandler } from '../api/inquiry.js';
import { createConfigHandler } from '../api/config.js';
import { createSupabaseInquiryHandler } from '../server/supabaseInquiry.js';
import { callInquiryFunction, proxyConfigIssues } from '../server/inquiryProxy.js';

const edgeEnv = {
  SITE_ORIGIN: 'https://babylon.example', RATE_LIMIT_SECRET: 'fixture-shared-transport-secret-longer-than-32-bytes',
  SUPABASE_URL: 'https://fixtureproject.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'fixture-service-role-jwt',
};
const proxyEnv = {
  SITE_ORIGIN: edgeEnv.SITE_ORIGIN, RATE_LIMIT_SECRET: edgeEnv.RATE_LIMIT_SECRET,
  SUPABASE_URL: edgeEnv.SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture_public_key_for_tests_only', VERCEL: '1',
};
const data = () => ({ name: 'Test Owner', email: 'owner@example.com', company: 'Test Brand', model: 'OEM', product: 'Creams', otherProduct: '', formula: '', quantity: '', launch: '', markets: ['US'], message: 'Clearly marked test inquiry.', sessionId: '12345678-1234-1234-1234-123456789abc', website: '' });
const request = (body = data(), changes = {}) => ({ method: 'POST', headers: { origin: edgeEnv.SITE_ORIGIN, 'content-type': 'application/json', 'x-vercel-forwarded-for': '198.51.100.44' }, body, ...changes });
function response() { return { headers: {}, statusCode: 0, setHeader(k, v) { this.headers[k] = v; }, end(value) { this.body = JSON.parse(value); } }; }
function setup({ databaseStatus = 200, databaseBody = '123', tamper } = {}) {
  const databaseCalls = [], functionCalls = [];
  const databaseFetch = async (url, options = {}) => {
    databaseCalls.push({ url: String(url), ...options });
    return new Response(databaseBody, { status: databaseStatus, headers: { 'Content-Type': 'application/json' } });
  };
  const edge = createSupabaseInquiryHandler({ env: edgeEnv, fetcher: databaseFetch });
  const bridge = async (url, options) => {
    functionCalls.push({ url: String(url), ...options });
    return edge(new Request(url, tamper ? tamper(options) : options));
  };
  return { edge, bridge, databaseCalls, functionCalls };
}
async function submit(options = {}, body = data(), env = proxyEnv, requestChanges = {}) {
  const fixture = setup(options), res = response();
  await createInquiryHandler({ env, fetcher: fixture.bridge })(request(body, requestChanges), res);
  return { ...fixture, res };
}

test('signed same-origin flow stores a validated inquiry through the private database RPC', async () => {
  const { res, functionCalls, databaseCalls } = await submit();
  assert.equal(res.statusCode, 200); assert.deepEqual(res.body, { success: true });
  assert.equal(functionCalls.length, 1); assert.equal(databaseCalls.length, 1);
  const db = databaseCalls[0]; assert.match(db.url, /\/rest\/v1\/rpc\/submit_contact_inquiry$/);
  assert.equal(db.headers.apikey, edgeEnv.SUPABASE_SERVICE_ROLE_KEY);
  const payload = JSON.parse(db.body); assert.equal(payload.p_work_email, 'owner@example.com'); assert.equal(payload.p_brand_company, 'Test Brand');
  assert.doesNotMatch(db.body, /198\.51\.100\.44|12345678-1234-1234-1234-123456789abc/);
  assert.equal(payload.p_source_ip_hash.length, 64); assert.equal(payload.p_session_hash.length, 64);
});

test('email, Turnstile and Upstash configuration is not required for database submissions', async () => {
  const { res } = await submit();
  assert.equal(res.statusCode, 200); assert.equal(res.body.success, true);
  assert.ok(!Object.keys(edgeEnv).some(name => /RESEND|TURNSTILE|UPSTASH|INQUIRY_FROM|INQUIRY_TO/.test(name)));
});

test('invalid fields, honeypots, invalid sessions and foreign origins stop before the Edge Function', async () => {
  for (const [body, changes, status] of [[data(), { method: 'GET' }, 405], [data(), { headers: { origin: 'https://attacker.example' } }, 403], [{ ...data(), email: 'bad' }, {}, 400], [{ ...data(), website: 'spam' }, {}, 400], [{ ...data(), sessionId: 'bad' }, {}, 400]]) {
    const { res, functionCalls, databaseCalls } = await submit({}, body, proxyEnv, changes);
    assert.equal(res.statusCode, status); assert.equal(functionCalls.length, 0); assert.equal(databaseCalls.length, 0);
  }
});

test('unsigned or tampered Edge requests cannot reach the database', async () => {
  const direct = setup();
  const unsigned = await direct.edge(new Request(edgeEnv.SUPABASE_URL + '/functions/v1/inquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data()) }));
  assert.equal(unsigned.status, 401); assert.equal(direct.databaseCalls.length, 0);
  const altered = await submit({ tamper: options => ({ ...options, body: options.body + ' ' }) });
  assert.equal(altered.res.statusCode, 503); assert.equal(altered.databaseCalls.length, 0);
});

test('database failures and rate limits never report success', async () => {
  const failed = await submit({ databaseStatus: 500, databaseBody: JSON.stringify({ message: 'PRIVATE_DATABASE_DETAIL' }) });
  assert.equal(failed.res.statusCode, 503); assert.ok(!failed.res.body.success); assert.doesNotMatch(JSON.stringify(failed.res.body), /PRIVATE_DATABASE_DETAIL/);
  const limited = await submit({ databaseStatus: 400, databaseBody: JSON.stringify({ message: 'contact_rate_limited' }) });
  assert.equal(limited.res.statusCode, 429); assert.equal(limited.res.headers['Retry-After'], '900');
});

test('readiness exposes only live/preview mode and requires no challenge key', async () => {
  const fixture = setup(), res = response();
  await createConfigHandler({ env: proxyEnv, fetcher: fixture.bridge })({ method: 'GET', headers: {} }, res);
  assert.deepEqual(res.body, { mode: 'live' }); assert.equal(fixture.databaseCalls.length, 0);
  assert.deepEqual(proxyConfigIssues(proxyEnv), { missing: [], invalid: [] });
  const audit = await callInquiryFunction({ env: proxyEnv, method: 'GET', purpose: 'audit', fetcher: fixture.bridge });
  assert.deepEqual(await audit.json(), { mode: 'live', diagnostics: { database: 'configured' } });
});

test('migration enables RLS and grants no browser role table or RPC access', async () => {
  const sql = await readFile('supabase/migrations/20261111000000_create_contact_inquiries.sql', 'utf8');
  assert.match(sql, /enable row level security/i); assert.match(sql, /force row level security/i);
  assert.match(sql, /revoke all on table public\.contact_inquiries from anon, authenticated/i);
  assert.match(sql, /revoke all on function[\s\S]+from public, anon, authenticated/i);
  assert.doesNotMatch(sql, /create policy/i);
});
