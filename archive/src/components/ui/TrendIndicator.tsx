import clsx from "clsx";
import type { TrendDirection } from "../../types/common";

interface TrendIndicatorProps {
  direction: TrendDirection;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const ARROWS: Record<TrendDirection, string> = {
  up: "\u25B2",   // triangle up
  down: "\u25BC", // triangle down
  flat: "\u25C6", // diamond
};

const LABELS: Record<TrendDirection, string> = {
  up: "Up",
  down: "Down",
  flat: "Flat",
};

const COLOR_CLASSES: Record<TrendDirection, string> = {
  up: "text-positive",
  down: "text-negative",
  flat: "text-neutral",
};

export function TrendIndicator({
  direction,
  size = "sm",
  showLabel = false,
}: TrendIndicatorProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-xs",
        COLOR_CLASSES[direction],
        size === "sm" ? "text-[10px]" : "text-xs",
      )}
      aria-label={`Trend: ${LABELS[direction]}`}
    >
      <span>{ARROWS[direction]}</span>
      {showLabel && <span>{LABELS[direction]}</span>}
    </span>
  );
}
