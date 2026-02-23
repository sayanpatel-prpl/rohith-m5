import { SignalCard } from "../../components/ui/SignalCard";
import type { OperationalIntelligenceData } from "../../types/sections";

interface SupplyChainSignalsProps {
  signals: OperationalIntelligenceData["supplyChainSignals"];
}

/** Extract a short title from the signal text (up to first semicolon or ~60 chars) */
function extractTitle(signal: string): string {
  const semicolonIdx = signal.indexOf(";");
  if (semicolonIdx > 0 && semicolonIdx <= 80) return signal.slice(0, semicolonIdx);
  if (signal.length <= 60) return signal;
  const cutoff = signal.lastIndexOf(" ", 60);
  return signal.slice(0, cutoff > 30 ? cutoff : 60) + "\u2026";
}

export function SupplyChainSignals({ signals }: SupplyChainSignalsProps) {
  return (
    <div className="space-y-sm">
      <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Supply Chain
      </h4>
      {signals.map((s, i) => (
        <SignalCard
          key={i}
          title={extractTitle(s.signal)}
          detail={s.details}
          impact={s.impact}
        />
      ))}
    </div>
  );
}
