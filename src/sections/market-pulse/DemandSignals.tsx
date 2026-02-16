import { StatCard } from "../../components/ui/StatCard";
import type { MarketPulseData } from "../../types/sections";

interface DemandSignalsProps {
  signals: MarketPulseData["demandSignals"];
}

export function DemandSignals({ signals }: DemandSignalsProps) {
  return (
    <div>
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-sm">
        Demand Signals
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {signals.map((signal) => (
          <StatCard
            key={signal.channel}
            label={signal.channel}
            value={signal.magnitude}
            trend={{ direction: signal.direction, label: signal.signal }}
          />
        ))}
      </div>
    </div>
  );
}
