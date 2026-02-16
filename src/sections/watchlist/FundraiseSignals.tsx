import { useState } from "react";
import { Collapsible } from "radix-ui";
import { ConfidenceBadge } from "../../components/ui/ConfidenceBadge";
import type { WatchlistData } from "../../types/sections";

interface FundraiseSignalsProps {
  signals: WatchlistData["fundraiseSignals"];
}

export function FundraiseSignals({ signals }: FundraiseSignalsProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Likely Fundraises (90-day)
      </h3>

      {signals.map((signal, i) => (
        <FundraiseCard key={i} signal={signal} />
      ))}
    </div>
  );
}

function FundraiseCard({
  signal,
}: {
  signal: WatchlistData["fundraiseSignals"][number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-xs">
      <div className="flex items-center gap-sm">
        <span className="text-xs font-semibold text-text-primary">
          {signal.company}
        </span>
        <ConfidenceBadge level={signal.confidence} />
      </div>

      <p className="text-xs text-text-primary">{signal.signal}</p>

      <p className="text-xs text-text-muted">
        Expected within {signal.timeframeMonths} months
      </p>

      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger className="text-xs text-brand-accent font-medium cursor-pointer hover:underline">
          {open ? "Hide Details" : "Details"}
        </Collapsible.Trigger>
        <Collapsible.Content>
          <p className="text-xs text-text-secondary mt-xs leading-relaxed">
            {signal.details}
          </p>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
