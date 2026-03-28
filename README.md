# Streaming Platform

Production-focused video platform scaffold with:

- Frontend: Next.js (App Router)
- Backend: Express + TypeScript + Prisma
- Category model with 50 category seeds
- Admin-only upload API surface
- SEO foundations (metadata, robots, sitemap)
- Category folder automation across backend/frontend

## Quick Start

1. Install dependencies from workspace root:
   - `npm install`
2. Configure env files:
   - `backend/.env`
   - `frontend/.env.local`
3. Start backend:
   - `npm run dev:backend`
4. Start frontend:
   - `npm run dev`

## Vercel Deployment (Monorepo Safe)

Use one of the following setups and keep it consistent:

1. Root deployment (`Root Directory = .`)
   - Build Command: `npm run build --workspace frontend`
   - Output Directory: `frontend/.next`
2. Frontend-only deployment (`Root Directory = frontend`)
   - Build Command: `npm run build`
   - Output Directory: `.next`

If Vercel looks for `frontend/frontend/.next`, your root directory and output directory are mixed between these two modes.

## Category Folder Sync

- Run `npm run sync:categories` from workspace root.
- This ensures each seeded category has:
   - backend storage folder at `backend/storage/categories/{slug}`
   - frontend content folder at `frontend/src/content/categories/{slug}`
   - `comments.json` and `README.md` placeholders

## Notes

- Admin routes are intentionally hidden from the public navbar.
- Category updates are ID-based so category rename propagates globally.
- Category folders can be regenerated at any time with `npm run sync:categories` (creates and updates artifacts, does not delete existing custom files).
