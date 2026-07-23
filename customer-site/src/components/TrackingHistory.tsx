import { Check } from "lucide-react";
import { STATUS_META, FORWARD_STAGES, ROUTE_STAGE_LABELS, formatDateTime } from "@/lib/status";
import type { OrderStatus } from "@/lib/database.types";

type Update = {
  status: OrderStatus;
  location: string;
  note: string;
  timestamp: string;
};

function isForwardStage(status: OrderStatus): status is (typeof FORWARD_STAGES)[number] {
  return (FORWARD_STAGES as readonly OrderStatus[]).includes(status);
}

export function TrackingHistory({
  currentStatus,
  origin,
  destination,
  updates,
}: {
  currentStatus: OrderStatus;
  origin: string;
  destination: string;
  updates: Update[];
}) {
  const isDelayed = currentStatus === "delayed";

  const lastForwardUpdate = updates.find((u) => isForwardStage(u.status));
  const progressIndex = isDelayed
    ? lastForwardUpdate
      ? FORWARD_STAGES.indexOf(lastForwardUpdate.status as (typeof FORWARD_STAGES)[number])
      : 0
    : FORWARD_STAGES.indexOf(currentStatus as (typeof FORWARD_STAGES)[number]);

  const progressPct = (progressIndex / (FORWARD_STAGES.length - 1)) * 100;
  const currentStageMeta = isDelayed ? STATUS_META.delayed : STATUS_META[FORWARD_STAGES[progressIndex]];
  const CurrentIcon = currentStageMeta.icon;

  return (
    <>
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/10 to-transparent p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Origin</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{origin}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Destination</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{destination}</p>
          </div>
        </div>

        <div className="relative mx-1 mt-5 h-[52px] sm:h-14">
          <div className="absolute left-0 right-0 top-[17px] h-0.5 rounded-full bg-border sm:top-[19px]" />
          <div
            className="absolute left-0 top-[17px] h-0.5 rounded-full bg-muted transition-all sm:top-[19px]"
            style={{ width: `${progressPct}%` }}
          />
          <div className="absolute inset-x-0 top-0 flex justify-between">
            {FORWARD_STAGES.map((stage, i) => {
              const isCurrent = i === progressIndex;
              const isDone = i < progressIndex;

              return (
                <div key={stage} className="flex w-8 flex-col items-center sm:w-9">
                  {isCurrent ? (
                    <div
                      className="-mt-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ring-4 sm:h-[34px] sm:w-[34px]"
                      style={{ backgroundColor: currentStageMeta.color, boxShadow: `0 0 0 5px ${currentStageMeta.color}2e` }}
                    >
                      <CurrentIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  ) : (
                    <div
                      className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-[3px] border-white ${
                        isDone ? "bg-status-delivered" : "bg-border"
                      }`}
                      style={{ boxShadow: `0 0 0 1.5px ${isDone ? "var(--color-status-delivered)" : "var(--color-border)"}` }}
                    >
                      {isDone && <Check className="h-2 w-2 stroke-[3.5] text-white" />}
                    </div>
                  )}
                  <p
                    className={`mt-2 max-w-[64px] text-center text-[10px] leading-tight sm:text-[11px] ${
                      isCurrent ? "font-semibold text-navy" : "text-muted"
                    }`}
                  >
                    {ROUTE_STAGE_LABELS[stage]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isDelayed && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-status-delayed/10 px-4 py-3 text-sm text-status-delayed">
          <currentStageMeta.icon className="h-4 w-4 shrink-0" />
          <span className="font-medium">{STATUS_META.delayed.label} &mdash; see the note below for details.</span>
        </div>
      )}

      <p className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-wide text-muted">Journal</p>
      {updates.length > 0 ? (
        <ul className="space-y-5">
          {updates.map((update, i) => {
            const updateMeta = STATUS_META[update.status];
            const Icon = updateMeta.icon;
            const isLast = i === updates.length - 1;
            return (
              <li key={i} className="relative flex gap-3.5">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: updateMeta.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {!isLast && <div className="mt-1 w-0.5 flex-1 bg-border" />}
                </div>
                <div className={isLast ? "" : "pb-1"}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="text-sm font-bold" style={{ color: updateMeta.color }}>
                      {updateMeta.label}
                    </p>
                    <time className="text-[11px] text-muted">{formatDateTime(update.timestamp)}</time>
                  </div>
                  <p className="mt-1 text-sm text-navy">{update.location}</p>
                  {update.note && <p className="mt-0.5 text-xs text-muted">{update.note}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted">No status updates yet &mdash; check back soon.</p>
      )}
    </>
  );
}
