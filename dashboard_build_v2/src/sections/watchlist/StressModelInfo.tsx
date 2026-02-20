/**
 * WTCH-03: Stress Model Info Panel
 *
 * Expandable/collapsible panel explaining the stress scoring model
 * and its threshold definitions. Default: collapsed.
 */

import { useState } from "react";
import { clsx } from "clsx";
import type { StressModel } from "@/types/watchlist";

interface StressModelInfoProps {
  model: StressModel;
}

export function StressModelInfo({ model }: StressModelInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const { thresholds } = model;

  return (
    <div className="text-xs bg-surface border border-surface-overlay rounded p-sm">
      <button
        type="button"
        className="flex items-center gap-2 w-full text-left font-medium text-text-secondary hover:text-text-primary transition-colors"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <span
          className={clsx(
            "inline-block transition-transform duration-200",
            expanded && "rotate-90",
          )}
          aria-hidden="true"
        >
          {/* Chevron right arrow */}
          {"\u25B6"}
        </span>
        <span>Stress Scoring Model</span>
      </button>

      {expanded && (
        <ul className="mt-2 ml-5 space-y-1.5 text-text-secondary">
          <li>
            <span className="font-medium text-text-primary">Cash burn:</span>{" "}
            {thresholds.cashBurnQuarters}+ consecutive periods of negative
            operating cash flow
          </li>
          <li>
            <span className="font-medium text-text-primary">
              Debt maturity risk:
            </span>{" "}
            Borrowings growing with operating cash {"<"} interest coverage for{" "}
            {thresholds.debtMaturityMonths} months
          </li>
          <li>
            <span className="font-medium text-text-primary">
              Revenue decline:
            </span>{" "}
            {thresholds.revenueDeclineQuarters}+ consecutive quarters of YoY
            revenue decline
          </li>
          <li>
            <span className="font-medium text-text-primary">
              EBITDA% threshold:
            </span>{" "}
            Below P25 sector ({thresholds.ebitdaMarginP25.toFixed(1)}%)
          </li>
        </ul>
      )}
    </div>
  );
}
