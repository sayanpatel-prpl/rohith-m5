/**
 * SRCA-02: Source Tier Badge
 *
 * Renders a tier indicator with 4 distinct styles:
 * - T1: Solid green background, white text
 * - T2: Solid blue background, white text
 * - T3: Outline amber border, amber text
 * - T4: Outline red border, red text + warning icon
 */

import { clsx } from "clsx";
import type { SourceTier } from "@/types/source";

interface TierBadgeProps {
  tier: SourceTier;
  size?: "sm" | "md";
}

const TIER_STYLES: Record<
  SourceTier,
  { className: string; bgColor?: string; borderColor?: string; textColor?: string; label: string; icon?: string }
> = {
  1: {
    className: "text-white",
    bgColor: "var(--color-tier-1)",
    label: "T1",
  },
  2: {
    className: "text-white",
    bgColor: "var(--color-tier-2)",
    label: "T2",
  },
  3: {
    className: "",
    borderColor: "var(--color-tier-3)",
    textColor: "var(--color-tier-3)",
    label: "T3",
  },
  4: {
    className: "",
    borderColor: "var(--color-tier-4)",
    textColor: "var(--color-tier-4)",
    label: "T4",
    icon: "\u26A0", // warning triangle
  },
};

export function TierBadge({ tier, size = "sm" }: TierBadgeProps) {
  const style = TIER_STYLES[tier];

  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  // T1 and T2 use solid backgrounds; T3 and T4 use outline borders
  const isSolid = tier <= 2;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-0.5 rounded font-semibold leading-none whitespace-nowrap",
        sizeClasses,
        style.className,
        !isSolid && "border",
      )}
      style={{
        ...(isSolid
          ? { backgroundColor: style.bgColor }
          : {
              borderColor: style.borderColor,
              color: style.textColor,
            }),
      }}
    >
      {style.icon && <span className="text-[9px]">{style.icon}</span>}
      {style.label}
    </span>
  );
}
