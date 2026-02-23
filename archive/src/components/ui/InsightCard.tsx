import clsx from "clsx";
import { ConfidenceBadge } from "./ConfidenceBadge";
import type { ConfidenceLevel } from "../../types/common";

interface InsightCardProps {
  icon?: string;
  title: string;
  confidence: ConfidenceLevel;
  explanation: string;
  variant?: "pattern" | "risk" | "opportunity";
  className?: string;
}

const variantBorder: Record<
  NonNullable<InsightCardProps["variant"]>,
  string
> = {
  pattern: "border-l-chart-1",
  risk: "border-l-negative",
  opportunity: "border-l-positive",
};

export function InsightCard({
  icon,
  title,
  confidence,
  explanation,
  variant = "pattern",
  className,
}: InsightCardProps) {
  return (
    <div
      className={clsx(
        "bg-surface-raised border border-surface-overlay rounded p-md border-l-2",
        variantBorder[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-sm">
        <div className="flex items-center gap-xs min-w-0">
          {icon && <span className="text-xs shrink-0">{icon}</span>}
          <h4 className="text-xs font-medium text-text-primary truncate">
            {title}
          </h4>
        </div>
        <ConfidenceBadge level={confidence} />
      </div>
      <p className="text-xs text-text-secondary leading-relaxed mt-xs">
        {explanation}
      </p>
    </div>
  );
}
