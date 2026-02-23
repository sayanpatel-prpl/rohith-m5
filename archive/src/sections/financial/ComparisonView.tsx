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

// Only show metrics with real per-quarter data in trend charts.
// workingCapitalDays, roce, debtEquity are annual-only from Screener.in
// and are NOT available per quarter — omitted to avoid misleading charts.
const METRICS: MetricDef[] = [
  { key: "revenueGrowthYoY", label: "Revenue Growth (%)" },
  { key: "ebitdaMargin", label: "EBITDA Margin (%)" },
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
  // Transform history data to QoQ deltas (only for metrics with real quarterly data)
  const qoqCompanies = useMemo(() => {
    return companies.map((company) => ({
      ...company,
      history: company.history.map((snapshot, idx) => {
        if (idx === 0) {
          return { ...snapshot, revenueGrowthYoY: 0, ebitdaMargin: 0 };
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
