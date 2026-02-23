import { TrendIndicator } from "../../components/ui/TrendIndicator";
import type { SubSectorDeepDiveData } from "../../types/sections";

/** Module-scope formatter: percentage with one decimal place */
const pctFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface CostBreakdownTableProps {
  costs: SubSectorDeepDiveData["costsBreakdown"];
}

export function CostBreakdownTable({ costs }: CostBreakdownTableProps) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Cost Structure Details
      </h3>

      {/* CSS Grid table */}
      <div className="grid grid-cols-[1fr_70px_50px_2fr] gap-x-md gap-y-sm items-start">
        {/* Header row */}
        <div className="text-[10px] font-medium text-text-muted uppercase tracking-wide">
          Cost Item
        </div>
        <div className="text-[10px] font-medium text-text-muted uppercase tracking-wide text-right">
          Share
        </div>
        <div className="text-[10px] font-medium text-text-muted uppercase tracking-wide text-center">
          Trend
        </div>
        <div className="text-[10px] font-medium text-text-muted uppercase tracking-wide">
          Notes
        </div>

        {/* Separator */}
        <div className="col-span-4 border-b border-surface-overlay" />

        {/* Data rows */}
        {costs.map((cost) => (
          <div key={cost.costItem} className="contents">
            <div className="text-xs text-text-primary font-medium">
              {cost.costItem}
            </div>
            <div className="text-xs font-semibold text-text-primary text-right">
              {pctFormatter.format(cost.sharePct)}%
            </div>
            <div className="text-center">
              <TrendIndicator direction={cost.trendVsPrior} />
            </div>
            <div className="text-xs text-text-secondary leading-relaxed">
              {cost.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
