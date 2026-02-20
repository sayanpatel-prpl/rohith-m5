/**
 * AMTH-02: A&M Service Line Tag
 *
 * Renders a pill/badge with the service line label, color-coded
 * by service line category using A&M action-type colors.
 */

import { clsx } from "clsx";
import type { AMServiceLine } from "@/types/am-theme";
import { AM_SERVICE_LINE_LABELS } from "@/types/am-theme";

interface AMServiceLineTagProps {
  serviceLine: AMServiceLine;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Maps each service line to its A&M color CSS variable.
 * - CPI, Operations -> improvement (amber-gold)
 * - Restructuring -> turnaround (red-orange)
 * - Transaction Advisory, PE Services -> transaction (green)
 * - Digital -> neutral (slate-blue)
 */
const SERVICE_LINE_COLORS: Record<AMServiceLine, string> = {
  CPI: "var(--color-am-improvement)",
  Operations: "var(--color-am-improvement)",
  Restructuring: "var(--color-am-turnaround)",
  "Transaction Advisory": "var(--color-am-transaction)",
  "PE Services": "var(--color-am-transaction)",
  Digital: "var(--color-am-neutral)",
};

export function AMServiceLineTag({ serviceLine, size = "sm", className }: AMServiceLineTagProps) {
  const color = SERVICE_LINE_COLORS[serviceLine];
  const label = AM_SERVICE_LINE_LABELS[serviceLine];

  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap",
        sizeClasses,
        className,
      )}
      style={{
        color,
        backgroundColor: `color-mix(in oklch, ${color} 10%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}
