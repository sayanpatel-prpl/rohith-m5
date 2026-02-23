import { StatCard } from "../../components/ui/StatCard";
import type { CompetitiveMovesData } from "../../types/sections";

interface CompetitiveSummaryStatsProps {
  data: CompetitiveMovesData;
}

export function CompetitiveSummaryStats({
  data,
}: CompetitiveSummaryStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-md">
      <StatCard
        label="Product Launches"
        value={String(data.productLaunches.length)}
      />
      <StatCard
        label="Pricing Actions"
        value={String(data.pricingActions.length)}
      />
      <StatCard
        label="D2C Initiatives"
        value={String(data.d2cInitiatives.length)}
      />
      <StatCard
        label="QC Partnerships"
        value={String(data.qcPartnerships.length)}
      />
    </div>
  );
}
