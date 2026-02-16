import clsx from "clsx";
import type { OperationalIntelligenceData } from "../../types/sections";

interface RetailFootprintProps {
  items: OperationalIntelligenceData["retailFootprint"];
}

const retailActionConfig: Record<
  OperationalIntelligenceData["retailFootprint"][number]["action"],
  { label: string; className: string }
> = {
  expansion:       { label: "Expanding",     className: "bg-positive/10 text-positive" },
  rationalization: { label: "Rationalizing", className: "bg-negative/10 text-negative" },
  reformat:        { label: "Reformatting",  className: "bg-neutral/10 text-neutral" },
};

export function RetailFootprint({ items }: RetailFootprintProps) {
  return (
    <div className="space-y-sm">
      <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Retail Footprint
      </h4>
      {items.map((item, i) => {
        const action = retailActionConfig[item.action];
        return (
          <div
            key={i}
            className="bg-surface-raised border border-surface-overlay rounded p-md space-y-xs"
          >
            <div className="flex items-center justify-between gap-sm">
              <div className="flex items-center gap-sm">
                <span
                  className={clsx(
                    "inline-flex items-center rounded px-sm py-xs text-xs font-medium whitespace-nowrap",
                    action.className,
                  )}
                >
                  {action.label}
                </span>
                {item.storeCount != null && (
                  <span className="text-xs text-text-primary font-medium">
                    {item.storeCount} stores
                  </span>
                )}
              </div>
              <span className="text-xs text-text-muted">{item.geography}</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{item.details}</p>
          </div>
        );
      })}
    </div>
  );
}
