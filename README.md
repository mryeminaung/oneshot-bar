# OneShotBar

A table reservation system for a bar/restaurant. Customers browse real-time table availability and reserve in a few taps; staff manage the day's reservations; managers manage tables, staff accounts, and see everything.

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript
- **Backend**: Supabase (Postgres + Auth) — no separate API server; Server Components and Server Actions talk to Supabase directly
- **UI**: Tailwind CSS + shadcn/ui (on [`@base-ui/react`](https://base-ui.com) primitives, not Radix — see [Notes](#notes) below)
- **Validation**: Zod
- **Auth**: Supabase Auth via [`@supabase/ssr`](https://supabase.com/docs/guides/auth/server-side/nextjs), cookie-based sessions

## Roles

| Role | Can do |
|---|---|
| **Customer** | Register/login, search table availability, reserve, view/cancel own reservations |
| **Staff** | Login, view today's reservations, confirm/complete/cancel them |
| **Manager** | Everything staff can, plus manage tables (CRUD), manage staff accounts, view/filter all reservations, dashboard with stats |

There is **no public staff or manager signup** — `/register` always creates a `customer` account. Staff accounts are created by a manager from `/manager/staff` (uses the Supabase admin API to bypass email confirmation). A manager is provisioned by directly updating a row's `role` in the `profiles` table via the Supabase dashboard — there's no in-app flow for it, since it's a one-time bootstrap step.

## Getting started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com), then from *Project Settings → API* and *Project Settings → Database*, copy the values into a `.env.local` (see `.env.local.example`):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   DATABASE_URL=
   ```

   `SUPABASE_SERVICE_ROLE_KEY` is only needed for manager → staff account creation; the rest of the app works without it. Never expose it to the client — it's only ever imported from `lib/supabase/admin.ts`, used by Server Actions.

3. **Run the migrations** in `supabase/migrations/`, in order, via the Supabase SQL editor (or `supabase db push` if you have the CLI linked). They're written to be idempotent, so re-running one that partially applied is safe:
   - `0001_init_auth.sql` — `profiles` table, `user_role` enum, signup trigger
   - `0002_tables_reservations.sql` — `tables` and `reservations` tables, RLS policies
   - `0003_fix_signup_trigger.sql` — re-attaches the signup trigger (see [Notes](#notes))
   - `0004_fix_rls_recursion.sql` — fixes an RLS self-recursion bug (see [Notes](#notes))

4. **Run the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
├── (auth)/
│   ├── layout.tsx        # shared gradient background for auth pages
│   ├── login/
│   └── register/
├── api/auth/              # JSON endpoints (register/login/logout/me) — not used by the UI,
│                           # which calls Server Actions directly, but kept for programmatic access
├── customer/
│   ├── dashboard/
│   └── reservations/      # list + cancel, and reservations/new (availability search)
├── staff/
│   ├── dashboard/
│   └── reservations/      # today's reservations, confirm/complete/cancel
├── manager/
│   ├── dashboard/         # stats + searchable/filterable recent reservations
│   ├── tables/            # CRUD, list/grid toggle, search + status filter
│   ├── reservations/      # all reservations, date/status filter
│   └── staff/             # create/remove staff accounts, list/grid toggle, search + filter
└── page.tsx                # public landing page

lib/
├── supabase/               # client.ts (browser), server.ts (RLS-aware, cookie-bound),
│                           # admin.ts (service-role, bypasses RLS — server-only), middleware.ts
├── auth/                   # types, getAuthContext(), withAuth/requireRole (API guards),
│                           # requirePageRole/redirectIfAuthenticated (page guards)
├── actions/                 # Server Actions: auth, tables, reservations, staff
├── data/                    # read-only Supabase queries used by Server Components
├── validations/              # Zod schemas
└── types/db.ts               # BarTable, ReservationWithDetails, etc.

supabase/
├── migrations/               # numbered, idempotent SQL migrations
└── seed.sql                  # sample tables + reservations for local dev
```

## Notes

A couple of real bugs surfaced and fixed during development, worth knowing if you're extending this:

- **RLS self-recursion**: a policy on `profiles` that checked the caller's role via a subquery on `profiles` itself caused Postgres to report `infinite recursion detected in policy for relation "profiles"` on every read — which silently broke login (it defaulted everyone to the customer dashboard instead of erroring loudly). Fixed by reading the role through a `SECURITY DEFINER` helper function (`public.current_user_role()`), which bypasses RLS for its own internal lookup and so can't recurse. If you add more role-based policies, use that function rather than repeating the subquery.
- **Missing signup trigger**: at one point the `handle_new_user()` function existed but the trigger attaching it to `auth.users` didn't, so new signups got an `auth.users` row but no matching `profiles` row. `0003_fix_signup_trigger.sql` re-attaches it defensively.
- **base-ui, not Radix**: shadcn components here are generated in the `base-nova` style on top of `@base-ui/react`, not the classic Radix-based shadcn/ui. The APIs are similar but not identical — e.g. polymorphic rendering uses `render={<Link .../>}` instead of `asChild`, and a `Button` rendering a non-`<button>` element needs `nativeButton={false}` or it logs a console warning.
- **Next.js 16 renamed `middleware.ts` → `proxy.ts`** (`export function proxy` instead of `export function middleware`). This project already uses the new convention.

## Available scripts

```bash
pnpm dev      # start the dev server
pnpm build    # production build
pnpm start    # run the production build
pnpm lint     # eslint
```
