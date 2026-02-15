import type { WatchlistData } from "../../types/sections";

const data: WatchlistData = {
  section: "watchlist",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  fundraiseSignals: [
    {
      company: "Amber Enterprises",
      signal:
        "Active PE fundraise of INR 850 Cr for PLI-linked capacity expansion; Goldman Sachs anchor investor",
      confidence: "high",
      timeframeMonths: 3,
      details:
        "Terms sheet reportedly signed; regulatory approvals in progress. Funds earmarked for Rajasthan greenfield component facility and Noida expansion. Likely to close by March 2025.",
    },
    {
      company: "Dixon Technologies",
      signal:
        "Board approved INR 1,200 Cr fundraise via QIP; likely to tap markets in Q4 FY25 given favorable institutional appetite",
      confidence: "high",
      timeframeMonths: 2,
      details:
        "QIP approval at AGM in September; Alchemy Capital as placement agent. Funds for white goods EMS capacity and potential inorganic growth. Market conditions supportive with stock at 52-week high.",
    },
    {
      company: "Symphony",
      signal:
        "Board exploring options for international subsidiary -- partial divestiture or JV with strategic partner could raise INR 300-500 Cr",
      confidence: "medium",
      timeframeMonths: 6,
      details:
        "Two new board members with PE background appointed in November; restructuring advisor mandate rumored. International subsidiary carrying INR 180 Cr accumulated losses.",
    },
  ],
  marginInflectionCandidates: [
    {
      company: "Amber Enterprises",
      currentMarginPct: 8.2,
      projectedMarginPct: 10.5,
      catalyst:
        "PLI incentive realization (4-6% of incremental production) + domestic compressor assembly cost advantage + operating leverage from 28% revenue growth",
      confidence: "high",
    },
    {
      company: "Crompton Greaves",
      currentMarginPct: 10.5,
      projectedMarginPct: 12.8,
      catalyst:
        "Butterfly integration synergies (procurement, distribution overlap) fully realized by H2 FY26; fans BLDC premiumization lifting blended margins",
      confidence: "medium",
    },
    {
      company: "V-Guard Industries",
      currentMarginPct: 9.5,
      projectedMarginPct: 11.2,
      catalyst:
        "Sunflame integration adds higher-margin kitchen appliances to portfolio; South India pricing power extending to North via combined distribution",
      confidence: "medium",
    },
  ],
  consolidationTargets: [
    {
      company: "Orient Electric",
      rationale:
        "CK Birla group financial stress + MD departure + iconic brand in fans segment. At INR 3,500 Cr EV, attractive for a strategic buyer wanting India fans market leadership.",
      likelyAcquirers: ["Havells", "Crompton Greaves", "International strategic"],
      confidence: "medium",
    },
    {
      company: "IFB Industries",
      rationale:
        "Governance overhang depressing valuation; strong brand in front-load washers and microwave ovens. Engineering division could be divested to unlock appliance business value.",
      likelyAcquirers: ["Whirlpool India", "Haier India", "PE fund"],
      confidence: "low",
    },
    {
      company: "Johnson Controls-Hitachi AC",
      rationale:
        "Parent company strategic review of non-core businesses; India AC business has strong commercial segment but needs investment. Delisting + strategic sale most likely path.",
      likelyAcquirers: ["Daikin India", "Voltas", "Carrier Global"],
      confidence: "medium",
    },
  ],
  stressIndicators: [
    {
      company: "Orient Electric",
      indicator: "Promoter pledge 19% (up from 12%), MD departure, receivable days +15",
      severity: "critical",
      details:
        "Multi-signal convergence: promoter financial stress, leadership vacuum, and working capital deterioration occurring simultaneously. Q4 results and successor appointment are key catalysts.",
    },
    {
      company: "Butterfly Gandhimathi",
      indicator:
        "Negative operating cash flow (3 quarters), working capital facility at 92% utilization",
      severity: "critical",
      details:
        "Dependent on Crompton parent for liquidity support. Standalone viability questionable if integration synergies do not materialize by Q2 FY26. Auditor going concern emphasis.",
    },
    {
      company: "IFB Industries",
      indicator:
        "Auditor qualification + independent director resignation + 4.5% revenue growth (lowest in coverage)",
      severity: "warning",
      details:
        "Governance signals compounding with weakest operational performance. Engineering division related-party transactions under scrutiny. Institutional holdings declining for 3 consecutive quarters.",
    },
    {
      company: "Whirlpool India",
      indicator:
        "EBITDA margin 5.2% (lowest in 8 quarters), parent global restructuring uncertainty",
      severity: "warning",
      details:
        "Margin compression despite revenue growth suggests structural cost issues. Parent company exploring strategic alternatives globally; India business may see ownership change or restructuring.",
    },
  ],
};

export default data;
