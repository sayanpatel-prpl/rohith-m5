import type { OperationalIntelligenceData } from "../../types/sections";

const data: OperationalIntelligenceData = {
  section: "operational-intelligence",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  supplyChainSignals: [
    {
      company: "amber",
      signal:
        "Secured 3-year compressor supply agreement with GMCC (Midea group); reduces China import dependency from 65% to 40%",
      impact: "positive",
      details:
        "Strategic shift toward dual-sourcing compressors (China + domestic). PLI incentive makes domestic assembly 8-12% more cost-competitive than full imports. Production line commissioning in Q4 FY25.",
    },
    {
      company: "dixon",
      signal:
        "Component shortage for PCB assemblies delaying washing machine ODM line by 6 weeks; chip allocation prioritized to mobile division",
      impact: "negative",
      details:
        "White goods OEM ramp-up delayed. Samsung contract delivery timeline pushed to Q1 FY26. Revenue recognition of ~INR 180 Cr shifts to next quarter.",
    },
    {
      company: "havells",
      signal:
        "6-month copper forward contracts locked at INR 745/kg vs current spot INR 812/kg; margin protection through Q4",
      impact: "positive",
      details:
        "Proactive hedging strategy gives Havells 1-quarter cost advantage over peers. Cable and wire segment margins expected to hold despite 12.5% YoY copper price increase.",
    },
    {
      company: "voltas",
      signal:
        "Shifting AC compressor sourcing from single-vendor (Highly) to three-vendor model; quality variability concerns in trial production",
      impact: "neutral",
      details:
        "Multi-vendor strategy reduces supply risk but initial quality control challenges expected. Warranty cost impact being assessed. Full transition expected by H1 FY26.",
    },
  ],
  manufacturingCapacity: [
    {
      company: "dixon",
      facility: "Noida EMS Plant - Phase 3",
      action: "expansion",
      investmentCr: 450,
      timeline: "Commissioning Q1 FY26",
    },
    {
      company: "amber",
      facility: "Rajasthan AC Component Hub",
      action: "greenfield",
      investmentCr: 320,
      timeline: "Land acquired, construction H1 FY26",
    },
    {
      company: "daikin",
      facility: "Neemrana Plant - Line 4",
      action: "expansion",
      investmentCr: 280,
      timeline: "Trial production Q4 FY25",
    },
    {
      company: "crompton",
      facility: "Goa Fans Plant",
      action: "rationalization",
      investmentCr: null,
      timeline: "Consolidation into Vadodara by Q2 FY26",
    },
  ],
  procurementShifts: [
    {
      category: "Compressors",
      shift:
        "China+1 sourcing strategy gaining traction; Turkey and Thailand emerging as alternative hubs",
      affectedCompanies: ["voltas", "bluestar", "amber"],
      impact:
        "5-8% cost increase in short-term during supplier qualification, but supply chain resilience improves. PLI incentives offset most of the cost premium for domestic assembly.",
    },
    {
      category: "Copper Wire & Rods",
      shift:
        "Shift to recycled copper (secondary market) for non-critical components; Havells and V-Guard piloting",
      affectedCompanies: ["havells", "vguard"],
      impact:
        "15-20% cost savings on secondary copper vs LME-grade. Quality suitable for non-winding applications. Sustainability reporting benefit as ESG becomes procurement criterion.",
    },
    {
      category: "Smart Controllers & IoT Modules",
      shift:
        "In-house development replacing imported Wi-Fi/Bluetooth modules; Symphony and Crompton building embedded teams",
      affectedCompanies: ["symphony", "crompton"],
      impact:
        "30-40% cost reduction on smart controller BOM once at scale. IP ownership enables faster feature iteration. Current investment of INR 15-25 Cr per company in R&D teams.",
    },
  ],
  retailFootprint: [
    {
      company: "havells",
      action: "expansion",
      storeCount: 85,
      geography: "Tier 2-3 cities (UP, MP, Rajasthan)",
      details:
        "Havells Galaxy store format expansion targeting semi-urban markets; average store size 800 sqft with full product display. INR 35-40 Lakh investment per store.",
    },
    {
      company: "bluestar",
      action: "expansion",
      storeCount: 42,
      geography: "South and West metro suburbs",
      details:
        "Blue Star exclusive experience centers for VRF and commercial AC solutions; targeting architects and interior designers as channel partners.",
    },
    {
      company: "orient",
      action: "rationalization",
      storeCount: 28,
      geography: "East India (Bihar, Jharkhand, Odisha)",
      details:
        "Closing underperforming exclusive brand outlets in East India; shifting to multi-brand retail partnerships to reduce fixed costs. Part of working capital improvement program.",
    },
    {
      company: "crompton",
      action: "reformat",
      storeCount: 120,
      geography: "Pan-India",
      details:
        "Converting Butterfly standalone stores into Crompton-Butterfly dual-brand outlets. Estimated 30% improvement in per-store economics through cross-selling fans + kitchen appliances.",
    },
  ],
};

export default data;
