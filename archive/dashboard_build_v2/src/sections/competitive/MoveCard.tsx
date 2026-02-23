/**
 * COMP-01: Move Card
 *
 * Renders a single competitive move entry with:
 * - Company name + MoveType badge (colored pill)
 * - Description text
 * - Date + source attribution
 * - Operational implication badge if applicable (COMP-03)
 */

import type { CompetitiveMove, MoveType } from "@/types/competitive";
import { SourceAttribution } from "@/components/source/SourceAttribution";

interface MoveCardProps {
  move: CompetitiveMove;
}

/** Badge color mapping per move type using CSS custom properties */
const MOVE_TYPE_COLORS: Record<MoveType, string> = {
  "capacity-expansion": "var(--color-brand-primary)",
  acquisition: "var(--color-am-transaction)",
  technology: "var(--color-am-improvement)",
  "new-product": "var(--color-positive)",
  geographic: "var(--color-info, #3b82f6)",
  partnership: "var(--color-am-neutral)",
  pricing: "var(--color-warning)",
  other: "var(--color-text-muted)",
};

/** Returns inline style for move type badge */
function badgeStyle(moveType: MoveType): React.CSSProperties {
  const color = MOVE_TYPE_COLORS[moveType];
  return {
    color,
    backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
    borderColor: `color-mix(in oklch, ${color} 30%, transparent)`,
  };
}

export function MoveCard({ move }: MoveCardProps) {
  return (
    <div className="bg-surface-raised border border-border-default rounded p-sm space-y-1.5">
      {/* Header: company name + badge */}
      <div className="flex items-center gap-xs flex-wrap">
        <span className="text-xs font-semibold text-text-primary">
          {move.company}
        </span>
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border"
          style={badgeStyle(move.moveType)}
        >
          {move.moveTypeLabel}
        </span>
        <span className="ml-auto text-[10px] text-text-muted whitespace-nowrap">
          {move.date}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
        {move.description}
      </p>

      {/* Operational implication badge (COMP-03) */}
      {move.hasOperationalImplication && (
        <div className="flex items-start gap-1">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
            style={{ color: "var(--color-warning)" }}
          >
            Ops Link
          </span>
          {move.operationalImplication && (
            <p className="text-[10px] italic text-text-secondary leading-relaxed">
              {move.operationalImplication}
            </p>
          )}
        </div>
      )}

      {/* Source attribution */}
      <SourceAttribution source={move.source} compact />
    </div>
  );
}
