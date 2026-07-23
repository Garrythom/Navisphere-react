import type { Metadata } from "next";
import { headers } from "next/headers";
import { Search, SearchX, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { STATUS_META, formatDestination, formatDateTime } from "@/lib/status";
import { TrackingHistory } from "@/components/TrackingHistory";

export const metadata: Metadata = {
  title: "Track Your Order — Navisphere Logistics",
  description: "Enter your Navisphere Logistics tracking number to see your order's current status and history.",
};

export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ tracking_number?: string }>;
}) {
  const { tracking_number } = await searchParams;
  const searched = Boolean(tracking_number);

  const hdrs = await headers();
  const wasLimited = searched && hdrs.get("x-rate-limited") === "1";

  const { data: results } = searched && !wasLimited
    ? await supabase.rpc("get_order_by_tracking_number", {
        p_tracking_number: tracking_number!,
      })
    : { data: null };

  const order = results?.[0] ?? null;
  const statusMeta = order ? STATUS_META[order.current_status] : null;
  const lastUpdate = order?.updates[0]?.timestamp ?? order?.created_at;

  return (
    <>
      <section className="relative flex min-h-[400px] items-center overflow-hidden sm:min-h-[450px] lg:min-h-[500px]">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/85 to-navy" />
        <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">Track Your Order</h1>
          <p className="mt-3 text-lg text-slate-300">Enter your tracking number below to see the latest status.</p>

          <form action="/tracking" className="mx-auto mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="tracking-number" className="sr-only">
              Tracking number
            </label>
            <input
              id="tracking-number"
              type="text"
              name="tracking_number"
              defaultValue={tracking_number ?? ""}
              placeholder="e.g. NAV-7K2P9QX1"
              autoCapitalize="characters"
              className="w-full flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-lg text-navy placeholder:text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent/40"
              required
            />
            <button type="submit" className="btn-accent justify-center whitespace-nowrap">
              <Search className="h-4 w-4" />
              Track
            </button>
          </form>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {wasLimited && (
            <div className="card text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-status-delayed" />
              <h2 className="mt-4 font-heading text-xl font-semibold text-navy">Too many lookup attempts</h2>
              <p className="mt-2 text-sm text-muted">Please wait a minute and try again.</p>
            </div>
          )}

          {searched && !wasLimited && !order && (
            <div className="card text-center">
              <SearchX className="mx-auto h-10 w-10 text-muted" />
              <h2 className="mt-4 font-heading text-xl font-semibold text-navy">Order not found</h2>
              <p className="mt-2 text-sm text-muted">
                We couldn&rsquo;t find an order with that tracking number. Please double-check and try again.
              </p>
            </div>
          )}

          {order && statusMeta && (
            <>
              <div className="card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Tracking Number</p>
                    <p className="font-heading text-xl font-bold text-navy">{order.tracking_number}</p>
                  </div>
                  <span
                    className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: statusMeta.color }}
                  >
                    <statusMeta.icon className="h-3.5 w-3.5" />
                    {statusMeta.label}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Customer</p>
                    <p className="mt-1 text-sm font-medium text-navy">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Last Updated</p>
                    <p className="mt-1 text-sm font-medium text-navy">
                      {lastUpdate ? formatDateTime(lastUpdate) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Origin</p>
                    <p className="mt-1 text-sm font-medium text-navy">{order.origin}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-muted">Destination</p>
                    <p className="mt-1 text-sm font-medium text-navy">{formatDestination(order)}</p>
                  </div>
                </div>

                {order.items.length > 0 && (
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide text-muted">Package Contents</p>
                    <ul className="mt-2 space-y-1 text-sm text-navy">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex justify-between gap-4">
                          <span>{item.product}</span>
                          <span className="text-muted">Qty: {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <h2 className="mt-10 font-heading text-lg font-semibold text-navy">Tracking History</h2>
              <div className="relative mt-6">
                <TrackingHistory
                  currentStatus={order.current_status}
                  origin={order.origin}
                  destination={formatDestination(order)}
                  updates={order.updates}
                />
              </div>
            </>
          )}

          {!searched && (
            <p className="text-center text-sm text-muted">Enter a tracking number above to see your order&rsquo;s status.</p>
          )}
        </div>
      </section>
    </>
  );
}
