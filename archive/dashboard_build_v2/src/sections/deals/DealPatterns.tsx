/**
 * DEAL-02: Deal Pattern Intelligence
 *
 * Renders a summary card showing AI-detected patterns across deal activity.
 * Positioned above the deal timeline as the "key insights" summary.
 * Shows pattern name, confidence level, explanation, and supporting deal count.
 */

import { clsx } from "clsx";
import type { DealPattern } from "@/types/deals";
import { Badge } from "@/components/ui/Badge";

interface DealPatternsProps {
  patterns: DealPattern[];
  className?: string;
}

/** Map confidence level to badge variant */
const CONFIDENCE_VARIANT: Record<string, "success" | "warning" | "info"> = {
  verified: "success",
  derived: "info",
  estimated: "warning",
};

export function DealPatterns({ patterns, className }: DealPatternsProps) {
  return (
    <div
      className={clsx(
        "bg-surface-raised border border-surface-overlay rounded-lg p-md",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-sm">
        <h3 className="text-sm font-semibold text-text-primary">
          Deal Pattern Intelligence
        </h3>
        <span className="text-[10px] text-text-muted font-medium bg-surface-overlay rounded-full px-2 py-0.5">
          {patterns.length} {patterns.length === 1 ? "pattern" : "patterns"} detected
        </span>
      </div>

      {patterns.length === 0 ? (
        <p className="text-sm text-text-muted italic">
          No significant deal patterns detected in current period.
        </p>
      ) : (
        <div className="space-y-3">
          {patterns.map((pattern, i) => (
            <div
              key={i}
              className="p-3 rounded border border-border-default bg-surface-default space-y-1.5"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-text-primary">
                  {pattern.pattern}
                </span>
                <Badge
                  variant={CONFIDENCE_VARIANT[pattern.confidence] ?? "info"}
                  size="sm"
                >
                  {pattern.confidence}
                </Badge>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {pattern.explanation}
              </p>

              <span className="text-[10px] text-text-muted">
                Based on {pattern.supportingDealIds.length}{" "}
                {pattern.supportingDealIds.length === 1 ? "deal" : "deals"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
