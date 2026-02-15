import clsx from "clsx";
import type { PerformanceLevel } from "../../types/common";

interface PerformanceTagProps {
  level: PerformanceLevel;
  compact?: boolean;
}

const config: Record<
  PerformanceLevel,
  { label: string; arrow: string; className: string }
> = {
  outperform: {
    label: "Outperform",
    arrow: "\u25B2", // triangle up
    className: "bg-positive/10 text-positive border-positive/20",
  },
  inline: {
    label: "Inline",
    arrow: "\u25C6", // diamond
    className: "bg-neutral/10 text-neutral border-neutral/20",
  },
  underperform: {
    label: "Underperform",
    arrow: "\u25BC", // triangle down
    className: "bg-negative/10 text-negative border-negative/20",
  },
};

export function PerformanceTag({ level, compact }: PerformanceTagProps) {
  const { label, arrow, className } = config[level];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-xs rounded border px-sm py-xs text-xs font-medium whitespace-nowrap",
        className,
      )}
    >
      <span className="text-[10px]">{arrow}</span>
      {!compact && <span>{label}</span>}
    </span>
  );
}
