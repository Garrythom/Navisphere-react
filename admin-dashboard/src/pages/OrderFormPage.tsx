import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

type ItemRow = { product: string; quantity: number };

export function OrderFormPage() {
  useDocumentTitle("New Order");
  const navigate = useNavigate();

  const [items, setItems] = useState<ItemRow[]>([{ product: "", quantity: 1 }]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateItem(index: number, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const validItems = items.filter((item) => item.product.trim());

    if (validItems.length === 0) {
      setError("Add at least one item.");
      return;
    }

    setSubmitting(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: String(formData.get("customer_name")),
        customer_email: String(formData.get("customer_email")),
        customer_phone: String(formData.get("customer_phone") ?? ""),
        origin: String(formData.get("origin")),
        destination_street: String(formData.get("destination_street")),
        destination_country: String(formData.get("destination_country")),
        destination_city: String(formData.get("destination_city")),
        destination_state: String(formData.get("destination_state") ?? ""),
        destination_zip_code: String(formData.get("destination_zip_code") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      })
      .select()
      .single();

    if (orderError || !order) {
      setSubmitting(false);
      setError("Something went wrong creating the order. Please try again.");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      validItems.map((item) => ({ order_id: order.id, product: item.product.trim(), quantity: item.quantity }))
    );

    setSubmitting(false);

    if (itemsError) {
      setError("Order was created, but adding items failed. You can add them from the order detail page.");
      navigate(`/orders/${order.id}`);
      return;
    }

    navigate(`/orders/${order.id}`);
  }

  return (
    <div className="card mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted">Customer</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="customer_name" className="form-label">
              Customer Name
            </label>
            <input id="customer_name" name="customer_name" type="text" required className="form-input" />
          </div>
          <div>
            <label htmlFor="customer_email" className="form-label">
              Customer Email
            </label>
            <input id="customer_email" name="customer_email" type="email" required className="form-input" />
          </div>
          <div>
            <label htmlFor="customer_phone" className="form-label">
              Customer Phone
            </label>
            <input id="customer_phone" name="customer_phone" type="text" className="form-input" />
          </div>
        </div>

        <h2 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wide text-muted">
          Origin &amp; Destination
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="origin" className="form-label">
              Origin
            </label>
            <input id="origin" name="origin" type="text" required className="form-input" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="destination_street" className="form-label">
              Destination Street Address
            </label>
            <input id="destination_street" name="destination_street" type="text" required className="form-input" />
          </div>
          <div>
            <label htmlFor="destination_country" className="form-label">
              Destination Country
            </label>
            <input id="destination_country" name="destination_country" type="text" required className="form-input" />
          </div>
          <div>
            <label htmlFor="destination_city" className="form-label">
              Destination City
            </label>
            <input id="destination_city" name="destination_city" type="text" required className="form-input" />
          </div>
          <div>
            <label htmlFor="destination_state" className="form-label">
              Destination State / Province
            </label>
            <input id="destination_state" name="destination_state" type="text" className="form-input" />
          </div>
          <div>
            <label htmlFor="destination_zip_code" className="form-label">
              Destination Zip / Postal Code
            </label>
            <input id="destination_zip_code" name="destination_zip_code" type="text" className="form-input" />
          </div>
        </div>

        <h2 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wide text-muted">
          Package Details
        </h2>
        <p className="mt-1 text-xs text-muted">Add a line for each product in this order.</p>

        <div className="mt-4 space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 rounded-xl border border-border p-3">
              <div className="col-span-12 sm:col-span-8">
                <label className="form-label">Product / Item Description</label>
                <input
                  type="text"
                  value={item.product}
                  onChange={(e) => updateItem(index, { product: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="col-span-9 sm:col-span-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(index, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                  className="form-input"
                />
              </div>
              <div className="col-span-3 flex items-center sm:col-span-1 sm:justify-center sm:pt-6">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-sm font-medium text-status-delayed hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { product: "", quantity: 1 }])}
          className="btn-ghost mt-3"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>

        <div className="mt-8">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea id="notes" name="notes" rows={3} className="form-input" />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-accent mt-6">
          <Plus className="h-4 w-4" />
          {submitting ? "Creating…" : "Create Order"}
        </button>
      </form>
    </div>
  );
}
