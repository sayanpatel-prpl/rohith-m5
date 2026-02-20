/**
 * WTCH-01: Quadrant Card Container
 *
 * Renders a styled card for one watchlist quadrant.
 * Displays entries sorted by severity (highest first) with
 * a color-coded top border accent.
 */

import { clsx } from "clsx";
import type { WatchlistEntry as WatchlistEntryData } from "@/types/watchlist";
import { WatchlistEntryRow } from "./WatchlistEntry";
import { Badge } from "@/components/ui/Badge";

interface QuadrantCardProps {
  title: string;
  icon: string;
  entries: WatchlistEntryData[];
  accentColor: string;
  emptyMessage?: string;
}

export function QuadrantCard({
  title,
  icon,
  entries,
  accentColor,
  emptyMessage = "No signals detected",
}: QuadrantCardProps) {
  // Sort by severity descending
  const sorted = [...entries].sort((a, b) => b.severity - a.severity);

  return (
    <div
      className={clsx(
        "bg-surface-raised rounded-lg p-md min-h-[180px] flex flex-col",
        "border border-surface-overlay",
      )}
      style={{ borderTopWidth: "3px", borderTopColor: accentColor }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base" aria-hidden="true">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-text-primary flex-1">
          {title}
        </h3>
        <Badge variant="neutral" size="sm">
          {entries.length}
        </Badge>
      </div>

      {/* Body */}
      {sorted.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          {sorted.map((entry, idx) => (
            <WatchlistEntryRow
              key={`${entry.companyId}-${entry.signal}-${idx}`}
              entry={entry}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-text-muted italic">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
