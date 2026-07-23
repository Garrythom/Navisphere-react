-- Access model:
-- - Staff (any authenticated Supabase Auth user — accounts are created manually,
--   there is no public signup, mirroring the old Django @login_required dashboard)
--   get full read/write access to orders, order_items and tracking_updates.
-- - The public (anon) site never queries these tables directly — tracking lookups
--   go through the get_order_by_tracking_number() RPC (see 0004) so customer_email,
--   customer_phone, notes and created_by are never exposed.
-- - Anyone can submit a contact message, but only staff can read or update them.

alter table orders enable row level security;
alter table order_items enable row level security;
alter table tracking_updates enable row level security;
alter table contact_messages enable row level security;

create policy "staff full access to orders"
  on orders for all
  to authenticated
  using (true)
  with check (true);

create policy "staff full access to order_items"
  on order_items for all
  to authenticated
  using (true)
  with check (true);

create policy "staff full access to tracking_updates"
  on tracking_updates for all
  to authenticated
  using (true)
  with check (true);

create policy "anyone can submit a contact message"
  on contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "staff can view contact messages"
  on contact_messages for select
  to authenticated
  using (true);

create policy "staff can update contact messages"
  on contact_messages for update
  to authenticated
  using (true)
  with check (true);
