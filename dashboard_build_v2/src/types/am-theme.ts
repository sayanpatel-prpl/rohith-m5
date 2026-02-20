/**
 * AMTH-02: A&M Service Line and Action Type Definitions
 *
 * Types for classifying engagement opportunities by A&M service line
 * and action type (turnaround, improvement, transaction, neutral).
 */

/** A&M service line classification for engagement opportunities */
export type AMServiceLine =
  | "CPI"
  | "Restructuring"
  | "Transaction Advisory"
  | "PE Services"
  | "Digital"
  | "Operations";

/** A&M action type for triage classification */
export type AMActionType = "turnaround" | "improvement" | "transaction" | "neutral";

/** Display labels for each A&M service line */
export const AM_SERVICE_LINE_LABELS: Record<AMServiceLine, string> = {
  CPI: "Corporate Performance Improvement",
  Restructuring: "Restructuring & Turnaround",
  "Transaction Advisory": "Transaction Advisory",
  "PE Services": "Private Equity Services",
  Digital: "Digital & Technology",
  Operations: "Operational Transformation",
};

/** CSS variable mapping for each A&M action type color */
export const AM_ACTION_COLORS: Record<AMActionType, string> = {
  turnaround: "var(--color-am-turnaround)",
  improvement: "var(--color-am-improvement)",
  transaction: "var(--color-am-transaction)",
  neutral: "var(--color-am-neutral)",
};
