import type { ActionLensData } from "../../types/sections";

const data: ActionLensData = {
  section: "action-lens",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  persona: "PE/Investors",
  takeaways: [
    {
      insight:
        "PLI-linked manufacturers (Amber, Dixon) offer the best risk-adjusted growth play in Consumer Durables -- government subsidy provides floor on returns while capacity expansion drives top-line",
      actionableStep:
        "Evaluate Amber Enterprises for growth capital deployment; current fundraise of INR 850 Cr at reasonable valuation given 28.5% revenue growth trajectory",
      urgency: "high",
      relatedSignals: [
        "Amber PLI capacity expansion",
        "Dixon EMS facility investment",
        "Goldman Sachs PE round",
      ],
    },
    {
      insight:
        "Kitchen appliances sub-sector consolidation is creating acquisition opportunities -- fragmented segment with 3 deals in Q3 alone suggests more targets available",
      actionableStep:
        "Screen mid-tier kitchen appliance brands (regional players with INR 200-500 Cr revenue, 6-10% EBITDA margin) as potential bolt-on acquisitions for portfolio companies",
      urgency: "medium",
      relatedSignals: [
        "Crompton-Butterfly deal",
        "V-Guard-Sunflame integration",
        "Havells D2C kitchen brand acquisition",
      ],
    },
    {
      insight:
        "Orient Electric governance deterioration creates potential distressed investment opportunity -- if CK Birla group accelerates stake sale, sub-INR 200 valuation possible for a INR 2,800 Cr revenue business",
      actionableStep:
        "Prepare preliminary assessment of Orient Electric standalone value; monitor Q4 results and any formal strategic review announcement",
      urgency: "medium",
      relatedSignals: [
        "Orient MD departure",
        "Promoter pledge increase",
        "Potential stake sale discussions",
      ],
    },
    {
      insight:
        "D2C channel shift is early-stage but accelerating -- companies investing in owned digital channels (Havells 8% D2C revenue) will command valuation premium over pure wholesale distributors",
      actionableStep:
        "Factor D2C revenue share and growth trajectory into valuation models; penalize companies with zero D2C presence as channel risk",
      urgency: "low",
      relatedSignals: [
        "Havells D2C at 8% of revenue",
        "Crompton-Zepto pilot",
        "Quick commerce appliance listings",
      ],
    },
  ],
  signalScores: [
    {
      signal: "PLI Scheme Execution Momentum",
      score: 8.5,
      trend: "up",
      context:
        "Government disbursements accelerating; 4 companies in coverage universe now claiming incentives vs 2 last quarter. Manufacturing investment cycle is real and attracting institutional capital.",
    },
    {
      signal: "Kitchen Appliances M&A Velocity",
      score: 7.8,
      trend: "up",
      context:
        "3 deals in single quarter is unprecedented for this sub-sector. Market is pricing in consolidation premium for remaining independent players. Window for value acquisition narrowing.",
    },
    {
      signal: "Mid-Tier Governance Risk",
      score: 7.2,
      trend: "up",
      context:
        "Orient Electric + IFB Industries governance flags suggest systemic stress at promoter-group level for mid-tier players. Capital allocation discipline weakening under margin pressure.",
    },
    {
      signal: "Channel Disruption (Quick Commerce)",
      score: 5.5,
      trend: "up",
      context:
        "Still nascent but growing fast from low base. Quick commerce for appliances is 6-12 months from being material (>2% of industry sales). Infrastructure (dark store density, delivery logistics for large items) still developing.",
    },
  ],
};

export default data;
