-- Public tracking lookup (ports tracking.views.tracking_lookup + tracking_results.html).
-- SECURITY DEFINER so the anon key can look up a single order by exact tracking number
-- without needing a direct SELECT policy on orders (which would otherwise expose every
-- row, including customer_email/customer_phone/notes, to anyone holding the anon key).
-- Only the fields the public template actually renders are returned.

create or replace function get_order_by_tracking_number(p_tracking_number text)
returns table (
  tracking_number text,
  customer_name text,
  origin text,
  destination_street text,
  destination_country text,
  destination_city text,
  destination_state text,
  destination_zip_code text,
  current_status order_status,
  created_at timestamptz,
  items jsonb,
  updates jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
begin
  select * into v_order
  from orders o
  where upper(o.tracking_number) = upper(btrim(p_tracking_number))
  limit 1;

  if not found then
    return;
  end if;

  return query
  select
    v_order.tracking_number,
    v_order.customer_name,
    v_order.origin,
    v_order.destination_street,
    v_order.destination_country,
    v_order.destination_city,
    v_order.destination_state,
    v_order.destination_zip_code,
    v_order.current_status,
    v_order.created_at,
    coalesce(
      (select jsonb_agg(jsonb_build_object('product', product, 'quantity', quantity))
       from order_items where order_id = v_order.id),
      '[]'::jsonb
    ),
    coalesce(
      (select jsonb_agg(
                jsonb_build_object(
                  'status', status,
                  'location', location,
                  'note', note,
                  'timestamp', timestamp
                ) order by timestamp desc
              )
       from tracking_updates where order_id = v_order.id),
      '[]'::jsonb
    );
end;
$$;

revoke all on function get_order_by_tracking_number(text) from public;
grant execute on function get_order_by_tracking_number(text) to anon, authenticated;
