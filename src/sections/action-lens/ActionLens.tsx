import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { SignalScoreCard } from "./SignalScoreCard";
import { PersonaSwitcher } from "./PersonaSwitcher";
import type { ActionLensData } from "../../types/sections";

/**
 * Action Lens section -- BD Signal Scoring, Engagement Opportunity
 * Classification, and persona-based views.
 *
 * Transforms raw data into consulting-grade BD intelligence with signal
 * scores ranked by importance and persona-specific takeaways.
 */
export default function ActionLens() {
  const { data, isPending, error } =
    useFilteredData<ActionLensData>("action-lens");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  const sortedSignals = [...data.signalScores].sort(
    (a, b) => b.score - a.score,
  );

  return (
    <div className="p-md space-y-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Action Lens
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* BD Signal Scores */}
      <div>
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-sm">
          BD Signal Scores
        </h3>
        <div className="grid grid-cols-2 gap-sm">
          {sortedSignals.map((signal) => (
            <SignalScoreCard
              key={signal.signal}
              signal={signal}
              maxScore={10}
            />
          ))}
        </div>
      </div>

      {/* Persona Switcher + Takeaways */}
      <PersonaSwitcher personas={data.personas} />
    </div>
  );
}
