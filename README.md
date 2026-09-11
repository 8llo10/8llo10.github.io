# Ghala — Portfolio

Editorial, mobile-first portfolio for Ghala Al-Hashmi Al-Ameer.

## Run
```bash
npm install
npm run dev
```

## Current portfolio projects
- TNABBAH — Smart Vehicle Diagnostics
- MADAD — Field Operations Orchestration
- SWITCHBOARD — Visual IT Automation Builder
- HireMail AI — Intelligent Career Email Classification & Opportunity Tracking
- PROOF — Decision Evidence Registry

`OUR HUB` also links to the Project Command Center so visitors can see active work and progress.

## Images — exact paths
The UI is already wired to these paths. Just upload/commit images with these exact names:

```text
public/
├─ images/
│  └─ profile.jpg
└─ projects/
   ├─ tnabbah.jpg
   ├─ madad.jpg
   ├─ switchboard.jpg
   ├─ hiremail.jpg
   └─ proof.jpg
```

Recommended:
- `profile.jpg`: portrait / vertical image, around 1200×1500 or larger.
- Project images: screenshot or collage around 1600×1000, 16:10 or similar.
- JPG or WebP is best for size. If you change the extension, update the path in `app/page.tsx`.
- Until an image exists, the site automatically keeps the placeholder instead of showing a broken image.

## Contact links currently shown
- LinkedIn
- GitHub
- Email
- Phone
- Makkah · Jeddah

## Engineering proof section
The portfolio includes a dedicated `ENGINEERING PROOF / BEYOND THE UI` section covering:
- Backend engineering: FastAPI, Express, REST, Auth, OAuth and integrations.
- Data/system design: PostgreSQL, Supabase, Prisma, SQL and RLS.
- Realtime/connected systems: MQTT, BLE OBD-II, realtime flows and webhooks.
- Delivery: Docker, VPS, Vercel, Render and GitHub.

## Project Hub / private owner CMS
The site works immediately with built-in portfolio cards. To enable the private **OWNER → ADD PROJECT** flow:

1. Create/connect a Supabase project.
2. Run `supabase.sql` in the SQL editor.
3. In Supabase Auth, create the single owner user.
4. Add these environment variables locally and in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy.

> Before using this as a production CMS, tighten the RLS policies to your owner UID so another authenticated user cannot write to the project table.

## Vercel
When you handle Vercel manually, import/connect the GitHub repository `8llo10/portfolio`, use branch `main`, and let Vercel detect Next.js. Every push to `main` can then deploy automatically once Git integration is enabled.

## Structure
- `app/page.tsx` — portfolio sections, project data, contact links and owner CMS.
- `app/globals.css` — responsive editorial design.
- `lib/supabase.ts` — Supabase client/types.
- `supabase.sql` — project table + RLS.
- `public/images/` — personal/hero visuals.
- `public/projects/` — project screenshots used by Our Hub.
