import type { FinancialMetrics } from "./financial";
import type { PerformanceLevel } from "./common";

/** Company entity in the Consumer Durables universe */
export interface Company {
  /** Unique identifier */
  id: string;
  /** Full company name */
  name: string;
  /** BSE/NSE ticker symbol */
  ticker: string;
  /** Sub-sector within Consumer Durables (e.g. "Air Conditioning", "Kitchen Appliances") */
  subSector: string;
}

/** Company with its financial metrics and performance classification */
export interface CompanyMetric {
  /** The company entity */
  company: Company;
  /** Standard financial metrics */
  metrics: FinancialMetrics;
  /** AI-assigned performance classification relative to peers */
  performance: PerformanceLevel;
  /** Data source citation (e.g. "BSE filing Q3 FY25") */
  source: string;
}
