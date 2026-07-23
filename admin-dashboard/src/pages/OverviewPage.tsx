import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { StatusBadge } from "@/components/StatusBadge";
import type { Database } from "@/lib/database.types";

type Order = Database["public"]["Tables"]["orders"]["Row"];

type Stats = {
  totalOrders: number;
  inTransit: number;
  deliveredToday: number;
  delayed: number;
};

export function OverviewPage() {
  useDocumentTitle("Overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

      const [totalRes, inTransitRes, delayedRes, deliveredTodayRes, recentRes] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("current_status", "in_transit"),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("current_status", "delayed"),
        supabase
          .from("tracking_updates")
          .select("*", { count: "exact", head: true })
          .eq("status", "delivered")
          .gte("timestamp", startOfToday.toISOString())
          .lt("timestamp", startOfTomorrow.toISOString()),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      if (cancelled) return;

      setStats({
        totalOrders: totalRes.count ?? 0,
        inTransit: inTransitRes.count ?? 0,
        delayed: delayedRes.count ?? 0,
        deliveredToday: deliveredTodayRes.count ?? 0,
      });
      setRecentOrders(recentRes.data ?? []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !stats) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-muted">Total Orders</p>
          <p className="mt-2 font-heading text-3xl font-bold text-navy">{stats.totalOrders}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-muted">In Transit</p>
          <p className="mt-2 font-heading text-3xl font-bold" style={{ color: "#3B82F6" }}>
            {stats.inTransit}
          </p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-muted">Delivered Today</p>
          <p className="mt-2 font-heading text-3xl font-bold" style={{ color: "#10B981" }}>
            {stats.deliveredToday}
          </p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-muted">Delayed</p>
          <p className="mt-2 font-heading text-3xl font-bold" style={{ color: "#EF4444" }}>
            {stats.delayed}
          </p>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-navy">Recent Orders</h2>
          <Link to="/orders" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">Tracking #</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted">
                  No orders yet.
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-offwhite">
                  <td className="py-3 pr-4">
                    <Link to={`/orders/${order.id}`} className="font-medium text-navy hover:text-accent">
                      {order.tracking_number}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{order.customer_name}</td>
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
    </>
  );
}
