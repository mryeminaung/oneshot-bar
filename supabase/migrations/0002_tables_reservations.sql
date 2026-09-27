-- Run after 0001_init_auth.sql, in the Supabase SQL editor (or `supabase db push`).
-- Idempotent throughout: safe to re-run from scratch even if a previous
-- attempt partially applied (e.g. failed partway through).

-- Idempotent rename: 0001 originally called this column "name"; the app now
-- expects "full_name".
do $$
begin
	if exists (
		select 1 from information_schema.columns
		where table_schema = 'public' and table_name = 'profiles' and column_name = 'name'
	) then
		alter table public.profiles rename column name to full_name;
	end if;
end $$;

create or replace function public.handle_new_user()
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
		coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'customer')
	);
	return new;
end;
$$;

do $$
begin
	if not exists (select 1 from pg_type where typname = 'table_status') then
		create type public.table_status as enum ('available', 'unavailable');
	end if;
	if not exists (select 1 from pg_type where typname = 'reservation_status') then
		create type public.reservation_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
	end if;
end $$;

create table if not exists public.tables (
	id uuid primary key default gen_random_uuid(),
	table_number integer not null unique check (table_number > 0),
	capacity integer not null check (capacity > 0),
	status public.table_status not null default 'available',
	created_at timestamptz not null default now()
);

create table if not exists public.reservations (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.profiles (id) on delete cascade,
	table_id uuid not null references public.tables (id) on delete restrict,
	reservation_date date not null,
	reservation_time time not null,
	guest_count integer not null check (guest_count > 0),
	status public.reservation_status not null default 'pending',
	created_at timestamptz not null default now()
);

create index if not exists reservations_table_slot_idx on public.reservations (table_id, reservation_date, reservation_time);
create index if not exists reservations_user_idx on public.reservations (user_id);

-- Prevents two concurrent requests from both booking the same table/date/time.
create unique index if not exists reservations_no_double_booking
	on public.reservations (table_id, reservation_date, reservation_time)
	where status in ('pending', 'confirmed');

alter table public.tables enable row level security;
alter table public.reservations enable row level security;

-- tables: any authenticated user can read (customers need this to browse
-- availability); only managers can write.
drop policy if exists "Authenticated users can view tables" on public.tables;
create policy "Authenticated users can view tables"
	on public.tables for select
	using (auth.uid() is not null);

drop policy if exists "Managers manage tables" on public.tables;
create policy "Managers manage tables"
	on public.tables for all
	using ((select role from public.profiles where id = auth.uid()) = 'manager')
	with check ((select role from public.profiles where id = auth.uid()) = 'manager');

-- reservations: customers see/insert their own; staff and managers see/update all;
-- a customer can update (cancel) their own row.
drop policy if exists "Customers view own reservations, staff/manager view all" on public.reservations;
create policy "Customers view own reservations, staff/manager view all"
	on public.reservations for select
	using (
		user_id = auth.uid()
		or (select role from public.profiles where id = auth.uid()) in ('staff', 'manager')
	);

drop policy if exists "Customers create their own reservations" on public.reservations;
create policy "Customers create their own reservations"
	on public.reservations for insert
	with check (user_id = auth.uid());

drop policy if exists "Owner or staff/manager can update reservations" on public.reservations;
create policy "Owner or staff/manager can update reservations"
	on public.reservations for update
	using (
		user_id = auth.uid()
		or (select role from public.profiles where id = auth.uid()) in ('staff', 'manager')
	);

-- profiles: staff/manager need to see other users' names (on reservations,
-- staff lists). The inner subquery only ever reads the caller's own row
-- (id = auth.uid()), which the existing self-select policy from 0001 already
-- permits, so this does not recurse.
drop policy if exists "Staff and managers view all profiles" on public.profiles;
create policy "Staff and managers view all profiles"
	on public.profiles for select
	using ((select role from public.profiles where id = auth.uid()) in ('staff', 'manager'));
