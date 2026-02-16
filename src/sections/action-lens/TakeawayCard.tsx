import { ConfidenceBadge } from "../../components/ui/ConfidenceBadge";
import type { ConfidenceLevel } from "../../types/common";

interface TakeawayCardProps {
  takeaway: {
    insight: string;
    actionableStep: string;
    urgency: ConfidenceLevel;
    relatedSignals: string[];
  };
}

/**
 * Individual takeaway card showing an AI-generated insight with urgency badge,
 * actionable step, and related signal reference chips.
 */
export function TakeawayCard({ takeaway }: TakeawayCardProps) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-sm">
      {/* Urgency badge + insight */}
      <div className="flex items-start gap-sm">
        <ConfidenceBadge level={takeaway.urgency} className="mt-px shrink-0" />
        <p className="text-xs text-text-primary">{takeaway.insight}</p>
      </div>

      {/* Actionable step */}
      <div className="border-l-2 border-l-positive pl-sm">
        <p className="text-xs text-text-secondary italic">
          {takeaway.actionableStep}
        </p>
      </div>

      {/* Related signals */}
      {takeaway.relatedSignals.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {takeaway.relatedSignals.map((signal) => (
            <span
              key={signal}
              className="text-xs bg-surface-overlay px-1.5 py-0.5 rounded text-text-muted"
            >
              {signal}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
