import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { formatDateTime } from "@/lib/status";
import type { Database } from "@/lib/database.types";

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

const PAGE_SIZE = 20;

export function MessagesListPage() {
  useDocumentTitle("Messages");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, count: total } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (cancelled) return;
      setMessages(data ?? []);
      setCount(total ?? 0);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    setSearchParams(params);
  }

  return (
    <>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4"></th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Subject</th>
              <th className="py-2 pr-4">Received</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted">
                  No messages yet.
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr
                  key={message.id}
                  className={`border-b border-border last:border-0 hover:bg-offwhite ${
                    !message.is_read ? "font-semibold" : ""
                  }`}
                >
                  <td className="py-3 pr-4">
                    {!message.is_read && <span className="inline-block h-2 w-2 rounded-full bg-accent" />}
                  </td>
                  <td className="py-3 pr-4">
                    <Link to={`/messages/${message.id}`} className="text-navy hover:text-accent">
                      {message.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 font-normal text-muted">{message.email}</td>
                  <td className="py-3 pr-4 font-normal">{message.subject}</td>
                  <td className="py-3 pr-4 font-normal text-muted">{formatDateTime(message.created_at)}</td>
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
