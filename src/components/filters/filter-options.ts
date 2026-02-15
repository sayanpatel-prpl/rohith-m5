import { COMPANIES, SUB_SECTORS } from "../../data/mock/companies";

/** Company options for the CompanyPicker multi-select */
export const COMPANY_OPTIONS: Array<{ id: string; name: string }> =
  COMPANIES.map((c) => ({ id: c.id, name: c.name }));

/** Sub-category (sub-sector) filter options with "All" as first option */
export const SUB_CATEGORY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Sub-categories" },
  ...SUB_SECTORS.map((s) => ({ value: s, label: s })),
];

/** Performance tier filter options */
export const PERFORMANCE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Tiers" },
  { value: "outperform", label: "Outperform" },
  { value: "inline", label: "Inline" },
  { value: "underperform", label: "Underperform" },
];

/** Time period comparison options */
export const TIME_PERIOD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "QoQ", label: "QoQ" },
  { value: "YoY", label: "YoY" },
  { value: "MoM", label: "MoM" },
];
