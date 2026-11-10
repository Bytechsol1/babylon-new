import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { pageSEO, notFoundSEO, canonicalURL, siteOrigin, discoveryFiles } from '../src/seo.js';

const template = await readFile('dist/index.html', 'utf8');
const discovery = discoveryFiles();
await build({
  configFile: false, publicDir: false, logLevel: 'warn', esbuild: { jsx: 'automatic' },
  build: { ssr: 'scripts/render-site.jsx', outDir: '.sites/seo-render', emptyOutDir: true, copyPublicDir: false, rollupOptions: { output: { entryFileNames: 'render-site.mjs' } } },
});
const { renderPage } = await import(pathToFileURL(path.resolve('.sites/seo-render/render-site.mjs')).href);
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const route of [...Object.keys(pageSEO), '/404']) {
  const metadata = pageSEO[route] || notFoundSEO;
  const canonical = canonicalURL(route);
  const html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(metadata.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(metadata.description)}">`)
    .replace('</head>', `<meta name="robots" content="${canonical ? 'index, follow' : 'noindex, follow'}">\n${canonical ? `<link rel="canonical" href="${canonical}">\n` : ''}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderPage(route)}</div>`);
  await writeFile(route === '/' ? 'dist/index.html' : `dist${route}.html`, html);
}
if (discovery.sitemap) await writeFile('dist/sitemap.xml', discovery.sitemap);
await writeFile('dist/robots.txt', discovery.robots);
console.log('Prerendered nine public pages and a noindex 404. ' + (siteOrigin ? 'Canonical URLs, sitemap and robots generated.' : 'Final custom domain pending: preview is noindex; sitemap and canonicals withheld.'));
