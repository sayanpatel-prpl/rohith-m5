/**
 * LEAD-03: Promoter Holdings with A&M Service Line Implications
 *
 * Displays per-company promoter holding trends with QoQ change indicators
 * and A&M service line opportunity annotations. Includes a mini sparkline
 * chart for promoter holding history using BaseChart.
 */

import { useState } from "react";
import { BaseChart } from "@/components/charts/BaseChart";
import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { PromoterHoldingEntry } from "@/types/leadership";

interface PromoterHoldingsProps {
  holdings: PromoterHoldingEntry[];
}

/** Format percentage change with explicit sign */
function formatChange(value: number): string {
  if (value === 0) return "0.0pp";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}pp`;
}

/** Build ECharts option for a mini promoter holding chart */
function buildChartOption(entry: PromoterHoldingEntry) {
  const periods = entry.history.map((h) => h.period);
  const promoterData = entry.history.map((h) => h.promoterPct);
  const fiiData = entry.history.map((h) => h.fiiPct);
  const diiData = entry.history.map((h) => h.diiPct);

  return {
    tooltip: {
      trigger: "axis" as const,
      textStyle: { fontSize: 10 },
      formatter: (params: Array<{ seriesName: string; value: number; marker: string }>) => {
        if (!Array.isArray(params) || params.length === 0) return "";
        const header = (params[0] as { axisValue?: string }).axisValue ?? "";
        const lines = params.map(
          (p: { marker: string; seriesName: string; value: number }) =>
            `${p.marker} ${p.seriesName}: ${p.value?.toFixed(1) ?? "-"}%`,
        );
        return `<strong>${header}</strong><br/>${lines.join("<br/>")}`;
      },
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: { fontSize: 9 },
      itemWidth: 10,
      itemHeight: 6,
    },
    grid: {
      top: 10,
      right: 10,
      bottom: 30,
      left: 35,
      containLabel: false,
    },
    xAxis: {
      type: "category" as const,
      data: periods,
      axisLabel: { fontSize: 8, rotate: 45 },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value" as const,
      axisLabel: { fontSize: 8, formatter: "{value}%" },
      splitLine: { lineStyle: { type: "dashed" as const, opacity: 0.3 } },
    },
    series: [
      {
        name: "Promoter",
        type: "bar" as const,
        data: promoterData,
        itemStyle: { color: "var(--color-chart-1)" },
        barMaxWidth: 12,
      },
      {
        name: "FII",
        type: "bar" as const,
        data: fiiData,
        itemStyle: { color: "var(--color-chart-2)" },
        barMaxWidth: 12,
      },
      {
        name: "DII",
        type: "bar" as const,
        data: diiData,
        itemStyle: { color: "var(--color-chart-3)" },
        barMaxWidth: 12,
      },
    ],
  };
}

export function PromoterHoldings({ holdings }: PromoterHoldingsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (holdings.length === 0) return null;

  return (
    <div className="space-y-sm">
      <div>
        <h3 className="text-xs font-semibold text-text-primary">
          Promoter Holding Trends
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          QoQ promoter stake changes with A&M service line implications. Click to expand shareholding chart.
        </p>
      </div>

      <div className="space-y-1">
        {holdings.map((entry) => {
          const isExpanded = expandedId === entry.companyId;
          const changeColor =
            entry.changeQoQ < -2
              ? "text-[var(--color-negative)]"
              : entry.changeQoQ < 0
                ? "text-[var(--color-brand-accent)]"
                : entry.changeQoQ > 0
                  ? "text-[var(--color-positive)]"
                  : "text-text-secondary";

          return (
            <div
              key={entry.companyId}
              className="bg-surface-raised border border-surface-overlay rounded overflow-hidden"
            >
              {/* Clickable header row */}
              <button
                type="button"
                onClick={() =>
                  setExpandedId(isExpanded ? null : entry.companyId)
                }
                className="w-full flex items-center gap-sm p-sm text-left hover:bg-surface-overlay/30 transition-colors"
              >
                {/* Company name */}
                <span className="text-xs font-medium text-text-primary min-w-[140px] truncate">
                  {entry.company}
                </span>

                {/* Promoter % */}
                <span className="text-xs text-text-secondary tabular-nums">
                  {entry.latestPromoterPct.toFixed(1)}%
                </span>

                {/* QoQ change */}
                <span className={`text-xs font-medium tabular-nums ${changeColor}`}>
                  {formatChange(entry.changeQoQ)}
                </span>

                {/* A&M tag */}
                <span className="ml-auto">
                  <AMServiceLineTag serviceLine={entry.amServiceLine} size="sm" />
                </span>

                {/* Expand chevron */}
                <span className="text-text-muted text-xs shrink-0">
                  {isExpanded ? "\u25B2" : "\u25BC"}
                </span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-sm pb-sm space-y-sm border-t border-surface-overlay">
                  {/* A&M implication */}
                  <div className="pt-sm">
                    <p className="text-[10px] font-medium text-text-secondary">
                      A&M Opportunity
                    </p>
                    <p
                      className={`text-xs font-medium mt-0.5 ${
                        entry.changeQoQ < 0
                          ? "text-[var(--color-negative)]"
                          : "text-[var(--color-positive)]"
                      }`}
                    >
                      {entry.amServiceLineImplication}
                    </p>
                  </div>

                  {/* Shareholding bar chart */}
                  <BaseChart
                    option={buildChartOption(entry)}
                    height={180}
                    source={entry.source}
                  />

                  {/* Source attribution */}
                  <SourceAttribution source={entry.source} compact />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
