import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { pageSEO, siteOrigin, canonicalURL, discoveryFiles } from '../src/seo.js';
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"');
const read = file => readFile(new URL('../dist/' + file, import.meta.url), 'utf8');

test('all nine public routes contain unique metadata and actual initial page HTML', async () => {
  assert.equal(Object.keys(pageSEO).length, 9);
  assert.equal(new Set(Object.values(pageSEO).map(p=>p.title)).size, 9);
  assert.equal(new Set(Object.values(pageSEO).map(p=>p.description)).size, 9);
  for (const [route, metadata] of Object.entries(pageSEO)) {
    const html = await read(route === '/' ? 'index.html' : route.slice(1) + '.html');
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]), metadata.title);
    assert.equal(decode(html.match(/<meta name="description" content="(.*?)"/s)[1]), metadata.description);
    assert.equal((html.match(/<h1\b/g)||[]).length, 1, route);
    assert.match(html, /<main[^>]*>[\s\S]+?<\/main>/);
    assert.doesNotMatch(html, /DEVELOPMENT ONLY|\[confirm|\bF(?:5|6|10)\b/);
    if (siteOrigin) assert.ok(html.includes(`rel="canonical" href="${canonicalURL(route)}"`));
    else { assert.ok(!html.includes('rel="canonical"')); assert.ok(html.includes('noindex, follow')); }
  }
});

test('public content, tests and timeline exist without running client JavaScript', async () => {
  assert.match(await read('services.html'), /<table[^>]*[\s\S]*You bring[\s\S]*Formula ownership/);
  assert.match(await read('capabilities.html'), /Colloid and emulsion science/);
  assert.match(await read('quality.html'), /<table[\s\S]*Where it is performed/);
  assert.equal(((await read('process.html')).match(/data-stage=/g)||[]).length, 6);
  assert.equal(((await read('faq.html')).match(/<summary>/g)||[]).length, 8);
  assert.match(await read('contact.html'), /What to include in your brief/);
});

test('all prerendered asset references resolve to built files', async () => {
  for (const route of Object.keys(pageSEO)) {
    const html = await read(route === '/' ? 'index.html' : route.slice(1) + '.html');
    for (const asset of new Set(html.match(/\/assets\/[a-zA-Z0-9_./-]+/g)||[])) await access(new URL('../dist' + asset, import.meta.url));
    assert.doesNotMatch(html, /(?:src|href)="\/src\//);
  }
});

test('sitemap and robots only advertise confirmed canonical public URLs', async () => {
  const robots = await read('robots.txt');
  if (siteOrigin) {
    assert.ok(robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`));
    const sitemap = await read('sitemap.xml');
    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
    assert.deepEqual(urls, Object.keys(pageSEO).map(route=>canonicalURL(route)));
    assert.ok(urls.every(url=>!/[?#]|\.html$|\/404$|\/api\//.test(url)));
  } else {
    assert.equal(robots, 'User-agent: *\nDisallow: /\n');
    await assert.rejects(access(new URL('../dist/sitemap.xml', import.meta.url)));
  }
  assert.equal(canonicalURL('/products', 'https://example.com'), 'https://example.com/products');
  assert.equal(canonicalURL('/what-we-make', 'https://example.com'), null);
  assert.equal(canonicalURL('/unknown', 'https://example.com'), null);
});

test('404 is noindex and Vercel serves real static pages without swallowing APIs', async () => {
  const html = await read('404.html');
  assert.ok(html.includes('noindex, follow')); assert.ok(!html.includes('rel="canonical"'));
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(config.cleanUrls, true); assert.equal(config.trailingSlash, false);
  assert.equal(config.rewrites, undefined);
  assert.deepEqual(config.redirects, [{source:'/index.html',destination:'/',permanent:true},{source:'/index',destination:'/',permanent:true}]);
});

test('a supplied final origin advertises exactly the nine canonical pages; unsafe origins fail', () => {
  const files=discoveryFiles('https://example.com');
  const urls=[...files.sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
  assert.deepEqual(urls,Object.keys(pageSEO).map(route=>canonicalURL(route,'https://example.com')));
  assert.match(files.robots,/Sitemap: https:\/\/example.com\/sitemap.xml/);
  assert.ok(urls.every(url=>!/[?#]|\.html$|\/404$|\/api\//.test(url)));
  for(const origin of ['http://example.com','https://example.com/path','https://example.com/','https://user:password@example.com'])assert.throws(()=>discoveryFiles(origin));
  assert.deepEqual(discoveryFiles(null),{robots:'User-agent: *\nDisallow: /\n',sitemap:null});
});
