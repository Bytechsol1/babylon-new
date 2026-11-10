# Supabase contact inquiry storage

The contact form currently stores inquiries in a private Supabase table. It does not send email and does not require Resend, a verified sender, Turnstile, or Upstash.

## 1. Apply the database migration

Choose one method:

- Dashboard: open **Supabase → SQL Editor → New query**, paste `supabase/migrations/20261111000000_create_contact_inquiries.sql`, then select **Run**.
- Supabase CLI (linked project): run `supabase db push` from this repository.

The migration creates `public.contact_inquiries`, enables and forces RLS, revokes table/sequence/RPC access from `anon` and `authenticated`, and gives only the server-side `service_role` access. No public read policy is created. It also creates the private `submit_contact_inquiry` RPC with a three-submissions-per-15-minutes hashed IP/session limit and idempotent retries.

## 2. Configure secrets

Supabase Edge Function secrets:

- `SITE_ORIGIN` — exact website origin, with no trailing slash.
- `RATE_LIMIT_SECRET` — a random value of at least 32 bytes; it must match the server-hosting value.

Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or the hosted secret-key equivalent) to its Edge Functions. Do not put a service-role or secret key in Vercel, Vite variables, frontend source, or Git.

Vercel/server environment variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SITE_ORIGIN`
- `RATE_LIMIT_SECRET` — exactly the same value as the Edge Function secret.

No variable prefixed with `VITE_` is used for inquiry credentials. `RESEND_API_KEY`, `INQUIRY_FROM`, `INQUIRY_TO`, `TURNSTILE_*`, and `UPSTASH_*` are not used by this temporary database-storage flow.

## 3. Rebuild and deploy the Edge Function

From the repository root:

```text
npm run build:inquiry-function
supabase functions deploy inquiry --no-verify-jwt
```

`verify_jwt = false` is intentional because the browser does not call the function directly. The same-origin server proxy signs the exact request body, origin, IP, purpose, and timestamp with HMAC; the Edge Function rejects unsigned, modified, or expired calls.

After changing Vercel environment variables, redeploy the website so the server routes receive them. Do not deploy from this setup step unless deployment has been explicitly approved.

## 4. Verify submissions

1. Open the Contact page and submit a clearly marked test inquiry.
2. Confirm the UI reports success only after the insert succeeds.
3. In Supabase, open **Table Editor → public → contact_inquiries**.
4. Confirm the test row has the submitted fields, `status = new`, and `created_at`.
5. Test invalid fields and the hidden honeypot; neither should create a row.
6. Temporarily rename the RPC or use a local failure fixture to confirm the form shows an error and retains entered details for retry.

Dashboard project members with the appropriate project access can view the table in Table Editor. Browser `anon` and `authenticated` roles cannot read or write it.
