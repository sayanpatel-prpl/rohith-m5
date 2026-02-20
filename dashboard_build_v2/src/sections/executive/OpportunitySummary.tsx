/**
 * EXEC-02: A&M Opportunity Summary Card
 *
 * Prominent card at top of Executive section displaying:
 * 1. Total Advisory Opportunity (INR Cr)
 * 2. Companies in Distress Zone (count)
 * 3. Top Recommended Action (text)
 * Plus service line breakdown as pills with count badges.
 */

import { clsx } from "clsx";
import type { AMOpportunitySummary } from "@/types/executive";
import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import { DataValue } from "@/components/ui/DataValue";
import { formatINRAuto } from "@/lib/formatters";

interface OpportunitySummaryProps {
  summary: AMOpportunitySummary;
  className?: string;
}

export function OpportunitySummary({ summary, className }: OpportunitySummaryProps) {
  return (
    <div
      className={clsx(
        "bg-surface-raised rounded-lg p-lg",
        "border-l-4",
        className,
      )}
      style={{ borderLeftColor: "var(--color-brand-accent)" }}
    >
      <h3 className="text-sm font-semibold text-text-primary mb-md uppercase tracking-wide">
        A&M Advisory Opportunity
      </h3>

      {/* 3-column stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-md">
        {/* Total Advisory Opportunity */}
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide mb-1">
            Total Opportunity
          </span>
          <DataValue
            value={summary.totalAdvisoryOpportunityCr}
            formatter={formatINRAuto}
            tooltip="Advisory opportunity based on distressed market cap"
            className="text-2xl font-bold"
          />
        </div>

        {/* Companies in Distress */}
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide mb-1">
            Companies in Distress
          </span>
          <span className="text-2xl font-bold text-text-primary">
            {summary.companiesInDistress}
          </span>
        </div>

        {/* Top Recommended Action */}
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide mb-1">
            Top Action
          </span>
          <span className="text-sm font-medium text-text-primary leading-snug">
            {summary.topRecommendedAction || "-"}
          </span>
        </div>
      </div>

      {/* Service line breakdown */}
      {summary.serviceLineBreakdown.length > 0 && (
        <div className="pt-sm border-t border-border-default">
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide">
            Service Line Breakdown
          </span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {summary.serviceLineBreakdown.map((entry) => (
              <span key={entry.serviceLine} className="inline-flex items-center gap-1">
                <AMServiceLineTag serviceLine={entry.serviceLine} size="sm" />
                <span className="text-[10px] font-semibold text-text-secondary bg-surface-overlay rounded-full px-1.5 py-0.5 leading-none">
                  {entry.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
