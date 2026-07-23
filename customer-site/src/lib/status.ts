import {
  Inbox,
  PackageCheck,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { OrderStatus } from "./database.types";

export const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; icon: LucideIcon }
> = {
  order_received: { label: "Order Received", color: "#64748B", icon: Inbox },
  order_picked_up: { label: "Order Picked Up", color: "#14B8A6", icon: PackageCheck },
  processing: { label: "Order Placed / Processing", color: "#F59E0B", icon: Package },
  in_transit: { label: "Shipped / In Transit", color: "#3B82F6", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "#6366F1", icon: MapPin },
  delivered: { label: "Delivered", color: "#10B981", icon: CheckCircle2 },
  delayed: { label: "Delayed / Issue", color: "#EF4444", icon: AlertTriangle },
};

export function formatDestination(order: {
  destination_street: string;
  destination_city: string;
  destination_state: string;
  destination_zip_code: string;
  destination_country: string;
}) {
  const cityState = [order.destination_city, order.destination_state]
    .filter(Boolean)
    .join(", ");
  const withZip = order.destination_zip_code
    ? `${cityState} ${order.destination_zip_code}`
    : cityState;
  const withCountry = `${withZip}, ${order.destination_country}`;
  return order.destination_street ? `${order.destination_street}, ${withCountry}` : withCountry;
}
