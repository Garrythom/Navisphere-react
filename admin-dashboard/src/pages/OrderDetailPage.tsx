import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Check, Copy, Plus, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { STATUS_META, STATUS_OPTIONS, formatDateTime, formatDestination } from "@/lib/status";
import type { Database, OrderStatus } from "@/lib/database.types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
type TrackingUpdate = Database["public"]["Tables"]["tracking_updates"]["Row"];

function nowForInput() {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const routerLocation = useLocation();
  const itemsError = (routerLocation.state as { itemsError?: string } | null)?.itemsError;
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [updates, setUpdates] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<TrackingUpdate | null>(null);

  const [status, setStatus] = useState<OrderStatus>("order_received");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [timestamp, setTimestamp] = useState(nowForInput());
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useDocumentTitle(order ? order.tracking_number : "Order Detail");

  const load = useCallback(async () => {
    if (!id) return;
    const [orderRes, itemsRes, updatesRes] = await Promise.all([
      supabase.from("orders").select("*").eq("id", id).single(),
      supabase.from("order_items").select("*").eq("order_id", id),
      supabase.from("tracking_updates").select("*").eq("order_id", id).order("timestamp", { ascending: false }),
    ]);
    setOrder(orderRes.data ?? null);
    setItems(itemsRes.data ?? []);
    setUpdates(updatesRes.data ?? []);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAddUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id) return;
    if (!location.trim()) {
      setFormError("Location is required.");
      return;
    }
    setFormError(null);
    setSubmitting(true);

    const { error } = await supabase.from("tracking_updates").insert({
      order_id: id,
      status,
      location: location.trim(),
      note: note.trim(),
      timestamp: new Date(timestamp).toISOString(),
    });

    setSubmitting(false);
    if (error) {
      setFormError("Something went wrong adding the update. Please try again.");
      return;
    }

    setLocation("");
    setNote("");
    setTimestamp(nowForInput());
    setStatus("order_received");
    load();
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    await supabase.from("tracking_updates").delete().eq("id", pendingDelete.id);
    setPendingDelete(null);
    load();
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!order) {
    return <p className="text-sm text-muted">Order not found.</p>;
  }

  return (
    <>
      {itemsError && (
        <div className="card mb-6 flex items-start gap-3 border-status-delayed/30 bg-status-delayed/5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-delayed" />
          <p className="text-sm text-navy">{itemsError}</p>
        </div>
      )}

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Tracking Number</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-heading text-2xl font-bold text-navy">{order.tracking_number}</p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(order.tracking_number);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-offwhite"
                aria-label="Copy tracking number"
              >
                {copied ? <Check className="h-4 w-4 text-status-delivered" /> : <Copy className="h-4 w-4" />}
              </button>
              {copied && <span className="text-xs text-status-delivered">Copied!</span>}
            </div>
          </div>
          <StatusBadge status={order.current_status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Customer</p>
            <p className="mt-1 text-sm font-medium text-navy">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Email</p>
            <p className="mt-1 text-sm font-medium text-navy">{order.customer_email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Phone</p>
            <p className="mt-1 text-sm font-medium text-navy">{order.customer_phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Origin</p>
            <p className="mt-1 text-sm font-medium text-navy">{order.origin}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Destination</p>
            <p className="mt-1 text-sm font-medium text-navy">{formatDestination(order)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Created</p>
            <p className="mt-1 text-sm font-medium text-navy">{formatDateTime(order.created_at)}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-muted">Items</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 text-navy">{item.product}</td>
                    <td className="py-2 pr-4 text-navy">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {order.notes && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-muted">Notes</p>
            <p className="mt-1 text-sm text-navy">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="card mt-6 max-w-xl">
        <h2 className="font-heading text-lg font-semibold text-navy">Add Status Update</h2>
        <form onSubmit={handleAddUpdate} className="mt-4 space-y-4" noValidate>
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="form-input"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="note" className="form-label">
              Note (optional)
            </label>
            <input id="note" type="text" value={note} onChange={(e) => setNote(e.target.value)} className="form-input" />
          </div>
          <div>
            <label htmlFor="timestamp" className="form-label">
              Date &amp; Time
            </label>
            <input
              id="timestamp"
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="form-input"
            />
          </div>
          {formError && <p className="text-xs text-red-600">{formError}</p>}
          <button type="submit" disabled={submitting} className="btn-accent">
            <Plus className="h-4 w-4" />
            {submitting ? "Adding…" : "Add Update"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-navy">History</h2>
        <div className="mt-4 space-y-3">
          {updates.length === 0 ? (
            <p className="text-sm text-muted">No status updates yet.</p>
          ) : (
            updates.map((update) => {
              const meta = STATUS_META[update.status];
              const Icon = meta.icon;
              return (
                <div key={update.id} className="card flex flex-wrap items-center justify-between gap-3 !p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: meta.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {meta.label} — {update.location}
                      </p>
                      {update.note && <p className="text-sm text-muted">{update.note}</p>}
                      <p className="text-xs text-muted">{formatDateTime(update.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/orders/${order.id}/updates/${update.id}/edit`} className="btn-ghost px-3 py-1.5 text-xs">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(update)}
                      className="btn-ghost px-3 py-1.5 text-xs text-status-delayed"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this status update?"
          description={`${STATUS_META[pendingDelete.status].label} — ${pendingDelete.location} (${formatDateTime(
            pendingDelete.timestamp
          )}) for order ${order.tracking_number}. This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  );
}
