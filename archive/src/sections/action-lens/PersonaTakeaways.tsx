import { TakeawayCard } from "./TakeawayCard";
import type { ActionLensData } from "../../types/sections";

interface PersonaTakeawaysProps {
  takeaways: ActionLensData["personas"][0]["takeaways"];
}

/**
 * Renders the takeaway list for the currently active persona.
 */
export function PersonaTakeaways({ takeaways }: PersonaTakeawaysProps) {
  if (takeaways.length === 0) {
    return (
      <p className="text-xs text-text-muted italic">
        No takeaways available for this persona.
      </p>
    );
  }

  return (
    <div className="space-y-sm">
      {takeaways.map((takeaway) => (
        <TakeawayCard key={takeaway.insight} takeaway={takeaway} />
      ))}
    </div>
  );
}
