-- ─────────────────────────────────────────────────────────────────────────────
-- OneShotBar — full reset
-- Drops everything created by schema.sql so you can re-run it from scratch.
-- Run in the Supabase SQL editor BEFORE re-applying schema.sql.
-- ─────────────────────────────────────────────────────────────────────────────

-- triggers
drop trigger if exists on_auth_user_created    on auth.users;
drop trigger if exists set_profiles_updated_at on public.profiles;

-- functions
drop function if exists public.handle_new_user();
drop function if exists public.set_updated_at();
drop function if exists public.current_user_role() cascade;

-- tables (reservations first — it references profiles and tables)
drop table if exists public.reservations cascade;
drop table if exists public.tables       cascade;
drop table if exists public.profiles     cascade;

-- enums
drop type if exists public.reservation_status;
drop type if exists public.table_status;
drop type if exists public.user_role;
