import { TrendIndicator } from "../../components/ui/TrendIndicator";
import { SignalScoreBar } from "./SignalScoreBar";
import type { TrendDirection } from "../../types/common";

interface SignalScoreCardProps {
  signal: {
    signal: string;
    score: number;
    trend: TrendDirection;
    context: string;
    serviceLine: string;
  };
  maxScore: number;
}

// ---------------------------------------------------------------------------
// Service line badge config-record
// ---------------------------------------------------------------------------

const SERVICE_LINE_CONFIG: Record<string, { label: string; className: string }> = {
  Turnaround: {
    label: "Turnaround",
    className: "bg-negative/10 text-negative border-negative/20",
  },
  "Growth Strategy": {
    label: "Growth Strategy",
    className: "bg-positive/10 text-positive border-positive/20",
  },
  "Cost Optimization": {
    label: "Cost Optimization",
    className: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  },
  "M&A Advisory": {
    label: "M&A Advisory",
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
};

/**
 * Displays a single BD signal score with trend, service line badge,
 * score bar, and contextual explanation.
 */
export function SignalScoreCard({ signal, maxScore }: SignalScoreCardProps) {
  const slConfig = SERVICE_LINE_CONFIG[signal.serviceLine] ?? {
    label: signal.serviceLine,
    className: "bg-neutral/10 text-neutral border-neutral/20",
  };

  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-1">
      {/* Signal name + trend */}
      <div className="flex items-center gap-xs">
        <span className="text-xs font-medium text-text-primary">
          {signal.signal}
        </span>
        <TrendIndicator direction={signal.trend} />
      </div>

      {/* Service line badge */}
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${slConfig.className}`}
      >
        {slConfig.label}
      </span>

      {/* Score bar */}
      <SignalScoreBar score={signal.score} maxScore={maxScore} />

      {/* Context */}
      <p className="text-xs text-text-secondary">{signal.context}</p>
    </div>
  );
}
