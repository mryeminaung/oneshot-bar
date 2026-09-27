-- Test data for local/dev use. Run in the Supabase SQL editor after
-- 0001_init_auth.sql and 0002_tables_reservations.sql have both run.

-- 6 tables, matching the spec's example numbers/capacities.
insert into public.tables (table_number, capacity, status) values
	(1, 2, 'available'),
	(2, 4, 'available'),
	(3, 6, 'unavailable'),
	(4, 4, 'available'),
	(5, 8, 'available'),
	(6, 2, 'available')
on conflict (table_number) do nothing;

-- Sample reservations for the test customer registered during manual testing
-- (oneshotbar.test.customer1@gmail.com). Skips quietly if that account
-- doesn't exist yet — register it first, or edit the email below.
do $$
declare
	v_user_id uuid;
begin
	select id into v_user_id from public.profiles where email = 'oneshotbar.test.customer1@gmail.com';

	if v_user_id is not null then
		insert into public.reservations (user_id, table_id, reservation_date, reservation_time, guest_count, status)
		select v_user_id, t.id, current_date, '19:00', 2, 'confirmed'
		from public.tables t where t.table_number = 1
		on conflict do nothing;

		insert into public.reservations (user_id, table_id, reservation_date, reservation_time, guest_count, status)
		select v_user_id, t.id, current_date, '19:30', 4, 'pending'
		from public.tables t where t.table_number = 2
		on conflict do nothing;

		insert into public.reservations (user_id, table_id, reservation_date, reservation_time, guest_count, status)
		select v_user_id, t.id, current_date - 1, '20:00', 2, 'completed'
		from public.tables t where t.table_number = 6
		on conflict do nothing;
	end if;
end $$;
