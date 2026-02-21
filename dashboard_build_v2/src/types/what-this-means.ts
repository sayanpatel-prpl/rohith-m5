/**
 * WTMF-01 through WTMF-03: What This Means For section type definitions.
 *
 * Extends SectionData with stakeholder-specific insights auto-generated
 * by cross-referencing all other section data. Each insight is tagged
 * with a recommended A&M service and a cross-navigable section link.
 */

import type { SectionData } from "./sections";
import type { AMServiceLine } from "./am-theme";
import type { SourceInfo } from "./source";
import type { SectionId } from "./common";

/** The four stakeholder tabs */
export type StakeholderTab = "pe-investors" | "founders" | "coo-cfo" | "supply-chain";

/** A single insight tailored to a stakeholder persona */
export interface StakeholderInsight {
  /** Unique insight identifier */
  id: string;
  /** Which stakeholder tab this insight belongs to */
  stakeholderTab: StakeholderTab;
  /** Short insight headline */
  headline: string;
  /** Full explanation */
  detail: string;
  /** WTMF-02: Recommended A&M service line */
  recommendedService: AMServiceLine;
  /** WTMF-03: Cross-navigable section reference */
  linkedSectionId: SectionId;
  /** Human-readable section name for display */
  linkedSectionLabel: string;
  /** Company IDs this insight applies to */
  companyIds: string[];
  /** Source attribution */
  source: SourceInfo;
}

/** Summary for a single stakeholder tab */
export interface StakeholderTabSummary {
  /** Tab identifier */
  tab: StakeholderTab;
  /** Human-readable tab label */
  label: string;
  /** Number of insights in this tab */
  insightCount: number;
}

/** Complete data payload for the What This Means For section */
export interface WhatThisMeansData extends SectionData {
  /** All stakeholder insights across all tabs */
  insights: StakeholderInsight[];
  /** Summary for each stakeholder tab */
  tabs: StakeholderTabSummary[];
}
