import type { CompetitiveMovesData } from "../../types/sections";

const data: CompetitiveMovesData = {
  section: "competitive-moves",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  productLaunches: [
    {
      company: "Voltas",
      product: "Voltas Verdant 5-Star Inverter AC (1.5T)",
      category: "Air Conditioning",
      positioningNote:
        "First AC with R-32 refrigerant and recyclable body panels; targeting ESG-conscious commercial buyers. Price point 8% premium over standard 5-Star.",
      date: "2024-11-10",
    },
    {
      company: "Havells",
      product: "Lloyd Rapid Cool Window AC with IoT",
      category: "Air Conditioning",
      positioningNote:
        "Window AC segment re-entry with smart features; targeting Tier 3-4 cities where split AC penetration is below 15%. INR 28,000 price point.",
      date: "2024-12-05",
    },
    {
      company: "Dixon Technologies",
      product: "ODM Washing Machine Platform (7kg FL)",
      category: "Home Appliances",
      positioningNote:
        "White-label platform for brands lacking in-house washing machine manufacturing; Samsung India as anchor OEM customer. PLI-eligible production.",
      date: "2024-10-22",
    },
    {
      company: "TTK Prestige",
      product: "Prestige Regal Collection (Premium Cookware)",
      category: "Kitchen Appliances",
      positioningNote:
        "Ultra-premium cookware line targeting INR 5,000-15,000 price band; competing with imported brands like Le Creuset and Staub at 40% lower price.",
      date: "2024-11-28",
    },
    {
      company: "Crompton Greaves",
      product: "Crompton SilentPro BLDC Ceiling Fan",
      category: "Fans",
      positioningNote:
        "Below-40dB noise rating fan with 28W power consumption; targeting upgrade cycle in premium apartments. INR 4,500 MRP vs competition at INR 5,200+.",
      date: "2024-12-15",
    },
  ],
  pricingActions: [
    {
      company: "Voltas",
      action: "increase",
      category: "Split ACs",
      magnitudePct: 3.5,
      context:
        "3.5% price hike on 1T and 1.5T split ACs effective January 2025; passing through copper cost escalation. Blue Star followed with 2.8% within 2 weeks.",
    },
    {
      company: "Havells",
      action: "increase",
      category: "Cables & Wires",
      magnitudePct: 5.2,
      context:
        "5.2% price increase on housing wire and industrial cables; full copper cost pass-through. V-Guard matched within 1 week for South India markets.",
    },
    {
      company: "Crompton Greaves",
      action: "promotional",
      category: "Kitchen Appliances",
      magnitudePct: null,
      context:
        "Deep festival-season discounting on Butterfly-branded mixer-grinders (20-25% off MRP via Amazon/Flipkart); clearing pre-integration inventory.",
    },
    {
      company: "Blue Star",
      action: "decrease",
      category: "Commercial Refrigeration",
      magnitudePct: 4.0,
      context:
        "4% strategic price reduction on commercial refrigeration units; targeting quick commerce cold storage buildout (Blinkit, Zepto dark stores).",
    },
  ],
  d2cInitiatives: [
    {
      company: "Havells",
      initiative: "Havells.com relaunch with AR product visualization",
      channel: "Own website",
      status: "launched",
      details:
        "D2C sales now 8% of consumer revenue; AR feature lets customers visualize fans and lights in their rooms. Average order value 22% higher than marketplace orders.",
    },
    {
      company: "Crompton Greaves",
      initiative: "Crompton x Zepto 30-minute delivery pilot",
      channel: "Quick Commerce",
      status: "piloting",
      details:
        "Small appliances (irons, mixers, table fans) available via Zepto in 8 cities; testing consumer willingness to buy appliances on quick commerce. Early data shows 150+ orders/day across pilot cities.",
    },
    {
      company: "Symphony",
      initiative: "Symphony Direct subscription model for commercial coolers",
      channel: "B2B Direct",
      status: "announced",
      details:
        "Commercial air cooler leasing/subscription for event venues and factories; INR 2,500-5,000/month vs INR 35,000-60,000 purchase price. Targeting asset-light customers.",
    },
  ],
  qcPartnerships: [
    {
      company: "Havells",
      partner: "Blinkit",
      scope:
        "Small appliances (irons, kettles, room heaters) in 12 metro cities",
      status: "active",
    },
    {
      company: "Bajaj Electricals",
      partner: "Flipkart Quick",
      scope:
        "Emergency appliance replacement (geysers, fans) in 6 cities; 90-minute delivery promise",
      status: "active",
    },
    {
      company: "Crompton Greaves",
      partner: "Zepto",
      scope:
        "Full small appliance range in 8 cities; exclusive launch partnerships for new Butterfly products",
      status: "announced",
    },
  ],
  clusterAnalysis: [
    {
      cluster: "Premium Innovators",
      companies: ["Havells", "Voltas", "Blue Star", "Daikin"],
      characteristics:
        "High R&D spend (>2% of revenue), premium pricing power, strong brand equity, multi-channel distribution including D2C",
      outlook:
        "Well-positioned for margin expansion through premiumization; likely to gain share as BIS standards tighten and unorganized segment shrinks.",
    },
    {
      cluster: "Scale Manufacturers",
      companies: ["Amber Enterprises", "Dixon Technologies"],
      characteristics:
        "OEM/ODM model with thin margins but high asset turns, PLI beneficiaries, capacity-driven growth strategy",
      outlook:
        "Revenue growth outpacing sector but margin ceiling inherent in manufacturing services model. Value creation through scale and operational efficiency rather than brand premium.",
    },
    {
      cluster: "Turnaround Candidates",
      companies: [
        "Orient Electric",
        "Butterfly Gandhimathi",
        "IFB Industries",
      ],
      characteristics:
        "Sub-peer margins, governance concerns, working capital stress, potential for strategic ownership changes",
      outlook:
        "BD opportunity: These companies need operational consulting, financial restructuring advisory, or strategic options assessment. Highest engagement probability in next 6-12 months.",
    },
  ],
};

export default data;
