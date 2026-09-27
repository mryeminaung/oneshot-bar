-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create type public.user_role as enum ('manager', 'staff', 'customer');

create table public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	name text not null,
	email text not null unique,
	role public.user_role not null default 'customer',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
	on public.profiles for select
	using (auth.uid() = id);

create policy "Users can update their own profile"
	on public.profiles for update
	using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth.users row is created.
-- Registration passes name/role through signUp's `options.data`, which
-- lands in raw_user_meta_data.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
	insert into public.profiles (id, name, email, role)
	values (
		new.id,
		coalesce(new.raw_user_meta_data ->> 'name', ''),
		new.email,
		coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'customer')
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
