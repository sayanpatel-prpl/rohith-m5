export interface SectionRoute {
  path: string;
  label: string;
}

export const SECTION_ROUTES: SectionRoute[] = [
  { path: "executive", label: "Executive Snapshot" },
  { path: "market-pulse", label: "Market Pulse" },
  { path: "financial", label: "Financial Performance" },
  { path: "deals", label: "Deals & Transactions" },
  { path: "operations", label: "Operational Intelligence" },
  { path: "leadership", label: "Leadership & Governance" },
  { path: "competitive", label: "Competitive Moves" },
  { path: "deep-dive", label: "Sub-Sector Deep Dive" },
  { path: "action-lens", label: "Action Lens" },
  { path: "watchlist", label: "Watchlist & Forward Indicators" },
];
