import clsx from "clsx";
import { ImpactBadge } from "./ImpactBadge";

const impactColors = {
  positive: "border-l-positive bg-positive/5",
  negative: "border-l-negative bg-negative/5",
  neutral:  "border-l-neutral bg-neutral/5",
};

interface SignalCardProps {
  title: string;
  detail: string;
  impact: "positive" | "negative" | "neutral";
  metadata?: string;
}

export function SignalCard({ title, detail, impact, metadata }: SignalCardProps) {
  return (
    <div className={clsx(
      "border-l-2 rounded p-md space-y-xs",
      impactColors[impact],
    )}>
      <div className="flex items-center justify-between gap-sm">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <ImpactBadge impact={impact} />
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{detail}</p>
      {metadata && (
        <p className="text-xs text-text-muted font-mono">{metadata}</p>
      )}
    </div>
  );
}
