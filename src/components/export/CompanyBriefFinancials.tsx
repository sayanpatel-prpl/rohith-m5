import { PerformanceTag } from "../ui/PerformanceTag";
import {
  formatGrowthRate,
  formatPercent,
} from "../../lib/formatters";
import type { FinancialPerformanceData } from "../../types/sections";

type FinancialCompany = FinancialPerformanceData["companies"][number];

interface CompanyBriefFinancialsProps {
  financialCompany: FinancialCompany | undefined;
}

export function CompanyBriefFinancials({ financialCompany }: CompanyBriefFinancialsProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-text-primary mb-xs flex items-center gap-sm">
        Financial Snapshot
        {financialCompany && (
          <PerformanceTag level={financialCompany.performance} compact />
        )}
      </h3>
      {financialCompany ? (
        <div className="grid grid-cols-5 gap-sm">
          <MetricCard
            label="Revenue Growth"
            value={formatGrowthRate(financialCompany.metrics.revenueGrowthYoY)}
          />
          <MetricCard
            label="EBITDA Margin"
            value={formatPercent(financialCompany.metrics.ebitdaMargin * 100)}
          />
          <MetricCard
            label="Working Capital"
            value={financialCompany.metrics.workingCapitalDays != null ? `${financialCompany.metrics.workingCapitalDays} days` : "\u2014"}
          />
          <MetricCard
            label="ROCE"
            value={financialCompany.metrics.roce != null ? formatPercent(financialCompany.metrics.roce * 100) : "\u2014"}
          />
          <MetricCard
            label="Debt/Equity"
            value={financialCompany.metrics.debtEquity != null ? `${financialCompany.metrics.debtEquity.toFixed(2)}x` : "\u2014"}
          />
        </div>
      ) : (
        <p className="text-xs text-text-secondary italic">
          No financial data available
        </p>
      )}
      {financialCompany?.varianceAnalysis && (
        <p className="text-xs text-text-secondary mt-xs leading-relaxed">
          {financialCompany.varianceAnalysis}
        </p>
      )}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-xs text-center">
      <p className="text-[10px] text-text-secondary mb-px">{label}</p>
      <p className="text-xs font-semibold text-text-primary">{value}</p>
    </div>
  );
}
