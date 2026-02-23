import type { ExecutiveSnapshotData } from "../../types/sections";

const data: ExecutiveSnapshotData = {
  section: "executive-snapshot",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  bullets: [
    {
      text: "Exceptional AC season drives 20%+ volume growth across top players; Voltas and Blue Star lead with premium segment expansion into Tier 2-3 cities",
      theme: "Demand Surge",
      significance: "high",
      narrative:
        "Strong AC demand creates capacity constraints -- companies scrambling to expand manufacturing represent immediate consulting opportunities for operational scale-up and distribution optimization. Tier 2-3 city expansion requires go-to-market advisory, channel partner structuring, and last-mile service network design for players without existing rural/semi-urban infrastructure.",
    },
    {
      text: "Copper and aluminium cost spikes compress margins by 150-200 bps across the board; companies with forward contracts (Havells, Amber) partially insulated",
      theme: "Input Cost Pressure",
      significance: "high",
      narrative:
        "Margin compression from raw materials creates urgency for cost optimization engagements. Companies without forward contracts (most mid-tier players) need procurement strategy and hedging advisory. This is a near-term window -- firms with 150+ bps margin erosion are actively seeking external expertise in commodity risk management and supply chain cost engineering.",
    },
    {
      text: "PLI scheme tranche disbursements accelerate -- Dixon Technologies and Amber Enterprises report 30%+ capacity utilization gains from PLI-linked manufacturing",
      theme: "Policy Tailwind",
      significance: "medium",
      narrative:
        "PLI scheme beneficiaries need M&A advisory for capacity acquisition and supply chain restructuring to meet production-linked incentive milestones. Companies approaching PLI thresholds represent high-probability advisory mandates -- they face 12-18 month deadlines to demonstrate incremental production, creating urgency for operational transformation and greenfield project management engagements.",
    },
    {
      text: "D2C channel now represents 8-12% of revenue for Havells and Crompton; quick commerce partnerships (Blinkit, Zepto) emerging as new distribution frontier for small appliances",
      theme: "Channel Shift",
      significance: "medium",
      narrative:
        "D2C and quick commerce transition creates demand for digital transformation advisory, direct channel economics modeling, and last-mile logistics optimization. Companies at 8-12% D2C penetration are at an inflection point -- scaling beyond 15% requires dedicated tech stack investment, warehouse-to-doorstep fulfillment redesign, and margin architecture rethinking that most consumer durables firms lack in-house capability for.",
    },
    {
      text: "Working capital stress emerging at mid-tier players -- Orient Electric and Butterfly Gandhimathi show 15+ day deterioration in receivable cycles, signaling dealer channel strain",
      theme: "Working Capital Stress",
      significance: "high",
      narrative:
        "Working capital deterioration signals potential restructuring or turnaround mandates. Companies with 60+ day receivable cycles may seek treasury optimization or trade finance advisory. Mid-tier players showing 15+ day deterioration are high-probability targets for cash flow improvement engagements, dealer financing restructuring, and in severe cases, strategic review or distressed asset advisory.",
    },
  ],
  redFlags: [
    {
      company: "Orient Electric",
      signal: "Promoter pledge increase from 12% to 19% in Q3; combined with 38-day receivable deterioration",
      confidence: "high",
      explanation:
        "Rising pledge levels alongside worsening working capital suggests liquidity pressure at the promoter group level. Monitor for potential stake sale or strategic review.",
    },
    {
      company: "Butterfly Gandhimathi",
      signal: "Third consecutive quarter of negative operating cash flow despite revenue growth of 8%",
      confidence: "high",
      explanation:
        "Revenue growth masking cash burn -- aggressive trade incentives and inventory build without matching collections. Crompton acquisition integration may accelerate restructuring.",
    },
    {
      company: "Whirlpool India",
      signal: "EBITDA margin contracted 340 bps YoY to 5.2%; lowest in 8 quarters despite 11% revenue growth",
      confidence: "medium",
      explanation:
        "Parent company's global cost optimization program not yet reflected in India operations. Mix shift toward lower-margin categories (washing machines) contributing to margin dilution.",
    },
    {
      company: "Symphony",
      signal: 'International subsidiary ("Climate Technologies") reporting persistent losses; consolidated debt-equity at 0.45 vs standalone 0.08',
      confidence: "medium",
      explanation:
        "Domestic air cooler business remains strong but international diversification dragging consolidated performance. Potential for subsidiary write-down or divestiture.",
    },
    {
      company: "IFB Industries",
      signal: "Auditor qualification on related-party transactions; independent director resignation in October 2024",
      confidence: "medium",
      explanation:
        "Governance signals warrant monitoring. IFB's engineering division transactions with promoter-linked entities flagged. Independent director departure reduces board oversight capacity.",
    },
  ],
};

export default data;
