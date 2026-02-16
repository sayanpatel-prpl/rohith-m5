import type {
  ConfidenceLevel,
  PerformanceLevel,
  TrendDirection,
} from "./common";
import type { FinancialMetrics } from "./financial";

// ---------------------------------------------------------------------------
// Base
// ---------------------------------------------------------------------------

/** Fields shared by every section payload */
interface SectionDataBase {
  /** Human-readable data period, e.g. "Q3 FY25" */
  dataAsOf: string;
  /** ISO-8601 date of last data refresh */
  lastUpdated: string;
}

// ---------------------------------------------------------------------------
// 1. Executive Snapshot
// ---------------------------------------------------------------------------

export interface ExecutiveSnapshotData extends SectionDataBase {
  section: "executive-snapshot";
  /** Month-in-5-bullets summary */
  bullets: Array<{
    text: string;
    theme: string;
    significance: ConfidenceLevel;
    /** AI-generated BD relevance explanation */
    narrative: string;
  }>;
  /** Red flags / watchlist items with AI confidence */
  redFlags: Array<{
    company: string;
    signal: string;
    confidence: ConfidenceLevel;
    explanation: string;
  }>;
}

// ---------------------------------------------------------------------------
// 2. Financial Performance
// ---------------------------------------------------------------------------

export interface FinancialPerformanceData extends SectionDataBase {
  section: "financial-performance";
  companies: Array<{
    id: string;
    name: string;
    ticker: string;
    metrics: FinancialMetrics;
    performance: PerformanceLevel;
    varianceAnalysis: string;
    source: string;
  }>;
}

// ---------------------------------------------------------------------------
// 3. Market Pulse
// ---------------------------------------------------------------------------

export interface MarketPulseData extends SectionDataBase {
  section: "market-pulse";
  /** Demand signals across channels */
  demandSignals: Array<{
    channel: string;
    signal: string;
    direction: TrendDirection;
    magnitude: string;
  }>;
  /** Key input cost trends */
  inputCosts: Array<{
    commodity: string;
    trend: TrendDirection;
    qoqChange: number;
    yoyChange: number;
  }>;
  /** AI-generated margin outlook narrative */
  marginOutlook: string;
  /** Channel mix shift data */
  channelMix: Array<{
    channel: string;
    currentSharePct: number;
    previousSharePct: number;
    trend: TrendDirection;
  }>;
}

// ---------------------------------------------------------------------------
// 4. Deals & Transactions
// ---------------------------------------------------------------------------

export interface DealsTransactionsData extends SectionDataBase {
  section: "deals-transactions";
  deals: Array<{
    id: string;
    type: "M&A" | "PE/VC" | "IPO" | "distressed";
    parties: string[];
    valueCr: number | null;
    rationale: string;
    date: string;
    source: string;
  }>;
  /** AI-detected patterns across deal activity */
  aiPatterns: Array<{
    pattern: string;
    confidence: ConfidenceLevel;
    supportingDeals: string[];
    explanation: string;
  }>;
}

// ---------------------------------------------------------------------------
// 5. Operational Intelligence
// ---------------------------------------------------------------------------

export interface OperationalIntelligenceData extends SectionDataBase {
  section: "operational-intelligence";
  supplyChainSignals: Array<{
    company: string;
    signal: string;
    impact: "positive" | "negative" | "neutral";
    details: string;
  }>;
  manufacturingCapacity: Array<{
    company: string;
    facility: string;
    action: "expansion" | "rationalization" | "greenfield" | "maintenance";
    investmentCr: number | null;
    timeline: string;
  }>;
  procurementShifts: Array<{
    category: string;
    shift: string;
    affectedCompanies: string[];
    impact: string;
  }>;
  retailFootprint: Array<{
    company: string;
    action: "expansion" | "rationalization" | "reformat";
    storeCount: number | null;
    geography: string;
    details: string;
  }>;
}

// ---------------------------------------------------------------------------
// 6. Leadership & Governance
// ---------------------------------------------------------------------------

