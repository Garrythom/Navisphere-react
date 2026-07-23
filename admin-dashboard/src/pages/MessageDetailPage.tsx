import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { formatDateTime } from "@/lib/status";
import type { Database } from "@/lib/database.types";

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

export function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useDocumentTitle(message ? message.subject : "Message Detail");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      const { data } = await supabase.from("contact_messages").select("*").eq("id", id).single();
      if (cancelled || !data) return;
      setMessage(data);
      setLoading(false);

      if (!data.is_read) {
        await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!message) {
    return <p className="text-sm text-muted">Message not found.</p>;
  }

  return (
    <div className="card mx-auto max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-navy">{message.subject}</h2>
          <p className="mt-1 text-sm text-muted">
            From {message.name} &lt;{message.email}&gt;
          </p>
        </div>
        <p className="text-xs text-muted">{formatDateTime(message.created_at)}</p>
      </div>
      <div className="mt-6 whitespace-pre-wrap rounded-xl border border-border bg-offwhite p-4 text-sm text-navy">
        {message.message}
      </div>
      <Link to="/messages" className="btn-ghost mt-6 inline-flex">
        Back to Messages
      </Link>
    </div>
  );
}
