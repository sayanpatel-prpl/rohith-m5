import clsx from "clsx";
import type { ConfidenceLevel } from "../../types/common";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

const config: Record<ConfidenceLevel, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-positive/10 text-positive border-positive/20",
  },
  medium: {
    label: "Medium",
    className: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  },
  low: {
    label: "Low",
    className: "bg-neutral/10 text-neutral border-neutral/20",
  },
};

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  const { label, className: levelClassName } = config[level];
  return (
    <span
      className={clsx(
        "inline-flex items-center px-sm py-xs rounded border text-[10px] font-medium whitespace-nowrap",
        levelClassName,
        className,
      )}
    >
      {label}
    </span>
  );
}
