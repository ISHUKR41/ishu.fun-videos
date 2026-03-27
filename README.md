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

## Category Folder Sync

- Run `npm run sync:categories` from workspace root.
- This ensures each seeded category has:
   - backend storage folder at `backend/storage/categories/{slug}`
   - frontend content folder at `frontend/src/content/categories/{slug}`
   - `comments.json` and `README.md` placeholders

## Notes

- Admin routes are intentionally hidden from the public navbar.
- Category updates are ID-based so category rename propagates globally.
