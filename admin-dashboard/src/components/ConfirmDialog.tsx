import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4">
      <div className="card w-full max-w-lg text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-status-delayed" />
        <h2 className="mt-4 font-heading text-lg font-semibold text-navy">{title}</h2>
        <p className="mt-2 text-sm text-muted">{description}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="btn bg-status-delayed text-white hover:brightness-105"
          >
            {confirmLabel}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
