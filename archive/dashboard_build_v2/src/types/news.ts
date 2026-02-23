/**
 * NEWS-01: News Item Credibility Framework
 *
 * Defines the NewsItem interface with credibility scoring, corroboration
 * tracking, and filing verification. Used by the data layer to filter
 * out low-credibility sources before they reach the UI.
 */

import type { SectionId } from "./common";
import type { SourceTier } from "./source";

/** A single news item with credibility metadata */
export interface NewsItem {
  /** Unique identifier for this news item */
  id: string;
  /** News headline text */
  headline: string;
  /** Full body text of the news item */
  body: string;
  /** Source publication name (e.g., "Economic Times", "MoneyControl") */
  source: string;
  /** Publication date in ISO-8601 format */
  date: string;
  /** Company IDs this news item relates to */
  companyIds: string[];
  /** Section IDs this news item feeds into */
  sectionIds: SectionId[];
  /** Source tier classification (1-4) */
  sourceTier: SourceTier;
  /** Overall credibility assessment of this news source */
  sourceCredibility: "high" | "medium" | "low";
  /** Other sources that corroborate this news (NEWS-03) */
  corroboratedBy?: string[];
  /** Sources that contradict this news (NEWS-04) */
  contradictedBy?: string[];
  /** Whether this news is verified by an official filing */
  isVerifiedByFiling?: boolean;
}
