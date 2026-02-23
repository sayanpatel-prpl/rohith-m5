/** State shape for the global filter store */
export interface FilterState {
  /** Selected company IDs (empty = all companies) */
  companies: string[];
  /** Sub-sector filter ("all" = no filter) */
  subCategory: string;
  /** Performance tier filter: "all" | "outperform" | "inline" | "underperform" */
  performanceTier: string;
  /** Time period for comparisons: "QoQ" | "YoY" | "MoM" */
  timePeriod: string;
}

/** Default filter state -- no filters active */
export const DEFAULT_FILTERS: FilterState = {
  companies: [],
  subCategory: "all",
  performanceTier: "all",
  timePeriod: "YoY",
};

/** Typed actions for modifying filter state */
export interface FilterActions {
  setCompanies: (companies: string[]) => void;
  setSubCategory: (subCategory: string) => void;
  setPerformanceTier: (tier: string) => void;
  setTimePeriod: (period: string) => void;
  resetFilters: () => void;
}
