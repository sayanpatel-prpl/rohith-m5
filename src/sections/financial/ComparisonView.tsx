import { useMemo } from "react";
import { Tabs } from "radix-ui";
import { ComparisonChart } from "./ComparisonChart";
import type { QuarterlySnapshot } from "../../types/financial";

/** Metric keys from QuarterlySnapshot, excluding "period" */
type MetricKey = Exclude<keyof QuarterlySnapshot, "period">;

interface MetricDef {
  key: MetricKey;
  label: string;
}

const METRICS: MetricDef[] = [
  { key: "revenueGrowthYoY", label: "Revenue Growth (%)" },
  { key: "ebitdaMargin", label: "EBITDA Margin (%)" },
  { key: "workingCapitalDays", label: "Working Capital (Days)" },
  { key: "roce", label: "ROCE (%)" },
  { key: "debtEquity", label: "Debt/Equity Ratio" },
];

interface ComparisonViewProps {
  companies: Array<{
    id: string;
    name: string;
    history: QuarterlySnapshot[];
  }>;
}

/**
 * Side-by-side comparison view with YoY/QoQ period toggle.
 * Shows 5 trend charts, one per financial metric, for selected companies.
 */
export function ComparisonView({ companies }: ComparisonViewProps) {
  // Transform history data to QoQ deltas
  const qoqCompanies = useMemo(() => {
    return companies.map((company) => ({
      ...company,
      history: company.history.map((snapshot, idx) => {
        if (idx === 0) {
          // No previous quarter to compare
          return { ...snapshot, revenueGrowthYoY: 0, ebitdaMargin: 0, workingCapitalDays: 0, roce: 0, debtEquity: 0 };
        }
        const prev = company.history[idx - 1];
        return {
          period: snapshot.period,
          revenueGrowthYoY:
            prev.revenueGrowthYoY !== 0
              ? (snapshot.revenueGrowthYoY - prev.revenueGrowthYoY) /
                Math.abs(prev.revenueGrowthYoY)
              : 0,
          ebitdaMargin:
            prev.ebitdaMargin !== 0
              ? (snapshot.ebitdaMargin - prev.ebitdaMargin) /
                Math.abs(prev.ebitdaMargin)
              : 0,
          // Working capital days: show absolute change (not ratio)
          workingCapitalDays:
            snapshot.workingCapitalDays - prev.workingCapitalDays,
          roce:
            prev.roce !== 0
              ? (snapshot.roce - prev.roce) / Math.abs(prev.roce)
              : 0,
          debtEquity:
            prev.debtEquity !== 0
              ? (snapshot.debtEquity - prev.debtEquity) /
                Math.abs(prev.debtEquity)
              : 0,
        };
      }),
    }));
  }, [companies]);

  return (
    <div className="space-y-md">
      {/* Section header */}
      <div className="flex items-center gap-sm">
        <h3 className="text-xs font-semibold text-text-primary">
          Company Comparison
        </h3>
        <span className="text-[10px] font-medium text-text-muted bg-surface-overlay rounded px-sm py-xs">
          {companies.length} companies
        </span>
      </div>

      <Tabs.Root defaultValue="YoY">
        <Tabs.List className="flex gap-xs mb-md border-b border-surface-overlay">
          <Tabs.Trigger
            value="YoY"
            className="px-md py-xs text-xs text-text-muted data-[state=active]:text-brand-accent data-[state=active]:border-b-2 data-[state=active]:border-brand-accent transition-colors"
          >
            Year over Year
          </Tabs.Trigger>
          <Tabs.Trigger
            value="QoQ"
            className="px-md py-xs text-xs text-text-muted data-[state=active]:text-brand-accent data-[state=active]:border-b-2 data-[state=active]:border-brand-accent transition-colors"
          >
            Quarter over Quarter
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="YoY">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            {METRICS.map((m) => (
              <ComparisonChart
                key={m.key}
                companies={companies}
                metric={m.key}
                label={m.label}
              />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="QoQ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            {METRICS.map((m) => (
              <ComparisonChart
                key={m.key}
                companies={qoqCompanies}
                metric={m.key}
                label={`${m.label} (QoQ Change)`}
              />
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
