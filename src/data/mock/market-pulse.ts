import type { MarketPulseData } from "../../types/sections";

const data: MarketPulseData = {
  section: "market-pulse",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  demandSignals: [
    {
      channel: "Residential AC",
      signal:
        "Early summer stocking at record levels; dealer inventories 25% above prior year across North and West India",
      direction: "up",
      magnitude: "+22% volume YoY",
      dataConfidence: "Verified",
    },
    {
      channel: "Commercial HVAC",
      signal:
        "VRF system orders from IT parks and data centers surging; Blue Star and Daikin gaining from infrastructure buildout",
      direction: "up",
      magnitude: "+18% value YoY",
      dataConfidence: "Verified",
    },
    {
      channel: "Small Appliances (Quick Commerce)",
      signal:
        "Blinkit and Zepto listing mixer-grinders and irons; Havells, Crompton seeing 5-8% incremental volume through instant delivery",
      direction: "up",
      magnitude: "+35% QoQ (from low base)",
      dataConfidence: "Management Guidance Interpretation",
    },
    {
      channel: "Rural Electricals",
      signal:
        "Fans and water heater demand in rural markets flat; monsoon spending crowding out discretionary appliance purchases",
      direction: "flat",
      magnitude: "+2% volume YoY",
      dataConfidence: "Management Guidance Interpretation",
    },
  ],
  inputCosts: [
    {
      commodity: "Steel (HR Coil)",
      trend: "up",
      qoqChange: 0.045,
      yoyChange: 0.082,
      amImplication:
        "Appliance chassis cost pressure -- monitor for margin squeeze in mid-tier players (Bajaj Electricals, Orient). CPI cost optimization engagement.",
    },
    {
      commodity: "Copper (LME)",
      trend: "up",
      qoqChange: 0.068,
      yoyChange: 0.125,
      amImplication:
        "AC and cable manufacturers (Havells, Polycab, RR Kabel) face 150-200 bps headwind. Import-dependent players at higher risk. Restructuring trigger if sustained.",
    },
    {
      commodity: "Plastics (ABS Resin)",
      trend: "down",
      qoqChange: -0.032,
      yoyChange: -0.015,
      amImplication:
        "Favorable for mixer-grinder/small appliance margins (TTK Prestige, Butterfly). Offsets partially for companies with high polymer content.",
    },
    {
      commodity: "Aluminium (LME)",
      trend: "up",
      qoqChange: 0.052,
      yoyChange: 0.095,
      amImplication:
        "Cooler and panel manufacturers impacted (Symphony, Orient fans). LME-linked pricing pass-through typically lags 1-2 quarters.",
    },
  ],
  inputCostHistory: [
    { period: "Q1 FY24", steel: 100, copper: 100, plastics: 100, aluminium: 100 },
    { period: "Q2 FY24", steel: 102, copper: 105, plastics: 101, aluminium: 103 },
    { period: "Q3 FY24", steel: 99,  copper: 108, plastics: 98,  aluminium: 106 },
    { period: "Q4 FY24", steel: 104, copper: 110, plastics: 96,  aluminium: 108 },
    { period: "Q1 FY25", steel: 106, copper: 112, plastics: 97,  aluminium: 111 },
    { period: "Q2 FY25", steel: 104, copper: 106, plastics: 99,  aluminium: 107 },
    { period: "Q3 FY25", steel: 108, copper: 113, plastics: 97,  aluminium: 110 },
  ],
  marginOutlook:
    "Copper and aluminium cost escalation creates 150-200 bps headwind for AC and cable manufacturers in Q4. Steel softening partially offsets for appliance chassis. Companies with forward contracts (Havells 6-month copper hedge, Amber 3-month aluminium) have 1-quarter buffer. Net margin compression of 80-120 bps likely across sector unless offset by premium mix shift or price increases. PLI disbursements provide partial cushion for Dixon, Amber, and select Havells segments.",
  channelMix: [
    {
      channel: "Modern Trade",
      currentSharePct: 28.5,
      previousSharePct: 26.2,
      trend: "up",
    },
    {
      channel: "General Trade",
      currentSharePct: 42.8,
      previousSharePct: 45.5,
      trend: "down",
    },
    {
      channel: "E-Commerce",
      currentSharePct: 18.2,
      previousSharePct: 17.8,
      trend: "up",
    },
    {
      channel: "D2C / Quick Commerce",
      currentSharePct: 10.5,
      previousSharePct: 10.5,
      trend: "flat",
    },
  ],
  amThoughtLeadership: {
    title: "Consumer & Retail: Navigating Disruption in India's Durables Market",
    summary:
      "A&M's Consumer Products practice analysis of margin dynamics, channel shift, and consolidation opportunities in Indian consumer durables. Key finding: companies with <8% EBITDA margin and rising input costs are prime turnaround candidates.",
    url: "https://www.alvarezandmarsal.com/insights/consumer-retail",
    source: "Alvarez & Marsal",
  },
  policyTracker: [
    {
      policy: "PLI Scheme for White Goods (ACs & LED Lights)",
      status: "active",
      impact:
        "INR 6,238 Cr incentive over 5 years; 60+ companies approved. Amber, Dixon, Havells, Voltas among major beneficiaries. Driving domestic component manufacturing and reducing China import dependence.",
      affectedCompanies: [
        "Amber Enterprises",
        "Dixon Technologies",
        "Havells India",
        "Voltas",
        "Blue Star",
        "Daikin India",
      ],
    },
    {
      policy: "BIS Quality Standards for Room ACs (IS 1391:2025)",
      status: "upcoming",
      impact:
        "Mandatory BIS certification for all room ACs from July 2025. Will eliminate sub-standard imports and unorganized players. Benefits organized manufacturers with testing infrastructure.",
      affectedCompanies: [
        "Voltas",
        "Blue Star",
        "Daikin India",
        "Amber Enterprises",
        "Havells India",
      ],
    },
    {
      policy: "BEE Star Rating Revision for ACs and Refrigerators",
      status: "active",
      impact:
        "Updated energy efficiency norms effective Jan 2025. Forces product redesign for base models; R&D cost increase of 3-5% for compliance. Premium players (Daikin, Blue Star) already compliant; mid-tier (Orient, Bajaj) need investment.",
      affectedCompanies: [
        "Orient Electric",
        "Bajaj Electricals",
        "Crompton Greaves",
        "Voltas",
        "Blue Star",
      ],
    },
  ],
  seasonalPatterns: [
    {
      pattern: "Summer Stocking Cycle",
      timing: "March - May",
      implication:
        "AC and cooler manufacturers see 40-50% of annual revenue in this window. Channel partners begin inventory build from February. Early/late onset of summer directly impacts quarterly results. Monitor weather forecasts and dealer inventory levels for demand signals.",
    },
    {
      pattern: "Festival Season Demand Surge",
      timing: "October - November",
      implication:
        "Premium appliances (kitchen, water purifiers) see 25-30% of annual sales during Navratri-Diwali. Companies front-load marketing spend in September. Weak festival demand is a leading indicator of consumer sentiment deterioration.",
    },
  ],
};

export default data;
