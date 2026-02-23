import type { CompetitiveMovesData } from "../../types/sections";

interface PricingActionsProps {
  actions: CompetitiveMovesData["pricingActions"];
}

/** Config-record: action type -> badge styling */
const actionBadgeConfig: Record<
  CompetitiveMovesData["pricingActions"][number]["action"],
  { label: string; className: string }
> = {
  increase: {
    label: "Increase",
    className: "bg-negative/10 text-negative border-negative/20",
  },
  decrease: {
    label: "Decrease",
    className: "bg-positive/10 text-positive border-positive/20",
  },
  promotional: {
    label: "Promotional",
    className: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  },
};

function formatMagnitude(pct: number | null): string {
  if (pct === null) return "N/A";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export function PricingActions({ actions }: PricingActionsProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Pricing Actions
      </h3>

      {actions.length === 0 ? (
        <p className="text-xs text-text-muted italic">
          No pricing actions in this period.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-sm">
          {actions.map((action, i) => {
            const badge = actionBadgeConfig[action.action];
            return (
              <div
                key={`${action.company}-${action.category}-${i}`}
                className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-xs"
              >
                {/* Company + action type badge */}
                <div className="flex items-center justify-between gap-xs">
                  <span className="text-xs font-semibold text-text-primary truncate">
                    {action.company}
                  </span>
                  <span
                    className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded border whitespace-nowrap ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Category */}
                <p className="text-xs text-text-secondary">{action.category}</p>

                {/* Magnitude */}
                <p className="text-sm font-semibold text-text-primary">
                  {formatMagnitude(action.magnitudePct)}
                </p>

                {/* Context */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  {action.context}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
