import type { DealsTransactionsData } from "../../types/sections";

const data: DealsTransactionsData = {
  section: "deals-transactions",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  deals: [
    {
      id: "deal-001",
      type: "M&A",
      parties: ["Crompton Greaves", "Butterfly Gandhimathi"],
      valueCr: 1432,
      rationale:
        "Crompton acquiring remaining Butterfly stake to consolidate kitchen appliances portfolio; integration expected to complete by Q1 FY26",
      date: "2024-11-15",
      source: "BSE Disclosure",
    },
    {
      id: "deal-002",
      type: "PE/VC",
      parties: ["Amber Enterprises", "Goldman Sachs Asset Management"],
      valueCr: 850,
      rationale:
        "Growth capital for PLI-linked capacity expansion; Amber raising funds to build 3 new component manufacturing lines for inverter ACs",
      date: "2024-12-02",
      source: "Economic Times",
    },
    {
      id: "deal-003",
      type: "M&A",
      parties: ["V-Guard Industries", "Sunflame Enterprises"],
      valueCr: 660,
      rationale:
        "V-Guard completing Sunflame integration; combined entity targets 15% kitchen appliances market share in South and West India",
      date: "2024-10-20",
      source: "BSE Disclosure",
    },
    {
      id: "deal-004",
      type: "PE/VC",
      parties: ["Dixon Technologies", "Alchemy Capital"],
      valueCr: 1200,
      rationale:
        "Funding new EMS facility in Noida for white goods OEM manufacturing; targeting Samsung and LG contract wins",
      date: "2024-12-18",
      source: "Mint",
    },
    {
      id: "deal-005",
      type: "distressed",
      parties: ["Orient Electric", "Potential Strategic Buyer (unnamed)"],
      valueCr: null,
      rationale:
        "CK Birla group exploring partial stake sale in Orient Electric amid promoter pledge concerns; discussions reportedly at early stage",
      date: "2025-01-05",
      source: "Business Standard (unnamed sources)",
    },
    {
      id: "deal-006",
      type: "IPO",
      parties: ["Daikin India"],
      valueCr: null,
      rationale:
        "Market speculation around Daikin India IPO at $2-3B valuation; parent Daikin Industries reportedly evaluating partial listing of India operations",
      date: "2025-01-10",
      source: "Moneycontrol (market speculation)",
    },
    {
      id: "deal-007",
      type: "M&A",
      parties: ["Havells India", "Small Appliance Startup (D2C brand)"],
      valueCr: 180,
      rationale:
        "Havells acquiring D2C kitchen appliance brand to accelerate online channel presence; acqui-hire of 40-person digital team",
      date: "2024-11-28",
      source: "YourStory",
    },
    {
      id: "deal-008",
      type: "PE/VC",
      parties: ["TTK Prestige", "GIC (Singapore)"],
      valueCr: 520,
      rationale:
        "GIC taking 4.5% stake via block deal; long-term bet on Indian premium kitchen appliances market growth",
      date: "2024-12-22",
      source: "NSE Block Deal",
    },
  ],
  aiPatterns: [
    {
      pattern: "Consolidation wave in kitchen appliances sub-sector",
      confidence: "high",
      supportingDeals: ["deal-001", "deal-003", "deal-007"],
      explanation:
        "Three separate deals targeting kitchen appliance brands in Q3 -- Crompton-Butterfly, V-Guard-Sunflame, and Havells D2C acquisition. Sub-sector approaching oligopoly structure with top 4 players controlling 65%+ share.",
    },
    {
      pattern: "PLI scheme driving strategic capital raises",
      confidence: "high",
      supportingDeals: ["deal-002", "deal-004"],
      explanation:
        "Both Amber and Dixon raising growth capital explicitly linked to PLI capacity expansion. Government incentive structure is attracting institutional capital to manufacturing scale-up -- expect more PE/VC deals in EMS and component segments.",
    },
    {
      pattern:
        "Emerging stress signals in mid-tier players may trigger ownership changes",
      confidence: "medium",
      supportingDeals: ["deal-005"],
      explanation:
        "Orient Electric stake sale discussions, combined with promoter pledge increases, suggest financial stress at CK Birla group level. Similar pattern observed at Symphony (international subsidiary losses) and IFB (governance flags). Watch for more distressed transactions in H2 FY25.",
    },
  ],
};

export default data;
