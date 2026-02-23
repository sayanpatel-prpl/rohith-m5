import { useState } from "react";
import { Collapsible } from "radix-ui";
import type { WatchlistData } from "../../types/sections";

type Severity = WatchlistData["stressIndicators"][number]["severity"];

const severityConfig: Record<
  Severity,
  { label: string; badgeClassName: string; borderClassName: string }
> = {
  critical: {
    label: "Critical",
    badgeClassName: "bg-negative/10 text-negative border-negative/20",
    borderClassName: "border-l-2 border-l-negative",
  },
  warning: {
    label: "Warning",
    badgeClassName:
      "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
    borderClassName: "border-l-2 border-l-brand-accent",
  },
  watch: {
    label: "Watch",
    badgeClassName: "bg-neutral/10 text-neutral border-neutral/20",
    borderClassName: "border-l-2 border-l-neutral",
  },
};

interface StressIndicatorsProps {
  indicators: WatchlistData["stressIndicators"];
}

export function StressIndicators({ indicators }: StressIndicatorsProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Stress Indicators
      </h3>

      {indicators.map((indicator, i) => (
        <StressCard key={i} indicator={indicator} />
      ))}
    </div>
  );
}

function StressCard({
  indicator,
}: {
  indicator: WatchlistData["stressIndicators"][number];
}) {
  const [open, setOpen] = useState(false);
  const config = severityConfig[indicator.severity];

  return (
    <div
      className={`bg-surface-raised border border-surface-overlay rounded p-sm space-y-xs ${config.borderClassName}`}
    >
      <div className="flex items-center gap-sm">
        <span className="text-xs font-semibold text-text-primary">
          {indicator.company}
        </span>
        <span
          className={`inline-flex items-center px-sm py-xs rounded border text-[10px] font-medium whitespace-nowrap ${config.badgeClassName}`}
        >
          {config.label}
        </span>
      </div>

      <p className="text-xs text-text-primary">{indicator.indicator}</p>

      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger className="text-xs text-brand-accent font-medium cursor-pointer hover:underline">
          {open ? "Hide Details" : "Details"}
        </Collapsible.Trigger>
        <Collapsible.Content>
          <p className="text-xs text-text-secondary mt-xs leading-relaxed">
            {indicator.details}
          </p>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
