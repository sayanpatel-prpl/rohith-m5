/**
 * DEAL-01: A&M Angle Badge
 *
 * Renders a color-coded pill badge for the A&M advisory angle
 * assigned to each deal. Uses color-mix for theme-consistent tints.
 *
 * 5 angles: CDD Opportunity, Integration Support, Carve-out Advisory,
 * Valuation, Restructuring.
 */

import { clsx } from "clsx";
import type { AMAngle } from "@/types/deals";

interface AMAngleBadgeProps {
  angle: AMAngle;
  size?: "sm" | "md";
  className?: string;
}

/** Color and label config for each A&M angle */
const ANGLE_CONFIG: Record<
  AMAngle,
  { label: string; color: string }
> = {
  "CDD Opportunity": {
    label: "CDD",
    color: "var(--color-chart-2)",
  },
  "Integration Support": {
    label: "Integration",
    color: "var(--color-chart-1)",
  },
  "Carve-out Advisory": {
    label: "Carve-out",
    color: "var(--color-chart-3)",
  },
  Valuation: {
    label: "Valuation",
    color: "var(--color-chart-4)",
  },
  Restructuring: {
    label: "Restructuring",
    color: "var(--color-negative)",
  },
};

export function AMAngleBadge({
  angle,
  size = "sm",
  className,
}: AMAngleBadgeProps) {
  const config = ANGLE_CONFIG[angle];
  const sizeClasses =
    size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap",
        sizeClasses,
        className,
      )}
      style={{
        color: config.color,
        backgroundColor: `color-mix(in oklch, ${config.color} 10%, transparent)`,
        borderWidth: "1px",
        borderColor: `color-mix(in oklch, ${config.color} 20%, transparent)`,
      }}
      title={angle}
    >
      {config.label}
    </span>
  );
}
