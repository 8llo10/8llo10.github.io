# Ghala — Editorial Portfolio CMS

A Next.js + TypeScript portfolio rebuilt around an editorial/dashboard art direction: oversized typography, modular grid, project panels, motion, responsive layouts, light/dark themes, and a private owner CMS.

## Frontend
- Editorial hero with a dedicated transparent portrait slot
- Bento/dashboard-inspired project composition
- Light + dark mode toggle (persisted in localStorage)
- Framer Motion reveals and hover interactions
- Discord-inspired loading screen built around the letter **G**
- Responsive desktop/tablet/mobile layouts
- Image placeholders explicitly tell you what photo/screenshot belongs there

## Private owner mode
Visit `/admin`. Visitors do not see an admin link in the public portfolio.

The owner dashboard supports:
- Add/edit/delete projects
- Upload project images
- Project live + GitHub URLs
- Tags, title, subtitle and description
- Add/delete/show/hide sections
- Choose section type and layout
- Reorder sections
- Upload section images
- Edit identity/contact links

Persistent editing uses Supabase. Run `supabase/setup.sql`, then configure the variables below.

## Setup
```bash
npm install
npm run dev
```
Open `http://localhost:3000` and `http://localhost:3000/admin`.

Create `.env.local` from `.env.example`:
```env
ADMIN_USERNAME=your_private_username
ADMIN_PASSWORD=use_a_strong_password
ADMIN_SESSION_SECRET=use_a_long_random_secret
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=portfolio-images
```
Never commit `.env.local` or the Supabase service-role key.

## Images to add later
You can upload them from `/admin` rather than editing code:
1. **Hero:** transparent PNG cutout portrait, ideally 4:5.
2. **Projects:** dashboard/app screenshots, ideally 16:10.
3. **About:** professional event/work photo, ideally 4:3.
4. **Custom sections:** optional 16:10 visual.

## Deploy
Push the project to GitHub and import it into Vercel. Add the same environment variables in Vercel Project Settings → Environment Variables, then deploy.

## Note about verification
The source was prepared as a complete project. Package installation in the generation environment timed out before dependencies were available, so run `npm install` and `npm run build` locally before your first push. If the build reports an error, use the exact error output to fix it before deployment.
