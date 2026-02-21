/**
 * OPER-01: Per-cell Confidence Icon
 *
 * Small inline indicator showing data confidence level next to numeric values.
 * - "verified": green checkmark -- directly from financial filings
 * - "derived": amber tilde -- calculated from multiple sources
 * - "estimated": muted question mark -- proxy or inferred value
 *
 * Uses native title attribute for hover tooltips (PoC quality).
 */

import type { ConfidenceIcon as ConfidenceIconType } from "@/types/operations";

interface ConfidenceIconProps {
  confidence: ConfidenceIconType;
}

const CONFIDENCE_MAP: Record<
  ConfidenceIconType,
  { char: string; className: string; tooltip: string }
> = {
  verified: {
    char: "\u2713",
    className: "text-[var(--color-positive)]",
    tooltip: "Verified: directly from financial filings",
  },
  derived: {
    char: "~",
    className: "text-[var(--color-warning)]",
    tooltip: "Derived: calculated from multiple sources",
  },
  estimated: {
    char: "?",
    className: "text-[var(--color-text-muted)]",
    tooltip: "Estimated: proxy or inferred value",
  },
};

export function ConfidenceIcon({ confidence }: ConfidenceIconProps) {
  const config = CONFIDENCE_MAP[confidence];

  return (
    <span
      className={`text-[10px] ml-0.5 cursor-help ${config.className}`}
      title={config.tooltip}
    >
      {config.char}
    </span>
  );
}
