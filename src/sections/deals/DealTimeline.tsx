import { DealCard } from "./DealCard";
import type { DealsTransactionsData } from "../../types/sections";

interface DealTimelineProps {
  deals: DealsTransactionsData["deals"];
}

export function DealTimeline({ deals }: DealTimelineProps) {
  const sorted = [...deals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <p className="text-xs text-text-muted italic py-md">
        No deals match current filters.
      </p>
    );
  }

  return (
    <div className="relative ml-4">
      {/* Vertical timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-surface-overlay" />

      <div className="space-y-md">
        {sorted.map((deal) => (
          <div key={deal.id} className="relative pl-8">
            {/* Timeline dot */}
            <div className="absolute left-0 top-4 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-accent border-2 border-surface" />
            <DealCard deal={deal} />
          </div>
        ))}
      </div>
    </div>
  );
}
