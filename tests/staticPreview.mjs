import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Local fixture server for built HTML. It never calls an email, CRM or chat provider.
export async function staticPreview() {
  const root = path.resolve('dist');
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) {
        if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(url.pathname === '/api/config' ? { mode: 'preview' } : { status: 'prototype', questions: [] }));
      }
      if (['/index.html','/index'].includes(url.pathname) || url.pathname.endsWith('.html') || url.pathname !== '/' && url.pathname.endsWith('/')) {
        res.writeHead(308, { Location: (['/index.html','/index'].includes(url.pathname) ? '/' : url.pathname.replace(/\.html$|\/$/, '')) + url.search }); return res.end();
      }
      let relative = decodeURIComponent(url.pathname);
      if (relative === '/') relative = '/index.html'; else if (!path.extname(relative)) relative += '.html';
      const file = path.resolve(root, '.' + relative);
      if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
      let data;
      try { data = await readFile(file); }
      catch { res.writeHead(404, { 'Content-Type': 'text/html' }); return res.end(await readFile(path.join(root, '404.html'))); }
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(data);
    } catch { res.writeHead(500); res.end('Local fixture error'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { base: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}
