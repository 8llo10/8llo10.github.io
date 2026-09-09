# Ghala Portfolio — Editorial CMS

A Next.js portfolio with a compact editorial/dashboard visual direction, light + dark mode, animated G loader, and an owner-only CMS.

## What is included

- Editorial + dashboard layout inspired by the references.
- Compact desktop dimensions (1180px frame, shorter hero, smaller typography).
- Light / dark mode toggle, saved in the browser.
- Discord-inspired loading animation with a rotating orbit around the letter **G**.
- Explicit public image slots for:
  - Logo
  - Main hero portrait
  - About/event photo
  - Every project cover
  - Custom section images
- Private `/admin` dashboard protected by your own username/password.
- From `/admin` you can:
  - Add/delete/reorder projects.
  - Upload project images.
  - Add live and GitHub links.
  - Add/delete/reorder page sections.
  - Choose section type, exact position, layout, tone, image placement and columns.
  - Upload section images.
  - Upload the site logo, hero portrait and About photo from a dedicated Brand & Media tab.
  - Edit LinkedIn, GitHub, email, CV and availability.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Admin: `http://localhost:3000/admin`

## Environment variables

Copy `.env.example` to `.env.local`:

```env
ADMIN_USERNAME=your-private-username
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=a-long-random-secret

SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=portfolio-images
```

Never commit `.env.local`.

## Supabase

Run `supabase/setup.sql` once in Supabase SQL Editor. It creates the projects, sections and settings tables plus the public image bucket.

The service-role key is used server-side only.

## Before Vercel

```bash
npm run build
```

Then push the project to GitHub and import it into Vercel. Add the same environment variables in Vercel → Project Settings → Environment Variables.
