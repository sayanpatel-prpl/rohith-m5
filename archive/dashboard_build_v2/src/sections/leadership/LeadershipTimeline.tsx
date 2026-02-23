/**
 * LEAD-01: Leadership & Governance Timeline
 *
 * Chronological timeline of governance events sourced from real data:
 * promoter changes, institutional shifts, and management commentary.
 * Each entry has source attribution per SRCA-03.
 */

import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { LeadershipEvent, LeadershipEventType } from "@/types/leadership";

interface LeadershipTimelineProps {
  events: LeadershipEvent[];
}

/** Visual config per event type */
const EVENT_CONFIG: Record<
  LeadershipEventType,
  { label: string; dotColor: string }
> = {
  "promoter-change": {
    label: "Promoter Change",
    dotColor: "bg-[var(--color-negative)]",
  },
  "institutional-shift": {
    label: "Institutional Shift",
    dotColor: "bg-[var(--color-brand-accent)]",
  },
  "management-commentary": {
    label: "Mgmt Commentary",
    dotColor: "bg-[var(--color-chart-2)]",
  },
  "shareholding-alert": {
    label: "Alert",
    dotColor: "bg-[var(--color-negative)]",
  },
};

export function LeadershipTimeline({ events }: LeadershipTimelineProps) {
  if (events.length === 0) return null;

  // Show max 20 events
  const displayEvents = events.slice(0, 20);

  return (
    <div className="space-y-sm">
      <div>
        <h3 className="text-xs font-semibold text-text-primary">
          Governance Event Timeline
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          Significant shareholding and governance events sourced from regulatory filings.
          Showing {displayEvents.length} of {events.length} events.
        </p>
      </div>

      <div className="relative space-y-0">
        {/* Vertical timeline line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border-default" />

        {displayEvents.map((event, idx) => {
          const config = EVENT_CONFIG[event.type];

          return (
            <div key={`${event.companyId}-${event.date}-${idx}`} className="relative pl-5 pb-sm">
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-surface-base ${config.dotColor}`}
              />

              <div className="bg-surface-raised border border-surface-overlay rounded p-sm">
                {/* Header: date + type badge */}
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-text-muted tabular-nums">
                    {event.date}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-overlay text-text-secondary">
                    {config.label}
                  </span>
                </div>

                {/* Company + title */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-medium text-text-primary">
                    {event.company}
                  </span>
                  <span className="text-[10px] text-text-secondary">
                    {event.title}
                  </span>
                </div>

                {/* Detail */}
                <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                  {event.detail}
                </p>

                {/* Source */}
                <div className="mt-1">
                  <SourceAttribution source={event.source} compact />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
