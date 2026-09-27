-- 0002 added policies that check the caller's role via a subquery on
-- public.profiles, referenced from a policy ON public.profiles itself
-- ("Staff and managers view all profiles"). Postgres re-applies RLS to any
-- reference to the same table, including inside its own policy's subquery,
-- so that policy caused "infinite recursion detected in policy for relation
-- profiles" on every profiles read — which silently broke role lookups
-- everywhere (login redirected everyone to the customer dashboard, table
-- reads threw outright). Standard fix: read the role through a
-- SECURITY DEFINER function, which bypasses RLS for its own internal query
-- and so cannot recurse. Idempotent.

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
	select role from public.profiles where id = auth.uid()
$$;

drop policy if exists "Staff and managers view all profiles" on public.profiles;
create policy "Staff and managers view all profiles"
	on public.profiles for select
	using (public.current_user_role() in ('staff', 'manager'));

drop policy if exists "Managers manage tables" on public.tables;
create policy "Managers manage tables"
	on public.tables for all
	using (public.current_user_role() = 'manager')
	with check (public.current_user_role() = 'manager');

drop policy if exists "Customers view own reservations, staff/manager view all" on public.reservations;
create policy "Customers view own reservations, staff/manager view all"
	on public.reservations for select
	using (user_id = auth.uid() or public.current_user_role() in ('staff', 'manager'));

drop policy if exists "Owner or staff/manager can update reservations" on public.reservations;
create policy "Owner or staff/manager can update reservations"
	on public.reservations for update
	using (user_id = auth.uid() or public.current_user_role() in ('staff', 'manager'));
