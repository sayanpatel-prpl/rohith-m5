import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge";
import type { PerformanceLevel } from "../../types/common";

const config: Record<PerformanceLevel, BadgeVariant> = {
  outperform: {
    label: "Outperform",
    icon: "\u25B2",
    className: "bg-positive/10 text-positive border-positive/20",
  },
  inline: {
    label: "Inline",
    icon: "\u25C6",
    className: "bg-neutral/10 text-neutral border-neutral/20",
  },
  underperform: {
    label: "Underperform",
    icon: "\u25BC",
    className: "bg-negative/10 text-negative border-negative/20",
  },
};

interface PerformanceTagProps {
  level: PerformanceLevel;
  compact?: boolean;
}

export function PerformanceTag({ level, compact }: PerformanceTagProps) {
  return (
    <Badge
      variant={level}
      config={config}
      compact={compact}
      compactMode="icon-only"
      size="xs"
    />
  );
}
