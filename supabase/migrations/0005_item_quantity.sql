-- Replace the packaging-type dropdown (pcs/boxes/cartons/pallets/crates) on order_items
-- with a plain quantity count per line item.

alter table order_items add column quantity integer not null default 1 check (quantity > 0);
alter table order_items drop column unit;
drop type item_unit;
