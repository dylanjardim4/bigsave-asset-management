-- Core enums
create type user_role as enum ('admin', 'store_user');
create type location_type as enum ('head_office', 'store');
create type asset_status as enum ('available', 'in_transit', 'at_store', 'overdue', 'damaged', 'missing');
create type movement_type as enum ('dispatch', 'receive', 'transfer', 'return_to_ho');

-- Stores and head office
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  location_type location_type not null,
  created_at timestamptz not null default now()
);

-- Profile row mirrors auth.users and tracks role + home store.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'store_user',
  location_id uuid references public.locations(id),
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  asset_code text unique not null,
  name text not null,
  category text not null,
  status asset_status not null default 'available',
  current_location_id uuid not null references public.locations(id),
  condition text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.movements (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id),
  movement_type movement_type not null,
  from_location_id uuid references public.locations(id),
  to_location_id uuid references public.locations(id),
  dispatched_by uuid not null references public.profiles(id),
  received_by uuid references public.profiles(id),
  dispatch_date date not null,
  receive_date date,
  condition_on_receive text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_assets_status on public.assets(status);
create index if not exists idx_assets_location on public.assets(current_location_id);
create index if not exists idx_movements_asset on public.movements(asset_id);
create index if not exists idx_movements_dates on public.movements(dispatch_date, receive_date);

-- Seed head office location.
insert into public.locations (code, name, location_type)
values ('HO', 'BigSave Head Office', 'head_office')
on conflict (code) do nothing;

-- Basic RLS templates: admin can do everything; store users can view all and update their own receipts.
alter table public.locations enable row level security;
alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.movements enable row level security;

create policy "read locations" on public.locations for select to authenticated using (true);
create policy "read profiles" on public.profiles for select to authenticated using (true);
create policy "read assets" on public.assets for select to authenticated using (true);
create policy "read movements" on public.movements for select to authenticated using (true);

create policy "admin full assets" on public.assets
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin full movements" on public.movements
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "store can confirm receipt" on public.movements
for update to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'store_user'
      and p.location_id = to_location_id
  )
)
with check (received_by = auth.uid());
