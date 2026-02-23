import clsx from "clsx";
import { formatINRCr } from "../../lib/formatters";
import type { OperationalIntelligenceData } from "../../types/sections";

interface ManufacturingCapacityProps {
  items: OperationalIntelligenceData["manufacturingCapacity"];
}

const actionConfig: Record<
  OperationalIntelligenceData["manufacturingCapacity"][number]["action"],
  { label: string; className: string }
> = {
  expansion:       { label: "Expansion",       className: "bg-positive/10 text-positive" },
  greenfield:      { label: "Greenfield",      className: "bg-chart-1/10 text-chart-1" },
  rationalization: { label: "Rationalization",  className: "bg-negative/10 text-negative" },
  maintenance:     { label: "Maintenance",      className: "bg-neutral/10 text-neutral" },
};

export function ManufacturingCapacity({ items }: ManufacturingCapacityProps) {
  return (
    <div className="space-y-sm">
      <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Manufacturing Capacity
      </h4>
      {items.map((item, i) => {
        const action = actionConfig[item.action];
        return (
          <div
            key={i}
            className="bg-surface-raised border border-surface-overlay rounded p-md space-y-xs"
          >
            <div className="flex items-center justify-between gap-sm">
              <p className="text-sm font-medium text-text-primary">{item.facility}</p>
              <span
                className={clsx(
                  "inline-flex items-center rounded px-sm py-xs text-xs font-medium whitespace-nowrap",
                  action.className,
                )}
              >
                {action.label}
              </span>
            </div>
            <div className="flex items-center gap-md text-xs text-text-secondary">
              {item.investmentCr != null && (
                <span className="font-mono">{formatINRCr(item.investmentCr)}</span>
              )}
              <span className="text-text-muted">{item.timeline}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
