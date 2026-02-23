import type { SectionId } from "../types/common";

export interface SectionRoute {
  path: SectionId;
  label: string;
}

/**
 * All 11 section routes in navigation order.
 * CRITICAL: A&M Value-Add is at position 2 (index 1) per requirements.
 */
export const SECTION_ROUTES: SectionRoute[] = [
  { path: "executive", label: "Executive Snapshot" },
  { path: "am-value-add", label: "A&M Value-Add Opportunities" },
  { path: "market-pulse", label: "Market Pulse" },
  { path: "financial", label: "Financial Performance" },
  { path: "deals", label: "Deals & Transactions" },
  { path: "operations", label: "Operational Intelligence" },
  { path: "leadership", label: "Leadership & Governance" },
  { path: "competitive", label: "Competitive Moves" },
  { path: "deep-dive", label: "Sub-Sector Deep Dive" },
  { path: "what-this-means", label: "What This Means For..." },
  { path: "watchlist", label: "Watchlist & Forward Indicators" },
];
