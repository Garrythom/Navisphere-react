-- Auto-generate tracking numbers (ports generate_tracking_number() from models.py)
-- and keep orders.current_status in sync with the latest tracking_updates row
-- (ports Order.refresh_current_status(), called from TrackingUpdate.save()).

create or replace function generate_tracking_number()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  candidate text;
  suffix text;
  i int;
begin
  loop
    suffix := '';
    for i in 1..8 loop
      suffix := suffix || substr(alphabet, floor(random() * length(alphabet) + 1)::int, 1);
    end loop;
    candidate := 'NAV-' || suffix;
    exit when not exists (select 1 from orders where tracking_number = candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function set_order_tracking_number()
returns trigger
language plpgsql
as $$
begin
  if new.tracking_number is null or btrim(new.tracking_number) = '' then
    new.tracking_number := generate_tracking_number();
  end if;
  return new;
end;
$$;

create trigger orders_set_tracking_number
  before insert on orders
  for each row
  execute function set_order_tracking_number();

create or replace function refresh_order_current_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_order_id uuid;
begin
  affected_order_id := coalesce(new.order_id, old.order_id);

  update orders
  set current_status = coalesce(
    (select status from tracking_updates
     where order_id = affected_order_id
     order by timestamp desc, id desc
     limit 1),
    'order_received'
  )
  where id = affected_order_id;

  if tg_op = 'UPDATE' and new.order_id is distinct from old.order_id then
    update orders
    set current_status = coalesce(
      (select status from tracking_updates
       where order_id = old.order_id
       order by timestamp desc, id desc
       limit 1),
      'order_received'
    )
    where id = old.order_id;
  end if;

  return null;
end;
$$;

create trigger tracking_updates_refresh_order_status
  after insert or update or delete on tracking_updates
  for each row
  execute function refresh_order_current_status();
