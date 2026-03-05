-- Create users table
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  avatar_url text,
  public_slug text unique,
  api_key uuid default gen_random_uuid() not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- React to auth.users signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url, public_slug)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 4)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create pivots table
create table if not exists public.pivots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  initial_goal text not null,
  the_wall text not null,
  evidence_url text,
  the_pivot text,
  status text not null check (status in ('In Progress', 'Researching', 'Resolved')),
  domain text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone,
  is_featured boolean default false
);

-- Create endorsements table
create table if not exists public.endorsements (
  id uuid default gen_random_uuid() primary key,
  endorsee_id uuid references public.users not null,
  endorser_id uuid references public.users not null,
  trait text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (endorsee_id, endorser_id, trait)
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.pivots enable row level security;
alter table public.endorsements enable row level security;

-- Users policies
create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can update their own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Pivots policies
create policy "Pivots are viewable by everyone."
  on public.pivots for select
  using ( true );

create policy "Users can insert their own pivots."
  on public.pivots for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own pivots."
  on public.pivots for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own pivots."
  on public.pivots for delete
  using ( auth.uid() = user_id );

-- Endorsements policies
create policy "Endorsements are viewable by everyone."
  on public.endorsements for select
  using ( true );

create policy "Users can endorse others."
  on public.endorsements for insert
  with check ( auth.uid() = endorser_id );

create policy "Users can delete their endorsements."
  on public.endorsements for delete
  using ( auth.uid() = endorser_id );

-- Create Storage bucket for Evidence
insert into storage.buckets (id, name, public) 
values ('evidence', 'evidence', true)
on conflict (id) do nothing;

create policy "Evidence is publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'evidence' );

create policy "Users can upload evidence"
  on storage.objects for insert
  with check ( bucket_id = 'evidence' and auth.uid() = owner );

create policy "Users can update their own evidence"
  on storage.objects for update
  using ( auth.uid() = owner );

create policy "Users can delete their own evidence"
  on storage.objects for delete
  using ( auth.uid() = owner );
