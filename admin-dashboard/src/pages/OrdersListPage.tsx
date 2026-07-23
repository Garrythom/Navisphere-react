import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { StatusBadge } from "@/components/StatusBadge";
import { STATUS_OPTIONS, formatDestination } from "@/lib/status";
import type { Database } from "@/lib/database.types";

type Order = Database["public"]["Tables"]["orders"]["Row"];

const PAGE_SIZE = 15;

export function OrdersListPage() {
  useDocumentTitle("Orders");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [orders, setOrders] = useState<Order[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let request = supabase.from("orders").select("*", { count: "exact" });

      const trimmed = query.trim().replace(/,/g, "");
      if (trimmed) {
        request = request.or(`tracking_number.ilike.%${trimmed}%,customer_name.ilike.%${trimmed}%`);
      }
      if (status) {
        request = request.eq("current_status", status as Order["current_status"]);
      }

      const { data, count: total } = await request.order("created_at", { ascending: false }).range(from, to);

      if (cancelled) return;
      setOrders(data ?? []);
      setCount(total ?? 0);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query, status, page]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    setSearchParams(params);
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const q = (form.elements.namedItem("q") as HTMLInputElement).value;
            const statusValue = (form.elements.namedItem("status") as HTMLSelectElement).value;
            updateParams({ q, status: statusValue });
          }}
        >
          <input
            type="text"
            name="q"
            defaultValue={query}
            key={`q-${query}`}
            placeholder="Search tracking # or customer"
            className="form-input w-64"
          />
          <select name="status" defaultValue={status} key={`status-${status}`} className="form-input w-48">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-ghost">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </form>
        <Link to="/orders/new" className="btn-accent">
          <Plus className="h-4 w-4" />
          New Order
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">Tracking #</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Route</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted">
                  No orders match your search.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-offwhite">
                  <td className="py-3 pr-4">
                    <Link to={`/orders/${order.id}`} className="font-medium text-navy hover:text-accent">
                      {order.tracking_number}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{order.customer_name}</td>
                  <td className="py-3 pr-4 text-muted">
                    {order.origin} → {formatDestination(order)}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={order.current_status} />
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <button onClick={() => goToPage(page - 1)} className="btn-ghost px-3 py-1.5">
              Previous
            </button>
          )}
          <span className="text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <button onClick={() => goToPage(page + 1)} className="btn-ghost px-3 py-1.5">
              Next
            </button>
          )}
        </div>
      )}
    </>
  );
}
