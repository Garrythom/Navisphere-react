import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { STATUS_OPTIONS } from "@/lib/status";
import type { Database, OrderStatus } from "@/lib/database.types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type TrackingUpdate = Database["public"]["Tables"]["tracking_updates"]["Row"];

function toInputValue(iso: string) {
  const d = new Date(iso);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function UpdateEditPage() {
  useDocumentTitle("Edit Status Update");
  const { id, updateId } = useParams<{ id: string; updateId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [update, setUpdate] = useState<TrackingUpdate | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<OrderStatus>("order_received");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id || !updateId) return;
      const [orderRes, updateRes] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id).single(),
        supabase.from("tracking_updates").select("*").eq("id", updateId).single(),
      ]);
      setOrder(orderRes.data ?? null);
      if (updateRes.data) {
        setUpdate(updateRes.data);
        setStatus(updateRes.data.status);
        setLocation(updateRes.data.location);
        setNote(updateRes.data.note);
        setTimestamp(toInputValue(updateRes.data.timestamp));
      }
      setLoading(false);
    }
    load();
  }, [id, updateId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!updateId || !id) return;
    if (!location.trim()) {
      setError("Location is required.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const { error } = await supabase
      .from("tracking_updates")
      .update({
        status,
        location: location.trim(),
        note: note.trim(),
        timestamp: new Date(timestamp).toISOString(),
      })
      .eq("id", updateId);

    setSubmitting(false);
    if (error) {
      setError("Something went wrong saving this update. Please try again.");
      return;
    }
    navigate(`/orders/${id}`);
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!order || !update) {
    return <p className="text-sm text-muted">Update not found.</p>;
  }

  return (
    <div className="card mx-auto max-w-xl">
      <p className="text-sm text-muted">
        Editing update for <span className="font-medium text-navy">{order.tracking_number}</span>
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
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
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-accent">
            <Save className="h-4 w-4" />
            {submitting ? "Saving…" : "Save Changes"}
          </button>
          <Link to={`/orders/${order.id}`} className="btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
