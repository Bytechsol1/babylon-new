# Contact form setup

The former temporary email-delivery path is retired. Contact inquiries are now stored in a private Supabase database table through the signed Edge Function.

Use [SUPABASE-CONTACT-SETUP.md](SUPABASE-CONTACT-SETUP.md) for the migration, server/Edge variable names, function rebuild and deploy commands, Table Editor location, and verification steps.

Email delivery is not part of the current flow. Resend, sender-domain verification, `INQUIRY_FROM`, `INQUIRY_TO`, Turnstile, and Upstash are not required for saving a contact inquiry.
