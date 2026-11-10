import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const assets = await readdir(new URL('../dist/assets/', import.meta.url));
const htmlFiles = (await readdir(new URL('../dist/', import.meta.url))).filter(name => name.endsWith('.html')).map(name=>'../dist/'+name);
const productionFiles = [...htmlFiles, ...assets.filter(name => /\.(js|css)$/.test(name)).map(name => '../dist/assets/' + name)];
test('production output contains no draft confirmation placeholders', async () => {
  for (const path of productionFiles) {
    const content = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.doesNotMatch(content, /\[(?:confirm(?: with Cody)?|Cody to confirm)[^\]]*\]/i, path);
  }
});
test('production output excludes About, FAQ and site-wide review modules', async () => {
  assert.ok(!assets.some(name => /(?:SiteReview|AboutReview|FAQPageReview|siteReview|aboutReview)/.test(name)));
  const bundle = (await Promise.all(productionFiles.filter(path => path.endsWith('.js')).map(path => readFile(new URL(path, import.meta.url), 'utf8')))).join('\n');
  for (const marker of ['DEVELOPMENT ONLY · CODY’S REVIEW', 'DEVELOPMENT ONLY · FAQ REVIEW', 'Questions awaiting confirmation', 'DRAFT REVIEW · NOT PUBLIC CONTENT', 'UNCONFIRMED EXAMPLE', 'Cody’s About page review', 'Draft value: Affordable Prices']) assert.ok(!bundle.includes(marker), marker);
});

test('frontend output excludes server credentials and server-only API implementations', async () => {
  const bundle = (await Promise.all(productionFiles.filter(path => path.endsWith('.js')).map(path => readFile(new URL(path, import.meta.url), 'utf8')))).join('\n');
  for (const marker of ['UPSTASH_REDIS_REST_TOKEN', 'RATE_LIMIT_SECRET', 'TURNSTILE_SECRET_KEY', 'RESEND_API_KEY', 'INQUIRY_FROM', 'INQUIRY_TO', 'OPENAI_API_KEY', 'matchFAQWithOpenAI', 'createFAQHandler', 'createInquiryHandler', 'createConfigHandler', 'inspectResendSender', 'inspectInquiryConfiguration', 'createHmac']) assert.ok(!bundle.includes(marker), marker);
  for (const marker of ['SUPABASE_SECRET_KEY','SUPABASE_ACCESS_TOKEN','sb_secret_','createSupabaseInquiryHandler','createSupabaseProxy','signInquiry']) assert.ok(!bundle.includes(marker),marker);
});
