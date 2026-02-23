import { useMemo } from "react";
import { TrendLineChart } from "../../components/charts/TrendLineChart";
import type { QuarterlySnapshot } from "../../types/financial";

/** Metric keys from QuarterlySnapshot, excluding "period" */
type MetricKey = Exclude<keyof QuarterlySnapshot, "period">;

/** Chart color CSS custom properties for up to 5 companies */
const CHART_COLORS = [
  "--color-chart-1",
  "--color-chart-2",
  "--color-chart-3",
  "--color-chart-4",
  "--color-chart-5",
];

interface ComparisonChartProps {
  companies: Array<{ id: string; name: string; history: QuarterlySnapshot[] }>;
  metric: MetricKey;
  label: string;
}

/**
 * Single metric trend chart for selected comparison companies.
 * Derives chart data via useMemo from company history arrays.
 */
export function ComparisonChart({
  companies,
  metric,
  label,
}: ComparisonChartProps) {
  const chartData = useMemo(() => {
    if (companies.length === 0) return [];

    // Use first company's periods as x-axis
    const periods = companies[0].history.map((h) => h.period);

    return periods.map((period) => {
      const point: Record<string, unknown> = { period };
      companies.forEach((company) => {
        const snapshot = company.history.find((h) => h.period === period);
        if (snapshot) {
          // Convert decimals to percentages for display (except workingCapitalDays)
          const val = snapshot[metric];
          point[company.id] =
            metric === "workingCapitalDays" ? (val ?? 0) : (val ?? 0) * 100;
        }
      });
      return point;
    });
  }, [companies, metric]);

  const lines = companies.map((company, index) => ({
    dataKey: company.id,
    colorVar: CHART_COLORS[index] ?? CHART_COLORS[0],
    label: company.name,
  }));

  return (
    <div className="space-y-xs">
      <span className="text-xs font-medium text-text-primary">{label}</span>
      <TrendLineChart
        data={chartData}
        lines={lines}
        xDataKey="period"
        height={200}
      />
    </div>
  );
}
