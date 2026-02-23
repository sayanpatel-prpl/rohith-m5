import type { ActionLensData } from "../../types/sections";

const data: ActionLensData = {
  section: "action-lens",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  personas: [
    {
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
    },
    {
      persona: "Founders",
      takeaways: [
        {
          insight:
            "PLI scheme is reshaping competitive dynamics -- manufacturers with approved PLI capacity are winning OEM contracts from MNCs, creating a structural moat against non-PLI competitors",
          actionableStep:
            "If not already PLI-enrolled, evaluate backward integration into component manufacturing to qualify for incentives; window for Phase II applications closing in Q1 FY26",
          urgency: "high",
          relatedSignals: [
            "Amber PLI capacity expansion",
            "Dixon EMS facility investment",
            "PLI Scheme Execution Momentum",
          ],
        },
        {
          insight:
            "Quick commerce is opening a new distribution channel but margin structures are unfavorable -- 18-25% commissions versus 8-12% for general trade erode brand margins",
          actionableStep:
            "Negotiate category-exclusive or hero SKU partnerships with Blinkit/Zepto for trial; limit QC SKUs to high-velocity, high-margin products to protect blended margin",
          urgency: "medium",
          relatedSignals: [
            "Crompton-Zepto pilot",
            "Quick commerce appliance listings",
            "Channel Disruption (Quick Commerce)",
          ],
        },
        {
          insight:
            "Mid-tier brands face increasing governance scrutiny from institutional investors post-Orient Electric saga -- proactive transparency improvements can differentiate in fundraise conversations",
          actionableStep:
            "Commission independent board effectiveness review and publish governance charter; use as differentiation in next capital raise",
          urgency: "medium",
          relatedSignals: [
            "Orient MD departure",
            "Mid-Tier Governance Risk",
            "IFB Industries audit qualification",
          ],
        },
        {
          insight:
            "Kitchen appliances consolidation wave means smaller brands must choose: scale aggressively or become acquisition targets. The INR 200-500 Cr revenue band is now the active deal zone",
          actionableStep:
            "If revenue is below INR 500 Cr, initiate strategic review -- either identify a scale partner/acquirer or develop a credible path to INR 1,000 Cr in 3 years",
          urgency: "high",
          relatedSignals: [
            "Crompton-Butterfly deal",
            "V-Guard-Sunflame integration",
            "Kitchen Appliances M&A Velocity",
          ],
        },
      ],
    },
    {
      persona: "COOs/CFOs",
      takeaways: [
        {
          insight:
            "Copper and steel cost inflation is squeezing margins -- input costs up 8-12% QoQ but pricing power limited to 3-5% increases without demand destruction, creating a 300-500 bps margin headwind",
          actionableStep:
            "Implement quarterly commodity hedging program covering 60-70% of next-quarter copper requirements; evaluate forward contracts at current LME levels",
          urgency: "high",
          relatedSignals: [
            "PLI Scheme Execution Momentum",
            "Channel Disruption (Quick Commerce)",
            "Mid-Tier Governance Risk",
          ],
        },
        {
          insight:
            "Working capital days are diverging across the sector -- top quartile at 45 days vs bottom quartile at 85 days. The gap is widening as channel mix shifts toward D2C (faster collections) and QC (longer settlements)",
          actionableStep:
            "Map working capital by channel and SKU category; target reducing dealer credit period from 45 to 30 days for slow-moving SKUs while maintaining terms for high-velocity products",
          urgency: "medium",
          relatedSignals: [
            "Havells D2C at 8% of revenue",
            "Crompton-Zepto pilot",
            "Quick commerce appliance listings",
          ],
        },
        {
          insight:
            "PLI compliance requires maintaining minimum domestic value addition thresholds -- companies falling below 40% threshold risk losing incentive claims worth 4-6% of incremental revenue",
          actionableStep:
            "Audit current domestic value addition percentage by product line; build buffer above 40% threshold by shifting 2-3 sub-assemblies from imported to domestic sourcing",
          urgency: "high",
          relatedSignals: [
            "Amber PLI capacity expansion",
            "Dixon EMS facility investment",
            "PLI Scheme Execution Momentum",
          ],
        },
        {
          insight:
            "Capacity utilization at newly commissioned PLI facilities running below 60% in first year -- fixed cost drag of INR 15-20 Cr annually until ramp-up to 75%+ utilization",
          actionableStep:
            "Aggressively pursue third-party contract manufacturing orders to fill capacity; target 75% utilization within 18 months of commissioning to break even on fixed costs",
          urgency: "medium",
          relatedSignals: [
            "Amber PLI capacity expansion",
            "Dixon EMS facility investment",
            "Goldman Sachs PE round",
          ],
        },
      ],
    },
    {
      persona: "Procurement Heads",
      takeaways: [
        {
          insight:
            "Copper prices at 18-month high with supply constraints from Chilean mine disruptions -- current spot premium of 12% over 3-month average suggests further upside risk to input costs",
          actionableStep:
            "Lock in 3-6 month copper forward contracts at current levels; shift 15-20% of copper wire sourcing to recycled copper suppliers (10-15% cost advantage, no quality compromise for non-critical components)",
          urgency: "high",
          relatedSignals: [
            "PLI Scheme Execution Momentum",
            "Mid-Tier Governance Risk",
            "Channel Disruption (Quick Commerce)",
          ],
        },
        {
          insight:
            "China+1 strategy creating new supplier options in Vietnam and Indonesia for compressor and motor assemblies -- 8-15% cost savings versus Chinese imports with lower tariff exposure",
          actionableStep:
            "Qualify 2-3 Vietnamese compressor suppliers for room AC product line; initiate 6-month parallel sourcing pilot before committing to full volume shift",
          urgency: "medium",
          relatedSignals: [
            "Amber PLI capacity expansion",
            "Dixon EMS facility investment",
            "PLI Scheme Execution Momentum",
          ],
        },
        {
          insight:
            "Kitchen appliances consolidation is creating procurement leverage -- combined entity volumes from Crompton-Butterfly and V-Guard-Sunflame mergers will shift supplier pricing power for stainless steel and glass components",
          actionableStep:
            "Pre-negotiate annual volume contracts with key glass and steel suppliers before merged entities renegotiate; lock in current pricing for 12 months with volume commitment",
          urgency: "medium",
          relatedSignals: [
            "Crompton-Butterfly deal",
            "V-Guard-Sunflame integration",
            "Kitchen Appliances M&A Velocity",
          ],
        },
        {
          insight:
            "Inventory carrying costs rising with interest rates -- sector average raw material inventory at 35 days versus best-in-class 22 days represents INR 15-25 Cr of locked working capital for mid-tier players",
          actionableStep:
            "Implement vendor-managed inventory (VMI) for top 5 suppliers covering 60% of spend; target reducing raw material inventory from 35 to 25 days within 2 quarters",
          urgency: "low",
          relatedSignals: [
            "Mid-Tier Governance Risk",
            "Kitchen Appliances M&A Velocity",
            "Channel Disruption (Quick Commerce)",
          ],
        },
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
      serviceLine: "Growth Strategy",
    },
    {
      signal: "Kitchen Appliances M&A Velocity",
      score: 7.8,
      trend: "up",
      context:
        "3 deals in single quarter is unprecedented for this sub-sector. Market is pricing in consolidation premium for remaining independent players. Window for value acquisition narrowing.",
      serviceLine: "M&A Advisory",
    },
    {
      signal: "Mid-Tier Governance Risk",
      score: 7.2,
      trend: "up",
      context:
        "Orient Electric + IFB Industries governance flags suggest systemic stress at promoter-group level for mid-tier players. Capital allocation discipline weakening under margin pressure.",
      serviceLine: "Turnaround",
    },
    {
      signal: "Channel Disruption (Quick Commerce)",
      score: 5.5,
      trend: "up",
      context:
        "Still nascent but growing fast from low base. Quick commerce for appliances is 6-12 months from being material (>2% of industry sales). Infrastructure (dark store density, delivery logistics for large items) still developing.",
      serviceLine: "Growth Strategy",
    },
  ],
};

export default data;
