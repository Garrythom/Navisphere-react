# Supabase schema

Ports the data model from the old Django app (`trackingsite/tracking/models.py`) onto
Postgres/Supabase. Shared by both `customer-site` (public lookup + contact form) and
`admin-dashboard` (staff CRUD).

## Migrations

Run in order — each depends on the ones before it:

1. `0001_schema.sql` — enums (`order_status`, `item_unit`) and tables (`orders`,
   `order_items`, `tracking_updates`, `contact_messages`).
2. `0002_functions_triggers.sql` — auto-generates `NAV-XXXXXXXX` tracking numbers on
   insert; keeps `orders.current_status` in sync whenever a `tracking_updates` row is
   inserted, edited, or deleted.
3. `0003_rls_policies.sql` — enables RLS. Any authenticated user (staff — accounts are
   created manually in the Supabase dashboard, there's no public signup) gets full
   access to orders/items/updates. The public can only insert `contact_messages`;
   only staff can read/update them.
4. `0004_public_tracking_lookup.sql` — `get_order_by_tracking_number(text)` RPC. The
   public tracking page calls this instead of querying `orders` directly, since there's
   no public SELECT policy on `orders` (it holds `customer_email`, `customer_phone`,
   `notes` — none of that should be reachable with just the anon key). Returns only the
   fields the public results page actually shows.
5. `0005_item_quantity.sql` — replaces `order_items.unit` (a pcs/boxes/cartons/pallets/
   crates packaging-type dropdown, ported from Django) with a plain `quantity` integer.
   Drops the now-unused `item_unit` enum. **Must run before re-running `0004`** (see
   below) — `0004` was updated to return `quantity` instead of `unit`.

## How to apply

No Supabase CLI is installed locally yet. Easiest path: open the Supabase project's
**SQL Editor** and run the files in order (paste + Run, one at a time).

If you already ran the original `0001`–`0004` before `0005` existed: run `0005` now,
then **re-run `0004`** — it's a `create or replace function`, safe to run again, and
picks up the `quantity` column instead of the removed `unit` one.

If you install the [Supabase CLI](https://supabase.com/docs/guides/cli) later, this
folder is already laid out for it — `supabase link` then `supabase db push` will apply
everything in order.

## Staff accounts

There's no signup flow. Create staff logins directly in **Authentication → Users** in
the Supabase dashboard (or via `supabase.auth.admin.createUser` from a trusted script).
Any authenticated user is treated as staff — that matches the old Django dashboard,
which was a single `@login_required` area with no role distinction.

## Not covered here

- Email notification on new contact messages (Django sent SMTP mail via `send_mail`).
- Rate limiting on the admin-dashboard login (Django did 10/5min per IP via
  `django-ratelimit`). `customer-site`'s tracking lookup now has an equivalent (see
  `customer-site/src/proxy.ts` — 15/min per IP, in-memory, mirroring Django's original
  limit). Login isn't rate-limited client-side since `admin-dashboard` is a static SPA
  with no server layer of its own; Supabase Auth applies its own baseline IP-based
  abuse protection on sign-in attempts regardless.
