import type { ChartAnnotation } from "../../types/common";

/**
 * Creates props for a Recharts `<ReferenceDot>` annotation.
 * This is a configuration helper, not a standalone component.
 * Spread the returned object onto `<ReferenceDot {...createAnnotation(...)}>`.
 */
export function createAnnotation(
  key: string,
  x: ChartAnnotation["x"],
  y: number,
  label: string,
) {
  return {
    key,
    x,
    y,
    r: 4,
    fill: "var(--color-brand-accent)",
    stroke: "var(--color-surface)",
    strokeWidth: 2,
    label: {
      value: label,
      position: "top" as const,
      fill: "var(--color-text-primary)",
      fontSize: 10,
      fontWeight: 600,
    },
  };
}
