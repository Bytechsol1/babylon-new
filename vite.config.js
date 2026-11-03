import { defineConfig, loadEnv } from 'vite';
import configHandler from './api/config.js';
import inquiryHandler from './api/inquiry.js';
import faqHandler from './api/faq.js';
import { requiredEnv } from './server/security.js';

export default defineConfig(({ mode }) => {
  const local = loadEnv(mode, process.cwd(), '');
  for (const key of [...requiredEnv, 'OPENAI_API_KEY']) if (!process.env[key] && local[key]) process.env[key] = local[key];
  return {
    esbuild: { jsx: 'automatic' },
    plugins: [{
      name: 'babylon-local-api',
      configureServer(server) {
        const routes = { '/api/config': configHandler, '/api/inquiry': inquiryHandler, '/api/faq': faqHandler };
        server.middlewares.use((req, res, next) => {
          const handler = routes[req.url?.split('?')[0]];
          if (handler) Promise.resolve(handler(req, res)).catch(() => { res.statusCode = 500; res.end('Server error'); });
          else next();
        });
      },
    }],
  };
});
