import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
// A self-contained bundle inside the function directory avoids imports outside
// Supabase's deployment root. No env values/config file are read or substituted.
await build({ configFile: false, envFile: false, publicDir: false, logLevel: 'warn', build: {
  ssr: 'server/supabaseInquiry.js', outDir: 'supabase/functions/inquiry/_generated',
  emptyOutDir: true, copyPublicDir: false, minify: false,
  rollupOptions: { output: { entryFileNames: 'handler.mjs' }, external: ['node:buffer','node:crypto','node:net'] },
} });
const directory = 'supabase/functions/inquiry/_generated';
const handler = await readFile(directory + '/handler.mjs', 'utf8');
const entry = await readFile('supabase/functions/inquiry/index.ts', 'utf8');
const bootstrap = entry.replace(/^import \{ createSupabaseInquiryHandler \} from '\.\/_generated\/handler\.mjs';\r?\n/m, '');
if (bootstrap === entry) throw new Error('Inspect the function entry import before creating the dashboard bundle.');
await writeFile(directory + '/dashboard.ts', '// Dashboard-ready inquiry function. No embedded credentials or local imports.\n' + handler + '\n' + bootstrap);
console.log('Supabase CLI and single-file dashboard bundles generated; no deployment or email sent.');
