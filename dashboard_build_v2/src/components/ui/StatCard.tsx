/**
 * StatCard: Card displaying a single metric with optional trend.
 *
 * Used for KPI displays across all dashboard sections.
 * Optionally renders source attribution in compact mode (SRCA-03).
 */

import { clsx } from "clsx";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { SourceInfo } from "@/types/source";

interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "flat";
  };
  source?: SourceInfo;
  className?: string;
}

const TREND_STYLES: Record<string, { icon: string; className: string }> = {
  up: { icon: "\u25B2", className: "text-positive" },
  down: { icon: "\u25BC", className: "text-negative" },
  flat: { icon: "\u25C6", className: "text-text-muted" },
};

export function StatCard({ label, value, trend, source, className }: StatCardProps) {
  const trendStyle = trend ? TREND_STYLES[trend.direction] : null;

  return (
    <div
      className={clsx(
        "bg-surface-raised rounded-lg p-4 flex flex-col gap-1",
        className,
      )}
    >
      <span className="text-text-muted text-xs font-medium uppercase tracking-wide">
        {label}
      </span>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-text-primary">{value}</span>
        {trend && trendStyle && (
          <span className={clsx("text-xs font-medium flex items-center gap-0.5", trendStyle.className)}>
            <span className="text-[10px]">{trendStyle.icon}</span>
            {trend.value > 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
        )}
      </div>

      {source && (
        <div className="mt-auto pt-2">
          <SourceAttribution source={source} compact />
        </div>
      )}
    </div>
  );
}
