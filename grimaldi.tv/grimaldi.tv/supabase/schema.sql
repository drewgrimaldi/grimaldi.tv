-- ============================================================================
-- grimaldi.tv — Supabase schema
-- Run this once in Supabase Studio -> SQL Editor (or `supabase db push`).
-- Translated 1:1 from the original base44/entities/*.jsonc definitions.
-- ============================================================================

-- ---- profiles (replaces Base44's User entity "role" field) ----------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are self-readable" on profiles
  for select using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role) values (new.id, 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- After running this once, make yourself admin:
--   update profiles set role = 'admin' where id = '<your-auth-user-uuid>';

-- Helper used by RLS policies below.
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ---- episodes ---------------------------------------------------------------
create table if not exists episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  episode_number int,
  description text,
  guest text,
  duration text,
  publish_date date,
  audio_url text,
  cover_image_url text,
  cloudflare_url text,
  spotify_url text,
  apple_url text,
  youtube_url text,
  rumble_url text,
  tags text[],
  featured boolean not null default false,
  created_date timestamptz not null default now()
);
alter table episodes enable row level security;
create policy "episodes public read" on episodes for select using (true);
create policy "episodes admin write" on episodes for insert with check (is_admin());
create policy "episodes admin update" on episodes for update using (is_admin());
create policy "episodes admin delete" on episodes for delete using (is_admin());

-- ---- blog_posts ---------------------------------------------------------------
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  excerpt text,
  cover_image_url text,
  author text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  publish_date date,
  tags text[],
  created_date timestamptz not null default now()
);
alter table blog_posts enable row level security;
create policy "blog_posts public read" on blog_posts for select using (true);
create policy "blog_posts admin write" on blog_posts for insert with check (is_admin());
create policy "blog_posts admin update" on blog_posts for update using (is_admin());
create policy "blog_posts admin delete" on blog_posts for delete using (is_admin());

-- ---- subscribers (free email-gate signups) ----------------------------------
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  created_date timestamptz not null default now()
);
alter table subscribers enable row level security;
-- Anyone can sign up; nobody can read the list from the browser (avoids
-- leaking the email list). Admin exports should go through the Supabase
-- dashboard or a service-role script, not the public site.
create policy "subscribers public insert" on subscribers for insert with check (true);
create policy "subscribers admin read" on subscribers for select using (is_admin());
create policy "subscribers admin delete" on subscribers for delete using (is_admin());

-- ---- premium_subscribers -----------------------------------------------------
create table if not exists premium_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  paypal_transaction_id text,
  status text not null default 'pending' check (status in ('pending', 'active', 'cancelled', 'expired')),
  subscription_start date,
  subscription_expiry date,
  subscription_type text not null default 'monthly' check (subscription_type in ('monthly', 'annual', 'lifetime')),
  created_by uuid references auth.users(id),
  created_date timestamptz not null default now()
);
alter table premium_subscribers enable row level security;
create policy "premium_subscribers self insert" on premium_subscribers for insert with check (created_by = auth.uid());
create policy "premium_subscribers self or admin read" on premium_subscribers for select using (created_by = auth.uid() or is_admin());
create policy "premium_subscribers self or admin update" on premium_subscribers for update using (created_by = auth.uid() or is_admin());
create policy "premium_subscribers admin delete" on premium_subscribers for delete using (is_admin());

-- ---- products (store) ----------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image_url text not null,
  sticker_mule_url text not null,
  created_date timestamptz not null default now()
);
alter table products enable row level security;
create policy "products public read" on products for select using (true);
create policy "products admin write" on products for insert with check (is_admin());
create policy "products admin update" on products for update using (is_admin());
create policy "products admin delete" on products for delete using (is_admin());

-- ---- memes (legacy/unused in current pages, kept for parity) ------------------
create table if not exists memes (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  caption text,
  publish_date date,
  created_date timestamptz not null default now()
);
alter table memes enable row level security;
create policy "memes public read" on memes for select using (true);
create policy "memes admin write" on memes for insert with check (is_admin());
create policy "memes admin update" on memes for update using (is_admin());
create policy "memes admin delete" on memes for delete using (is_admin());

-- ---- premium_episodes (admin-only, not yet exposed in any page) ---------------
create table if not exists premium_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cloudflare_url text default 'https://customer-1zymjaqzvs0wcwjf.cloudflarestream.com/96966af2539cd4cae059bb1455776d52/manifest/video.m3u8',
  episode_type text not null default 'exclusive' check (episode_type in ('exclusive', 'early_access', 'behind_the_scenes')),
  publish_date date,
  duration text,
  created_date timestamptz not null default now()
);
alter table premium_episodes enable row level security;
create policy "premium_episodes admin all" on premium_episodes for all using (is_admin()) with check (is_admin());

-- ---- press_releases -------------------------------------------------------------
create table if not exists press_releases (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  sub_headline text,
  full_text text,
  publish_date date,
  media_kit_url text,
  created_date timestamptz not null default now()
);
alter table press_releases enable row level security;
create policy "press_releases public read" on press_releases for select using (true);
create policy "press_releases admin write" on press_releases for insert with check (is_admin());
create policy "press_releases admin update" on press_releases for update using (is_admin());
create policy "press_releases admin delete" on press_releases for delete using (is_admin());

-- ---- funny_photos ----------------------------------------------------------------
create table if not exists funny_photos (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  caption text,
  publish_date date,
  created_date timestamptz not null default now()
);
alter table funny_photos enable row level security;
create policy "funny_photos public read" on funny_photos for select using (true);
create policy "funny_photos admin write" on funny_photos for insert with check (is_admin());
create policy "funny_photos admin update" on funny_photos for update using (is_admin());
create policy "funny_photos admin delete" on funny_photos for delete using (is_admin());

-- ---- upcoming_guests ---------------------------------------------------------------
create table if not exists upcoming_guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  headshot_url text,
  air_date date,
  created_date timestamptz not null default now()
);
alter table upcoming_guests enable row level security;
create policy "upcoming_guests public read" on upcoming_guests for select using (true);
create policy "upcoming_guests admin write" on upcoming_guests for insert with check (is_admin());
create policy "upcoming_guests admin update" on upcoming_guests for update using (is_admin());
create policy "upcoming_guests admin delete" on upcoming_guests for delete using (is_admin());

-- ---- poll_responses (feedback / poll widget / guest questions inbox) -----------
create table if not exists poll_responses (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  email text,
  created_date timestamptz not null default now()
);
alter table poll_responses enable row level security;
-- Write-only inbox: anyone can submit, only admin can read it back.
create policy "poll_responses public insert" on poll_responses for insert with check (true);
create policy "poll_responses admin read" on poll_responses for select using (is_admin());
create policy "poll_responses admin delete" on poll_responses for delete using (is_admin());

-- ---- photo_comments ----------------------------------------------------------------
create table if not exists photo_comments (
  id uuid primary key default gen_random_uuid(),
  photo_id text not null,
  name text,
  comment text not null,
  created_date timestamptz not null default now()
);
alter table photo_comments enable row level security;
create policy "photo_comments public read" on photo_comments for select using (true);
create policy "photo_comments public insert" on photo_comments for insert with check (true);
create policy "photo_comments admin delete" on photo_comments for delete using (is_admin());

-- ============================================================================
-- Storage bucket used by base44.integrations.Core.UploadFile() in the shim
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('public-uploads', 'public-uploads', true)
on conflict (id) do nothing;

create policy "public-uploads readable by anyone"
  on storage.objects for select using (bucket_id = 'public-uploads');

create policy "public-uploads writable by anyone"
  on storage.objects for insert with check (bucket_id = 'public-uploads');
-- NOTE: this mirrors Base44's default (anyone could upload via the app's
-- public API key). If you want to restrict uploads to admins only, drop the
-- policy above and replace its `with check (bucket_id = 'public-uploads')`
-- with `with check (bucket_id = 'public-uploads' and is_admin())`.
