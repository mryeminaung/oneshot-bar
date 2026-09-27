-- The trigger that auto-creates a profiles row on signup was missing (only
-- the function existed, not the trigger attaching it to auth.users) —
-- confirmed live: an existing auth.users row had no matching profiles row.
-- Idempotent: safe to re-run.

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_user();
