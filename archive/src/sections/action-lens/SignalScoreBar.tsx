import clsx from "clsx";

interface SignalScoreBarProps {
  score: number;
  maxScore: number;
}

/**
 * Visual bar showing a signal score as a filled proportion of the max score.
 * Color transitions: >=8 positive (green), >=6 brand-accent, <6 neutral.
 */
export function SignalScoreBar({ score, maxScore }: SignalScoreBarProps) {
  const pct = Math.min((score / maxScore) * 100, 100);
  const barColor =
    score >= 8
      ? "bg-positive"
      : score >= 6
        ? "bg-brand-accent"
        : "bg-neutral";

  return (
    <div className="flex items-center gap-sm">
      <div className="h-1.5 bg-surface-overlay rounded-full overflow-hidden w-full">
        <div
          className={clsx("h-full rounded-full", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-text-primary whitespace-nowrap">
        {score}
      </span>
    </div>
  );
}
