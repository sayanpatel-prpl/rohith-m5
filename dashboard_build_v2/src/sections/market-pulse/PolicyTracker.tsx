/**
 * Policy Tracker component for Market Pulse section.
 *
 * MRKT-04: Displays active/upcoming/expired policies affecting the
 * consumer durables sector with status indicators and impact descriptions.
 */

import { clsx } from "clsx";
import type { PolicyEntry } from "@/types/market-pulse";

interface PolicyTrackerProps {
  policies: PolicyEntry[];
}

const STATUS_STYLES: Record<
  string,
  { dot: string; label: string }
> = {
  active: { dot: "bg-positive", label: "Active" },
  upcoming: { dot: "bg-brand-accent", label: "Upcoming" },
  expired: { dot: "bg-text-muted", label: "Expired" },
};

export function PolicyTracker({ policies }: PolicyTrackerProps) {
  if (policies.length === 0) {
    return null;
  }

  return (
    <div className="rounded border border-border-default bg-surface-raised p-md">
      <h3 className="text-sm font-semibold text-text-primary mb-sm">
        Policy Tracker
      </h3>

      <div className="space-y-sm">
        {policies.map((policy, i) => {
          const status = STATUS_STYLES[policy.status] ?? STATUS_STYLES.active;

          return (
            <div
              key={`${policy.policy}-${i}`}
              className="flex items-start gap-sm py-xs border-b border-surface-overlay last:border-b-0"
            >
              {/* Status dot */}
              <div className="flex items-center gap-xs mt-0.5 shrink-0">
                <span
                  className={clsx("inline-block w-2 h-2 rounded-full", status.dot)}
                  title={status.label}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-xs flex-wrap">
                  <span className="text-xs font-medium text-text-primary">
                    {policy.policy}
                  </span>
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {policy.impact}
                </p>
                {policy.affectedCompanies.length > 0 && (
                  <p className="text-[10px] text-text-muted">
                    Affects:{" "}
                    {policy.affectedCompanies
                      .map((id) => id.charAt(0).toUpperCase() + id.slice(1))
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
