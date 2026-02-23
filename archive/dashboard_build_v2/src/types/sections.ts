/**
 * Base section data interfaces.
 *
 * SectionData is the base shape for all section data payloads.
 * SectionMeta holds navigation/display metadata.
 * Individual section data types (ExecutiveData, FinancialData, etc.)
 * will extend SectionData in later phases.
 */

import type { SectionId } from "./common";

/** Base interface for all section data payloads */
export interface SectionData {
  /** Which section this data belongs to */
  section: SectionId;
  /** Human-readable data freshness label (e.g., "Q3 FY2026") */
  dataAsOf?: string;
  /** ISO-8601 date of last data refresh */
  lastUpdated?: string;
}

/** Navigation and display metadata for a section */
export interface SectionMeta {
  /** Human-readable section label for navigation */
  label: string;
  /** Brief description of section purpose */
  description: string;
  /** Optional icon identifier (e.g., Lucide icon name) */
  icon?: string;
}
