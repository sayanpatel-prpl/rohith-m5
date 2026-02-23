/**
 * WTCH-02: Watchlist Entry Component
 *
 * Renders a single watchlist entry row with company info, severity indicator,
 * days-to-event badge, A&M service line tag, and source attribution.
 */

import { clsx } from "clsx";
import type { WatchlistEntry as WatchlistEntryData } from "@/types/watchlist";
import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import { SourceAttribution } from "@/components/source/SourceAttribution";

interface WatchlistEntryProps {
  entry: WatchlistEntryData;
}

/** Severity dot color based on level */
function severityColor(level: number, index: number): string {
  const filled = index < level;
  if (!filled) return "bg-surface-overlay";
  if (level >= 4) return "bg-[var(--color-negative)]";
  if (level >= 2) return "bg-[var(--color-am-improvement)]";
  return "bg-[var(--color-text-muted)]";
}

export function WatchlistEntryRow({ entry }: WatchlistEntryProps) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-surface-overlay last:border-b-0">
      {/* Left section: company name + signal */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">
          {entry.companyName}
        </p>
        <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">
          {entry.signal}
        </p>
        <p className="text-xs text-text-muted mt-1 line-clamp-2">
          {entry.detail}
        </p>
      </div>

      {/* Middle section: severity + days */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
        {/* Severity dots */}
        <div className="inline-flex items-center gap-1" title={`Severity: ${entry.severity}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                "w-2 h-2 rounded-full",
                severityColor(entry.severity, i),
              )}
            />
          ))}
        </div>
        {/* Days to event badge */}
        {entry.daysToEvent !== null && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-surface-overlay text-text-secondary whitespace-nowrap">
            {entry.daysToEvent}d
          </span>
        )}
      </div>

      {/* Right section: service line + source */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <AMServiceLineTag serviceLine={entry.serviceLine} size="sm" />
        <SourceAttribution source={entry.source} compact />
      </div>
    </div>
  );
}
