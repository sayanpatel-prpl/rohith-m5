import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge";
import type { ConfidenceLevel } from "../../types/common";

const config: Record<ConfidenceLevel, BadgeVariant> = {
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

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  return <Badge variant={level} config={config} size="2xs" className={className} />;
}
