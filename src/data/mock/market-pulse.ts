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
    },
    {
      channel: "Commercial HVAC",
      signal:
        "VRF system orders from IT parks and data centers surging; Blue Star and Daikin gaining from infrastructure buildout",
      direction: "up",
      magnitude: "+18% value YoY",
    },
    {
      channel: "Small Appliances (Quick Commerce)",
      signal:
        "Blinkit and Zepto listing mixer-grinders and irons; Havells, Crompton seeing 5-8% incremental volume through instant delivery",
      direction: "up",
      magnitude: "+35% QoQ (from low base)",
    },
    {
      channel: "Rural Electricals",
      signal:
        "Fans and water heater demand in rural markets flat; monsoon spending crowding out discretionary appliance purchases",
      direction: "flat",
      magnitude: "+2% volume YoY",
    },
  ],
  inputCosts: [
    {
      commodity: "Steel (HR Coil)",
      trend: "up",
      qoqChange: 0.045,
      yoyChange: 0.082,
    },
    {
      commodity: "Copper (LME)",
      trend: "up",
      qoqChange: 0.068,
      yoyChange: 0.125,
    },
    {
      commodity: "Plastics (ABS Resin)",
      trend: "down",
      qoqChange: -0.032,
      yoyChange: -0.015,
    },
    {
      commodity: "Aluminium (LME)",
      trend: "up",
      qoqChange: 0.052,
      yoyChange: 0.095,
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
};

export default data;
