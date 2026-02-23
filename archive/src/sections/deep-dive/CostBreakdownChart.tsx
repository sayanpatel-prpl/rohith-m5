import type { SubSectorDeepDiveData } from "../../types/sections";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

interface CostBreakdownChartProps {
  costs: SubSectorDeepDiveData["costsBreakdown"];
}

export function CostBreakdownChart({ costs }: CostBreakdownChartProps) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        COGS Breakdown
      </h3>

      {/* Horizontal stacked bar */}
      <div className="flex h-8 rounded overflow-hidden">
        {costs.map((cost, i) => (
          <div
            key={cost.costItem}
            className="flex items-center justify-center text-xs font-medium text-white min-w-0"
            style={{
              width: `${cost.sharePct}%`,
              backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
            }}
            title={`${cost.costItem}: ${cost.sharePct}%`}
          >
            {cost.sharePct >= 12 ? `${cost.sharePct}%` : ""}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-xs">
        {costs.map((cost, i) => (
          <div key={cost.costItem} className="flex items-center gap-xs">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
              }}
            />
            <span className="text-xs text-text-secondary truncate">
              {cost.costItem}
            </span>
            <span className="text-xs font-medium text-text-primary ml-auto shrink-0">
              {cost.sharePct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
