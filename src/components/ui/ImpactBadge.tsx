import clsx from "clsx";

const config = {
  positive: { label: "Positive", className: "bg-positive/10 text-positive border-positive/20" },
  negative: { label: "Negative", className: "bg-negative/10 text-negative border-negative/20" },
  neutral:  { label: "Neutral",  className: "bg-neutral/10 text-neutral border-neutral/20" },
} as const;

interface ImpactBadgeProps {
  impact: "positive" | "negative" | "neutral";
  compact?: boolean;
}

export function ImpactBadge({ impact, compact }: ImpactBadgeProps) {
  const { label, className } = config[impact];
  return (
    <span className={clsx(
      "inline-flex items-center rounded border px-sm py-xs text-xs font-medium whitespace-nowrap",
      className,
    )}>
      {compact ? impact[0].toUpperCase() : label}
    </span>
  );
}
