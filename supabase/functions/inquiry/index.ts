// Generate the local bundle first: npm run build:inquiry-function.
// Supabase database credentials are provided to hosted Edge Functions by Supabase.
import { createSupabaseInquiryHandler } from './_generated/handler.mjs';

const names = ['SITE_ORIGIN', 'RATE_LIMIT_SECRET', 'SUPABASE_URL', 'SUPABASE_SECRET_KEYS', 'SUPABASE_SERVICE_ROLE_KEY'];
const env = Object.fromEntries(names.map(name => [name, Deno.env.get(name)]));
Deno.serve(createSupabaseInquiryHandler({ env }));
