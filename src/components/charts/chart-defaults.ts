/** Default chart height in pixels */
export const CHART_HEIGHT = 240;

/** Default chart margins */
export const CHART_MARGIN = { top: 8, right: 8, bottom: 4, left: 0 };

/** CartesianGrid shared props */
export const GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke: "var(--color-text-muted)",
  opacity: 0.15,
} as const;

/** Shared tick style for XAxis and YAxis */
export const AXIS_TICK = {
  fontSize: 11,
  fill: "var(--color-text-secondary)",
} as const;

/** Shared axis line style */
export const AXIS_LINE = {
  stroke: "var(--color-text-muted)",
  opacity: 0.3,
} as const;
