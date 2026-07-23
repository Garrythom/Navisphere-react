-- Navisphere Logistics — core schema
-- Ports tracking/models.py (Order, OrderItem, TrackingUpdate, ContactMessage) from the old Django app.

create extension if not exists pgcrypto;

create type order_status as enum (
  'order_received',
  'order_picked_up',
  'processing',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'delayed'
);

create type item_unit as enum (
  'pcs',
  'boxes',
  'cartons',
  'pallets',
  'crates'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  origin text not null,
  destination_street text not null,
  destination_country text not null,
  destination_city text not null,
  destination_state text not null default '',
  destination_zip_code text not null default '',
  notes text not null default '',
  current_status order_status not null default 'order_received',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null default auth.uid()
);

create index orders_current_status_idx on orders (current_status);
create index orders_created_at_idx on orders (created_at desc);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product text not null,
  unit item_unit not null default 'pcs'
);

create index order_items_order_id_idx on order_items (order_id);

create table tracking_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status not null,
  location text not null,
  note text not null default '',
  timestamp timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null default auth.uid()
);

create index tracking_updates_order_id_timestamp_idx on tracking_updates (order_id, timestamp desc);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

create index contact_messages_created_at_idx on contact_messages (created_at desc);
