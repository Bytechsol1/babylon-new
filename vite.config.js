import { defineConfig, loadEnv } from 'vite';
import { createConfigHandler } from './api/config.js';
import { createInquiryHandler } from './api/inquiry.js';
import { createFAQHandler } from './api/faq.js';
import { requiredEnv } from './server/security.js';

export default defineConfig(({ mode }) => {
  const local = loadEnv(mode, process.cwd(), '');
  // Pass a fresh server-only snapshot instead of mutating process.env. This lets
  // removed/replaced local secrets take effect when Vite reloads its config.
  const serverEnv = Object.fromEntries([...requiredEnv, 'OPENAI_API_KEY', 'VERCEL', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'].map(key => [key, process.env[key] ?? local[key]]));
  return {
    esbuild: { jsx: 'automatic' },
    plugins: [{
      name: 'babylon-local-api',
      configureServer(server) {
        const routes = { '/api/config': createConfigHandler({ env: serverEnv }), '/api/inquiry': createInquiryHandler({ env: serverEnv }), '/api/faq': createFAQHandler({ env: serverEnv }) };
        server.middlewares.use((req, res, next) => {
          const handler = routes[req.url?.split('?')[0]];
          if (handler) Promise.resolve(handler(req, res)).catch(() => { res.statusCode = 500; res.end('Server error'); });
          else next();
        });
      },
    }],
  };
});
