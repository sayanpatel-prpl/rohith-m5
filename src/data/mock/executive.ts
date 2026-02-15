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
    },
    {
      text: "Copper and aluminium cost spikes compress margins by 150-200 bps across the board; companies with forward contracts (Havells, Amber) partially insulated",
      theme: "Input Cost Pressure",
      significance: "high",
    },
    {
      text: "PLI scheme tranche disbursements accelerate -- Dixon Technologies and Amber Enterprises report 30%+ capacity utilization gains from PLI-linked manufacturing",
      theme: "Policy Tailwind",
      significance: "medium",
    },
    {
      text: "D2C channel now represents 8-12% of revenue for Havells and Crompton; quick commerce partnerships (Blinkit, Zepto) emerging as new distribution frontier for small appliances",
      theme: "Channel Shift",
      significance: "medium",
    },
    {
      text: "Working capital stress emerging at mid-tier players -- Orient Electric and Butterfly Gandhimathi show 15+ day deterioration in receivable cycles, signaling dealer channel strain",
      theme: "Working Capital Stress",
      significance: "high",
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
      signal: "International subsidiary (?"Climate Technologies) reporting persistent losses; consolidated debt-equity at 0.45 vs standalone 0.08",
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
