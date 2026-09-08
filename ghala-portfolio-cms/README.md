# Ghala Portfolio — Editable Owner CMS

A Next.js portfolio inspired by editorial portfolios + modular/bento interface design. Visitors are read-only. The owner can log in at `/admin` to add projects, upload images, edit links, create/reorder/hide sections, and change layouts without editing source code.

## What is included

- Warm cream / white / yellow / orange editorial visual system
- Responsive desktop / tablet / mobile layout
- Framer Motion scroll and hover animation
- Discord-inspired loading screen built around the letter **G**
- Public portfolio with labeled image placeholders
- Project cards with image, live URL, GitHub URL, tags, description
- Owner-only `/admin` dashboard
- Username + password admin login
- HttpOnly owner session cookie
- Add / delete / edit projects from the website
- Upload project/section images from the dashboard
- Add / delete / edit page sections
- Choose section type, layout and position/order
- Show/hide sections
- Edit LinkedIn, GitHub, email, CV URL and profile details
- Supabase database + Storage so changes remain after Vercel deployments
- No `node_modules` in GitHub

## 1. Install locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The public site works in **demo mode without Supabase**, using the default content. Saving in `/admin` requires Supabase.

## 2. Create the database (free Supabase)

1. Create a free project at Supabase.
2. Open **SQL Editor**.
3. Copy all of `supabase/setup.sql` and run it once.
4. Open **Project Settings → API** and copy:
   - Project URL
   - `service_role` key

The service-role key must NEVER be committed to GitHub. It is used only in server-side routes.

## 3. Set your secret admin login

Create `.env.local`:

```env
ADMIN_USERNAME=your-private-username
ADMIN_PASSWORD=your-long-private-password
ADMIN_SESSION_SECRET=a-long-random-secret-at-least-32-characters
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET=portfolio-images
```

Do not use your GitHub password. Create a unique admin password for this site.

## 4. Add your photos and links from the website

Go to:

`http://localhost:3000/admin`

Log in with the username/password from `.env.local`.

### Projects
Click **Add project**. You can set:
- project name
- subtitle
- description
- project cover image upload
- live/demo URL
- GitHub URL
- tags

### Sections
Click **Add section**. You can choose:
- section title
- section type
- layout: Split / Bento / Editorial / Grid / Full Width
- exact position/order
- visible/hidden
- body content
- optional image

Use ↑ and ↓ buttons to preview the intended order, then save each changed section.

### Site settings
Add:
- your real email
- LinkedIn URL
- GitHub URL
- CV URL
- location / availability copy

## 5. Images you should prepare

The site tells you exactly what image belongs in every empty slot.

- **Hero:** your main professional/editorial portrait — 4:5
- **About:** a candid/workspace image — 4:3
- **MADAD:** dashboard / command-center screenshot — 16:10
- **TNABBAH:** mobile diagnostic UI / vehicle-data screen — 16:10
- **WASL:** IT ticket/asset dashboard — 16:10
- **HireMail:** inbox/dashboard screenshot — 16:10

You can upload these directly from `/admin`; you do not have to put them into the code repository.

## 6. CV

Place your CV here:

`public/Ghala_AlHashmi_Alameer_CV.pdf`

Or change the CV URL from the owner dashboard.

## 7. Production test

Before GitHub/Vercel:

```bash
npm run build
```

## 8. GitHub

Push the project folder. Do **not** upload `.env.local` or `node_modules`.

The included `.gitignore` already excludes them.

## 9. Vercel

1. Import the GitHub repository in Vercel.
2. Add the same five environment variables under **Project → Settings → Environment Variables**.
3. Deploy.

Vercel will run `npm install` and `npm run build` itself.

## Security notes

- Visitors have no editing UI.
- All write/upload API routes verify the HttpOnly admin session.
- Supabase `service_role` stays server-side only.
- The username/password are environment variables and are not in frontend JavaScript.
- Use a unique, strong password and a long random `ADMIN_SESSION_SECRET`.

## Main files

- `app/page.tsx` — public portfolio
- `components/PortfolioClient.tsx` — visual sections + animation
- `app/admin/page.tsx` — owner dashboard gate
- `components/AdminDashboard.tsx` — no-code editing UI
- `app/api/admin/*` — protected mutations/uploads
- `supabase/setup.sql` — database/storage setup
- `app/globals.css` — full visual system

