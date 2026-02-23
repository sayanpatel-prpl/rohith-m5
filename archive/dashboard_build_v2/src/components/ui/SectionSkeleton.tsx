/**
 * SectionSkeleton: Loading skeleton for lazy-loaded sections.
 *
 * Renders animated pulse placeholder blocks mimicking a section layout.
 * Ported from v1 with updated spacing tokens.
 */

interface SectionSkeletonProps {
  variant?: "table" | "chart" | "mixed" | "cards";
}

export function SectionSkeleton({ variant = "mixed" }: SectionSkeletonProps) {
  if (variant === "table") {
    return (
      <div className="space-y-xs p-md animate-pulse">
        {/* Header row */}
        <div className="flex gap-md">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 bg-surface-overlay rounded flex-1" />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-md py-xs">
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="h-2.5 bg-surface-overlay rounded flex-1 opacity-60"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className="p-md animate-pulse">
        <div className="h-3 w-32 bg-surface-overlay rounded mb-md" />
        <div className="h-60 bg-surface-overlay rounded" />
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-4 gap-md p-md animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-surface-overlay rounded" />
        ))}
      </div>
    );
  }

  // mixed (default)
  return (
    <div className="p-md animate-pulse space-y-md">
      <div className="grid grid-cols-4 gap-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface-overlay rounded" />
        ))}
      </div>
      <div className="h-48 bg-surface-overlay rounded" />
      <div className="space-y-xs">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-2.5 bg-surface-overlay rounded" />
        ))}
      </div>
    </div>
  );
}
