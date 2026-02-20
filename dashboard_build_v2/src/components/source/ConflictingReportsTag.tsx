/**
 * NEWS-04: Conflicting Reports Tag
 *
 * Renders a small amber/orange-tinted tag indicating a news item
 * has been contradicted by other sources.
 */

import { clsx } from "clsx";

interface ConflictingReportsTagProps {
  sources: string[];
  className?: string;
}

export function ConflictingReportsTag({ sources, className }: ConflictingReportsTagProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded",
        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        className,
      )}
      title={`Contradicted by: ${sources.join(", ")}`}
    >
      <span>{"\u26A0"}</span>
      <span>Conflicting Reports</span>
    </span>
  );
}
