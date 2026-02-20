/**
 * SRCA-01, SRCA-03: Source Attribution Component
 *
 * Reusable source attribution display showing source name,
 * confidence level, last updated date, and tier badge.
 * Placed on every card, chart, and table per SRCA-03.
 */

import { clsx } from "clsx";
import type { SourceInfo, SourceConfidence } from "@/types/source";
import { TierBadge } from "./TierBadge";
import { formatDate } from "@/lib/formatters";

interface SourceAttributionProps {
  source: SourceInfo;
  compact?: boolean;
  className?: string;
}

/** Unicode icons for confidence levels */
const CONFIDENCE_ICONS: Record<SourceConfidence, { icon: string; label: string }> = {
  verified: { icon: "\u2713", label: "Verified" },     // checkmark
  derived: { icon: "\u2248", label: "Derived" },        // approximately equal
  estimated: { icon: "\u007E", label: "Estimated" },    // tilde
};

export function SourceAttribution({ source, compact = false, className }: SourceAttributionProps) {
  const confidence = CONFIDENCE_ICONS[source.confidence];

  if (compact) {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1 text-[10px] text-text-muted",
          className,
        )}
      >
        <TierBadge tier={source.tier} size="sm" />
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {source.source}
          </a>
        ) : (
          <span>{source.source}</span>
        )}
      </span>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-2 text-xs text-text-muted py-1 px-2 rounded bg-surface-raised/50",
        className,
      )}
    >
      <TierBadge tier={source.tier} size="sm" />

      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium"
        >
          {source.source}
        </a>
      ) : (
        <span className="font-medium">{source.source}</span>
      )}

      <span
        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-overlay text-[10px]"
        title={confidence.label}
      >
        <span>{confidence.icon}</span>
        <span>{confidence.label}</span>
      </span>

      <span className="ml-auto text-[10px]">
        {formatDate(source.lastUpdated)}
      </span>
    </div>
  );
}
