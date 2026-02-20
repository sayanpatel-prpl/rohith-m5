/**
 * DATA-04: DataValue Component
 *
 * Graceful data display component. Uses safeDisplay() from lib/formatters.ts.
 * When data is unavailable (null/undefined/NaN), renders "-" with a tooltip.
 * When data is available, renders the formatted value.
 *
 * This is the primary way sections display data -- ensures no broken
 * layouts when data is unavailable.
 */

import { clsx } from "clsx";
import { safeDisplay } from "@/lib/formatters";

interface DataValueProps {
  value: number | null | undefined;
  formatter: (v: number) => string;
  tooltip?: string;
  className?: string;
}

export function DataValue({ value, formatter, tooltip, className }: DataValueProps) {
  const result = safeDisplay(value, formatter, tooltip);

  if (!result.hasData) {
    return (
      <span
        className={clsx("text-text-muted", className)}
        title={result.tooltip}
      >
        {result.text}
      </span>
    );
  }

  return (
    <span className={clsx("text-text-primary", className)}>
      {result.text}
    </span>
  );
}
