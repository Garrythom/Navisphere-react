import { STATUS_META } from "@/lib/status";
import type { OrderStatus } from "@/lib/database.types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className="badge text-white" style={{ backgroundColor: meta.color }}>
      {meta.label}
    </span>
  );
}
