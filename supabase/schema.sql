-- ─────────────────────────────────────────────────────────────────────────────
-- OneShotBar — full schema
-- Run once in the Supabase SQL editor (or `supabase db reset`).
-- Replaces the individual migration files in supabase/migrations/.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Extensions ───────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- ── Enums ────────────────────────────────────────────────────────────────────

create type public.user_role as enum ('manager', 'staff', 'customer');
create type public.table_status as enum ('available', 'unavailable');
create type public.reservation_status as enum ('pending', 'confirmed', 'completed', 'cancelled');


-- ── Tables ───────────────────────────────────────────────────────────────────

create table public.profiles (
	id        uuid primary key references auth.users (id) on delete cascade,
	full_name text not null,
	email     text not null unique,
	role      public.user_role not null default 'customer',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table public.tables (
	id           uuid primary key default gen_random_uuid(),
	table_number integer not null unique check (table_number > 0),
	capacity     integer not null check (capacity > 0),
	status       public.table_status not null default 'available',
	created_at   timestamptz not null default now()
);

create table public.reservations (
	id               uuid primary key default gen_random_uuid(),
	user_id          uuid not null references public.profiles (id) on delete cascade,
	table_id         uuid not null references public.tables (id) on delete restrict,
	reservation_date date not null,
	reservation_time time not null,
	guest_count      integer not null check (guest_count > 0),
	status           public.reservation_status not null default 'pending',
	created_at       timestamptz not null default now()
);

create index reservations_table_slot_idx on public.reservations (table_id, reservation_date, reservation_time);
create index reservations_user_idx       on public.reservations (user_id);

-- Prevents two concurrent requests from booking the same table/date/time slot.
create unique index reservations_no_double_booking
	on public.reservations (table_id, reservation_date, reservation_time)
	where status in ('pending', 'confirmed');


-- ── Row-level security ───────────────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.tables       enable row level security;
alter table public.reservations enable row level security;

-- Helper: reads the caller's role through a SECURITY DEFINER function so that
-- RLS policies on other tables never trigger a recursive profiles scan.
create function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
	select role from public.profiles where id = auth.uid()
$$;

-- profiles
create policy "Users can view their own profile"
	on public.profiles for select
	using (auth.uid() = id);

create policy "Users can update their own profile"
	on public.profiles for update
	using (auth.uid() = id);

create policy "Staff and managers view all profiles"
	on public.profiles for select
	using (public.current_user_role() in ('staff', 'manager'));

-- tables
create policy "Authenticated users can view tables"
	on public.tables for select
	using (auth.uid() is not null);

create policy "Managers manage tables"
	on public.tables for all
	using (public.current_user_role() = 'manager')
	with check (public.current_user_role() = 'manager');

-- reservations
create policy "Customers view own reservations, staff/manager view all"
	on public.reservations for select
	using (user_id = auth.uid() or public.current_user_role() in ('staff', 'manager'));

create policy "Customers create their own reservations"
	on public.reservations for insert
	with check (user_id = auth.uid());

create policy "Owner or staff/manager can update reservations"
	on public.reservations for update
	using (user_id = auth.uid() or public.current_user_role() in ('staff', 'manager'));


-- ── Functions & triggers ─────────────────────────────────────────────────────

-- Auto-creates a profile row whenever a new auth.users row is inserted.
-- Registration passes full_name/role via signUp's options.data → raw_user_meta_data.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
	insert into public.profiles (id, full_name, email, role)
	values (
		new.id,
		coalesce(new.raw_user_meta_data ->> 'full_name', ''),
		new.email,
		case
			when new.raw_user_meta_data ->> 'role' in ('manager', 'staff', 'customer')
			then (new.raw_user_meta_data ->> 'role')::public.user_role
			else 'customer'::public.user_role
		end
	);
	return new;
end;
$$;

create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_user();

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create trigger set_profiles_updated_at
	before update on public.profiles
	for each row execute function public.set_updated_at();
