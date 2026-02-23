/**
 * NEWS-03: Corroborated Badge
 *
 * Renders a small green-tinted badge indicating a news item
 * has been corroborated by multiple sources.
 */

import { clsx } from "clsx";

interface CorroboratedBadgeProps {
  sources: string[];
  className?: string;
}

export function CorroboratedBadge({ sources, className }: CorroboratedBadgeProps) {
  const label =
    sources.length > 1
      ? `Corroborated (${sources.length} sources)`
      : "Corroborated";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded",
        "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        className,
      )}
      title={sources.join(", ")}
    >
      <span>{"\u2713"}</span>
      <span>{label}</span>
    </span>
  );
}
