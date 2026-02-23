import { TrendLineChart } from "../../components/charts/TrendLineChart";
import { ChartLegend } from "../../components/charts/ChartLegend";
import { TrendIndicator } from "../../components/ui/TrendIndicator";
import { formatGrowthRate } from "../../lib/formatters";
import type { MarketPulseData } from "../../types/sections";

interface InputCostTrendsProps {
  costs: MarketPulseData["inputCosts"];
  history?: MarketPulseData["inputCostHistory"];
}

const LINES_CONFIG = [
  { dataKey: "steel", colorVar: "--color-chart-1", label: "Steel (HR Coil)" },
  { dataKey: "copper", colorVar: "--color-chart-2", label: "Copper (LME)" },
  { dataKey: "plastics", colorVar: "--color-chart-3", label: "Plastics (ABS)" },
  { dataKey: "aluminium", colorVar: "--color-chart-4", label: "Aluminium (LME)" },
];

export function InputCostTrends({ costs, history }: InputCostTrendsProps) {
  const hasHistory = history && history.length > 0;

  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-sm">
        Input Cost Trends
      </h3>

      {hasHistory && (
        <>
          <TrendLineChart
            data={history}
            lines={LINES_CONFIG}
            xDataKey="period"
            height={200}
          />
          <ChartLegend
            payload={LINES_CONFIG.map((line) => ({
              value: line.label,
              color: `var(${line.colorVar})`,
            }))}
          />
        </>
      )}

      <div className={`grid grid-cols-2 gap-sm ${hasHistory ? "mt-md" : ""}`}>
        {costs.map((cost) => (
          <div
            key={cost.commodity}
            className="flex flex-col gap-xs p-sm bg-surface border border-surface-overlay rounded"
          >
            <div className="flex items-center gap-xs">
              <TrendIndicator direction={cost.trend} size="sm" />
              <span className="text-xs font-medium text-text-primary truncate">
                {cost.commodity}
              </span>
            </div>
            <div className="flex gap-md text-xs text-text-secondary">
              <span>{formatGrowthRate(cost.qoqChange, "QoQ")}</span>
              <span>{formatGrowthRate(cost.yoyChange, "YoY")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
