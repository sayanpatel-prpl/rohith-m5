/**
 * Input Cost Trends component for Market Pulse section.
 *
 * MRKT-02: Displays commodity/input cost trends with A&M implication
 * column for each commodity. Shows trend direction, QoQ/YoY changes,
 * and data confidence badges.
 */

import { clsx } from "clsx";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { InputCostEntry, DataConfidence } from "@/types/market-pulse";
import type { CommodityOutlook } from "@/types/market-pulse";

interface InputCostTrendsProps {
  inputCosts: InputCostEntry[];
  commodityOutlook: CommodityOutlook | null;
}

const TREND_INDICATOR: Record<string, { symbol: string; color: string; label: string }> = {
  rising: { symbol: "\u25B2", color: "text-negative", label: "Rising" },
  falling: { symbol: "\u25BC", color: "text-positive", label: "Falling" },
  stable: { symbol: "\u25C6", color: "text-brand-accent", label: "Stable" },
};

const CONFIDENCE_STYLES: Record<
  DataConfidence,
  { bg: string; text: string; border: string; label: string }
> = {
  Verified: {
    bg: "bg-positive/10",
    text: "text-positive",
    border: "border-positive/20",
    label: "Verified",
  },
  "Management Guidance Interpretation": {
    bg: "bg-brand-accent/10",
    text: "text-brand-accent",
    border: "border-brand-accent/20",
    label: "Mgmt Guidance",
  },
  Estimated: {
    bg: "bg-negative/10",
    text: "text-negative",
    border: "border-negative/20",
    label: "Estimated",
  },
};

export function InputCostTrends({ inputCosts, commodityOutlook }: InputCostTrendsProps) {
  if (inputCosts.length === 0) {
    return null;
  }

  return (
    <div className="rounded border border-border-default bg-surface-raised p-md">
      <div className="flex items-center justify-between mb-sm">
        <h3 className="text-sm font-semibold text-text-primary">
          Input Cost Trends
        </h3>
        {commodityOutlook && (
          <span
            className={clsx(
              "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
              commodityOutlook.outlook === "Favorable"
                ? "bg-positive/10 text-positive"
                : commodityOutlook.outlook === "Cautious"
                  ? "bg-negative/10 text-negative"
                  : "bg-brand-accent/10 text-brand-accent",
            )}
          >
            Outlook: {commodityOutlook.outlook}
          </span>
        )}
      </div>

      {commodityOutlook && (
        <p className="text-xs text-text-secondary mb-sm">
          {commodityOutlook.detail}
        </p>
      )}

      {/* Commodity cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
        {inputCosts.map((cost, i) => {
          const trend = TREND_INDICATOR[cost.trend] ?? TREND_INDICATOR.stable;
          const confidence = CONFIDENCE_STYLES[cost.dataConfidence];

          return (
            <div
              key={`${cost.commodity}-${i}`}
              className="rounded border border-surface-overlay bg-surface-default p-sm space-y-xs"
            >
              {/* Commodity header with trend */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">
                  {cost.commodity}
                </span>
                <span
                  className={clsx(
                    "inline-flex items-center gap-0.5 text-[10px] font-medium",
                    trend.color,
                  )}
                >
                  <span>{trend.symbol}</span>
                  <span>{trend.label}</span>
                </span>
              </div>

              {/* QoQ / YoY changes */}
              <div className="space-y-0.5">
                <p className="text-[11px] text-text-secondary">
                  <span className="font-medium text-text-primary">QoQ:</span>{" "}
                  {cost.qoqChange}
                </p>
                <p className="text-[11px] text-text-secondary">
                  <span className="font-medium text-text-primary">YoY:</span>{" "}
                  {cost.yoyChange}
                </p>
              </div>

              {/* Confidence badge */}
              <span
                className={clsx(
                  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
                  confidence.bg,
                  confidence.text,
                  confidence.border,
                )}
              >
                {confidence.label}
              </span>

              {/* A&M Implication (MRKT-02) */}
              <div className="pt-xs border-t border-surface-overlay">
                <p className="text-xs text-text-secondary italic line-clamp-2">
                  <span className="font-medium not-italic text-text-primary">A&M:</span>{" "}
                  {cost.amImplication}
                </p>
              </div>

              {/* Source */}
              <SourceAttribution source={cost.source} compact className="mt-xs" />
            </div>
          );
        })}
      </div>

      {commodityOutlook && (
        <div className="mt-xs">
          <SourceAttribution source={commodityOutlook.source} compact />
        </div>
      )}
    </div>
  );
}
