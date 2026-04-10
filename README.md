# BigSave Asset Management (Next.js + Supabase)

Simple internal web app for tracking retail marketing assets (gazebos, umbrellas, banners, display stands, etc.).

## 1) Beginner-friendly recommended stack

- **Frontend + Backend:** Next.js App Router (single project, simple deployment)
- **Database + Auth:** Supabase (Postgres + authentication + RLS security)
- **Styling:** Plain CSS for clean non-technical UI
- **QR code generation:** `qrcode` npm package
- **Hosting (later):** Vercel + Supabase project

Why this stack: one codebase, minimal setup, lots of tutorials, and built-in auth/database.

## 2) Project structure

```txt
app/
  (auth)/login/page.tsx
  dashboard/page.tsx
  assets/page.tsx
  assets/new/page.tsx
  assets/[id]/page.tsx
  dispatch/page.tsx
  receive/page.tsx
  transfer/page.tsx
  return-ho/page.tsx
  history/page.tsx
  api/qr/[id]/route.ts
components/
  AssetForm.tsx
  PageTitle.tsx
lib/
  constants.ts
  supabaseClient.ts
  supabaseServer.ts
  types.ts
supabase/
  schema.sql
```

## 3) Features included in this first version

- Login page (Supabase email/password)
- Dashboard cards for statuses: available, in transit, at store, overdue, damaged, missing
- Assets list page
- Asset detail page with QR code + movement log
- Create asset page (defaults to Head Office)
- Dispatch page
- Receive page
- Transfer page
- Return to Head Office page
- Full movement history page

## 4) Supabase setup

1. Create Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. Create users in **Authentication > Users**.
4. Insert matching rows in `profiles` for each user (role + location).
5. Copy project URL + anon key to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 5) Local run

```bash
npm install
npm run dev
```

Open: `http://localhost:3000/login`

## 6) What to do next (exactly)

1. **Tighten role enforcement in UI:** hide pages/actions based on user role.
2. **Auto-fill user IDs:** replace manual `dispatched_by`/`received_by` text fields with logged-in user id.
3. **Location-aware forms:** replace location id text fields with dropdowns and infer source location automatically.
4. **Overdue logic:** add scheduled job that marks `in_transit` older than your SLA as `overdue`.
5. **Missing workflow:** add action to mark lost assets and trigger manager review.
6. **QR scanning flow:** connect mobile scanner to open `/assets/[id]` inside your internal network.
7. **Audit reports export:** CSV export by date range and store.
8. **Automated tests:** add Playwright + basic integration tests.
9. **Deploy:** Vercel for app, Supabase for DB/auth, then configure production env vars.
