import { StatCard } from "../../components/ui/StatCard";
import { formatINRCr } from "../../lib/formatters";
import type { DealsTransactionsData } from "../../types/sections";

interface DealSummaryStatsProps {
  deals: DealsTransactionsData["deals"];
  patternCount: number;
}

export function DealSummaryStats({
  deals,
  patternCount,
}: DealSummaryStatsProps) {
  const totalDeals = deals.length;
  const totalValue = deals
    .filter((d) => d.valueCr !== null)
    .reduce((sum, d) => sum + (d.valueCr ?? 0), 0);
  const maCount = deals.filter((d) => d.type === "M&A").length;

  return (
    <div className="grid grid-cols-4 gap-md">
      <StatCard label="Total Deals" value={String(totalDeals)} />
      <StatCard label="Total Value" value={formatINRCr(totalValue)} />
      <StatCard label="M&A Deals" value={String(maCount)} />
      <StatCard label="AI Patterns" value={String(patternCount)} />
    </div>
  );
}
