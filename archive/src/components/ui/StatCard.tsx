import clsx from "clsx";
import { TrendIndicator } from "./TrendIndicator";
import type { TrendDirection } from "../../types/common";

interface StatCardProps {
  /** Metric label (e.g. "Revenue Growth YoY") */
  label: string;
  /** Pre-formatted value string (e.g. "INR 1,500 Cr") */
  value: string;
  /** Optional trend indicator with label */
  trend?: {
    direction: TrendDirection;
    label: string;
  };
  /** Optional subtitle text below the value */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        "bg-surface-raised border border-surface-overlay rounded p-md",
        className,
      )}
    >
      <p className="text-text-muted text-xs truncate">{label}</p>
      <p className="text-text-primary text-lg font-semibold mt-xs">{value}</p>
      {trend && (
        <div className="flex items-center gap-xs mt-xs">
          <TrendIndicator direction={trend.direction} size="sm" />
          <span className="text-text-secondary text-xs">{trend.label}</span>
        </div>
      )}
      {subtitle && (
        <p className="text-text-muted text-xs mt-xs">{subtitle}</p>
      )}
    </div>
  );
}
