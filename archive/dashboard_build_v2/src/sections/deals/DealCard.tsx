/**
 * DEAL-01: Deal Card
 *
 * Renders a single deal/transaction entry with:
 * - DealTypeBadge and AMAngleBadge in the header row
 * - Deal description
 * - A&M angle rationale callout
 * - Source attribution footer
 */

import { clsx } from "clsx";
import type { DealEntry } from "@/types/deals";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import { formatINRAuto } from "@/lib/formatters";
import { AMAngleBadge } from "./AMAngleBadge";
import { DealTypeBadge } from "./DealTypeBadge";

interface DealCardProps {
  deal: DealEntry;
  className?: string;
}

export function DealCard({ deal, className }: DealCardProps) {
  return (
    <div
      className={clsx(
        "rounded border border-border-default bg-surface-raised p-3 space-y-2",
        className,
      )}
    >
      {/* Header: badges + date */}
      <div className="flex items-center gap-xs flex-wrap">
        <DealTypeBadge dealType={deal.dealType} label={deal.dealTypeLabel} />
        <AMAngleBadge angle={deal.amAngle} />
        <span className="ml-auto text-[10px] text-text-muted whitespace-nowrap">
          {deal.date}
        </span>
      </div>

      {/* Company name + value */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-text-primary">
          {deal.companyName}
        </span>
        {deal.valueCr !== null && deal.valueCr > 0 && (
          <span className="text-xs font-medium text-text-secondary whitespace-nowrap">
            {formatINRAuto(deal.valueCr)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
        {deal.description}
      </p>

      {/* A&M Angle Rationale */}
      {deal.amAngleRationale && (
        <p className="text-[10px] text-text-secondary italic leading-relaxed">
          <span className="font-medium not-italic">A&M:</span>{" "}
          {deal.amAngleRationale}
        </p>
      )}

      {/* Source Attribution */}
      <SourceAttribution source={deal.source} compact />
    </div>
  );
}