export interface LeadershipGovernanceData extends SectionDataBase {
  section: "leadership-governance";
  cxoChanges: Array<{
    company: string;
    role: string;
    incoming: string | null;
    outgoing: string | null;
    effectiveDate: string;
    context: string;
  }>;
  boardReshuffles: Array<{
    company: string;
    change: string;
    date: string;
    significance: ConfidenceLevel;
  }>;
  promoterStakeChanges: Array<{
    company: string;
    promoterGroup: string;
    previousPct: number;
    currentPct: number;
    changePct: number;
    context: string;
  }>;
  auditorFlags: Array<{
    company: string;
    flag: string;
    severity: ConfidenceLevel;
    details: string;
  }>;
  /** AI-generated risk flags synthesized across governance signals */
  aiRiskFlags: Array<{
    company: string;
    riskType: string;
    confidence: ConfidenceLevel;
    explanation: string;
  }>;
}

// ---------------------------------------------------------------------------
// 7. Competitive Moves
// ---------------------------------------------------------------------------

export interface CompetitiveMovesData extends SectionDataBase {
  section: "competitive-moves";
  productLaunches: Array<{
    company: string;
    product: string;
    category: string;
    positioningNote: string;
    date: string;
  }>;
  pricingActions: Array<{
    company: string;
    action: "increase" | "decrease" | "promotional";
    category: string;
    magnitudePct: number | null;
    context: string;
  }>;
  d2cInitiatives: Array<{
    company: string;
    initiative: string;
    channel: string;
    status: "launched" | "piloting" | "announced";
    details: string;
  }>;
  qcPartnerships: Array<{
    company: string;
    partner: string;
    scope: string;
    status: "active" | "announced" | "rumored";
  }>;
  /** AI cluster analysis of competitive positioning */
  clusterAnalysis: Array<{
    cluster: string;
    companies: string[];
    characteristics: string;
    outlook: string;
  }>;
}

// ---------------------------------------------------------------------------
// 8. Sub-Sector Deep Dive
// ---------------------------------------------------------------------------

export interface SubSectorDeepDiveData extends SectionDataBase {
  section: "sub-sector-deep-dive";
  /** The sub-sector being profiled this month */
  subSector: string;
  costsBreakdown: Array<{
    costItem: string;
    sharePct: number;
    trendVsPrior: TrendDirection;
    notes: string;
  }>;
  marginLevers: Array<{
    lever: string;
    impactBps: number;
    feasibility: ConfidenceLevel;
    explanation: string;
  }>;
  topQuartileAnalysis: Array<{
    metric: string;
    topQuartileValue: number;
    medianValue: number;
    bottomQuartileValue: number;
    unit: string;
    topPerformers: string[];
  }>;
}

// ---------------------------------------------------------------------------
// 9. Action Lens ("What This Means For...")
// ---------------------------------------------------------------------------

export interface ActionLensData extends SectionDataBase {
  section: "action-lens";
  persona: "PE/Investors" | "Founders" | "COOs/CFOs" | "Procurement Heads";
  takeaways: Array<{
    insight: string;
    actionableStep: string;
    urgency: ConfidenceLevel;
    relatedSignals: string[];
  }>;
  signalScores: Array<{
    signal: string;
    score: number;
    trend: TrendDirection;
    context: string;
  }>;
}

// ---------------------------------------------------------------------------
// 10. Watchlist & Forward Indicators
// ---------------------------------------------------------------------------

export interface WatchlistData extends SectionDataBase {
  section: "watchlist";
  fundraiseSignals: Array<{
    company: string;
    signal: string;
    confidence: ConfidenceLevel;
    timeframeMonths: number;
    details: string;
  }>;
  marginInflectionCandidates: Array<{
    company: string;
    currentMarginPct: number;
    projectedMarginPct: number;
    catalyst: string;
    confidence: ConfidenceLevel;
  }>;
  consolidationTargets: Array<{
    company: string;
    rationale: string;
    likelyAcquirers: string[];
    confidence: ConfidenceLevel;
  }>;
  stressIndicators: Array<{
    company: string;
    indicator: string;
    severity: "critical" | "warning" | "watch";
    details: string;
  }>;
}

// ---------------------------------------------------------------------------
// Discriminated Union
// ---------------------------------------------------------------------------

/** Discriminated union of all 10 section data payloads.
 *  Narrowing on the `section` field gives type-safe access to section-specific fields. */
export type SectionData =
  | ExecutiveSnapshotData
  | FinancialPerformanceData
  | MarketPulseData
  | DealsTransactionsData
  | OperationalIntelligenceData
  | LeadershipGovernanceData
  | CompetitiveMovesData
  | SubSectorDeepDiveData
  | ActionLensData
  | WatchlistData;
