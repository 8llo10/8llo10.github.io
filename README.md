# Ghala — Portfolio

Editorial, mobile-first portfolio for Ghala Al-Hashmi Al-Ameer.

## Run
```bash
npm install
npm run dev
```

## Project Hub / private owner CMS
The site works immediately with built-in portfolio cards. To enable the private **OWNER → ADD PROJECT** flow:

1. Create/connect a Supabase project.
2. Run `supabase.sql` in the SQL editor.
3. In Supabase Auth, create the single owner user (your email + password).
4. Add these environment variables locally and in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy. Visitors can read projects; only an authenticated user can insert/update/delete because of RLS.

## Your visuals
No personal/project imagery is hardcoded. The hero portrait and project visuals intentionally have placeholders. Project images can later be supplied through the private project form as URLs.

## Structure
- `app/page.tsx` — page sections + owner CMS
- `app/globals.css` — responsive editorial design
- `lib/supabase.ts` — data client/types
- `supabase.sql` — project table + RLS

English-only by design for a cleaner software-engineering portfolio and international readability.
