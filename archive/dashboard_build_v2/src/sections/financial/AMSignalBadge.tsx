/**
 * FINP-01: A&M Signal Triage Badge
 *
 * Renders a small colored pill indicating the A&M engagement type:
 * - Turnaround (red) -- severe distress
 * - CPI / Improvement (amber) -- performance improvement opportunity
 * - TA / Transaction (green) -- transaction advisory / acquisition candidate
 * - Neutral (slate) -- monitor
 *
 * Uses color-mix for background tint (same pattern as AMServiceLineTag).
 * Hover/title shows the reason explaining the classification.
 */

import { clsx } from "clsx";
import type { AMActionType } from "@/types/am-theme";
import { AM_ACTION_COLORS } from "@/types/am-theme";

interface AMSignalBadgeProps {
  /** A&M triage classification */
  signal: AMActionType;
  /** Human-readable explanation for the classification (shown on hover) */
  reason: string;
  className?: string;
}

/** Display labels for each signal type */
const SIGNAL_LABELS: Record<AMActionType, { short: string; full: string }> = {
  turnaround: { short: "T", full: "Turnaround" },
  improvement: { short: "CPI", full: "Corporate Performance Improvement" },
  transaction: { short: "TA", full: "Transaction Advisory" },
  neutral: { short: "-", full: "Neutral" },
};

export function AMSignalBadge({ signal, reason, className }: AMSignalBadgeProps) {
  const color = AM_ACTION_COLORS[signal];
  const label = SIGNAL_LABELS[signal];

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-semibold leading-none whitespace-nowrap",
        "text-[10px] px-1.5 py-0.5 min-w-[28px]",
        className,
      )}
      style={{
        color,
        backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
      }}
      title={`${label.full}: ${reason}`}
    >
      {label.short}
    </span>
  );
}
