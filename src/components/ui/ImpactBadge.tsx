import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge";

const config: Record<"positive" | "negative" | "neutral", BadgeVariant> = {
  positive: {
    label: "Positive",
    className: "bg-positive/10 text-positive border-positive/20",
  },
  negative: {
    label: "Negative",
    className: "bg-negative/10 text-negative border-negative/20",
  },
  neutral: {
    label: "Neutral",
    className: "bg-neutral/10 text-neutral border-neutral/20",
  },
};

interface ImpactBadgeProps {
  impact: "positive" | "negative" | "neutral";
  compact?: boolean;
}

export function ImpactBadge({ impact, compact }: ImpactBadgeProps) {
  return (
    <Badge
      variant={impact}
      config={config}
      compact={compact}
      compactMode="first-char"
      size="xs"
    />
  );
}
