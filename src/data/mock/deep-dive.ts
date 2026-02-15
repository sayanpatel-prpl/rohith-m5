import type { SubSectorDeepDiveData } from "../../types/sections";

const data: SubSectorDeepDiveData = {
  section: "sub-sector-deep-dive",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  subSector: "Air Conditioning",
  costsBreakdown: [
    {
      costItem: "Compressor & Motor",
      sharePct: 38.5,
      trendVsPrior: "up",
      notes:
        "Compressor costs up 8% YoY driven by copper winding costs; import dependency on China (GMCC, Highly) remains at 55-60% for industry. Amber's domestic assembly provides 5-8% cost advantage.",
    },
    {
      costItem: "Heat Exchangers (Copper/Aluminium)",
      sharePct: 22.0,
      trendVsPrior: "up",
      notes:
        "Copper coil costs up 12.5% YoY; aluminium condenser adoption accelerating to manage costs. Blue Star and Daikin still copper-only for premium models.",
    },
    {
      costItem: "Sheet Metal & Plastics",
      sharePct: 15.5,
      trendVsPrior: "flat",
      notes:
        "Steel prices stabilizing after mid-year spike; ABS resin costs declining 3% QoQ. Net neutral impact on chassis and housing costs.",
    },
    {
      costItem: "Electronics & PCB",
      sharePct: 12.0,
      trendVsPrior: "down",
      notes:
        "Inverter controller PCB costs declining as domestic manufacturing scales; Dixon and Amber both producing controller boards. IoT module costs dropping 20% YoY.",
    },
    {
      costItem: "Assembly, Testing & Packaging",
      sharePct: 12.0,
      trendVsPrior: "up",
      notes:
        "Labor costs up 6-8% YoY; automation investment at Daikin and Voltas Beko plants partially offsetting. BIS testing and certification costs increasing with new energy efficiency standards.",
    },
  ],
  marginLevers: [
    {
      lever: "Inverter AC mix shift (non-inverter to inverter)",
      impactBps: 280,
      feasibility: "high",
      explanation:
        "Inverter ACs carry 250-300 bps higher gross margin. Industry mix at 72% inverter (up from 58% two years ago). Players below 70% inverter mix (JCH, Whirlpool) have largest upside.",
    },
    {
      lever: "Backward integration into compressor assembly",
      impactBps: 180,
      feasibility: "medium",
      explanation:
        "Amber's model shows 150-200 bps margin advantage from domestic compressor assembly vs full import. Requires INR 200-300 Cr capex per line. Voltas evaluating Beko JV for compressor production.",
    },
    {
      lever: "D2C channel expansion (bypassing dealer margin)",
      impactBps: 120,
      feasibility: "medium",
      explanation:
        "D2C eliminates 8-12% dealer margin on premium products. Currently 5-8% of AC sales are D2C; reaching 15% would deliver 100-150 bps margin improvement. Requires service network investment.",
    },
    {
      lever: "PLI incentive realization (4-6% of incremental production value)",
      impactBps: 150,
      feasibility: "high",
      explanation:
        "PLI incentive of 4-6% on incremental production directly flows to EBITDA. Amber and Dixon already claiming; Voltas and Blue Star approved but disbursement pending capacity commissioning.",
    },
  ],
  topQuartileAnalysis: [
    {
      metric: "EBITDA Margin",
      topQuartileValue: 11.5,
      medianValue: 8.2,
      bottomQuartileValue: 5.5,
      unit: "%",
      topPerformers: ["Daikin", "Havells (Lloyd)", "Symphony"],
    },
    {
      metric: "Working Capital Days",
      topQuartileValue: 32,
      medianValue: 48,
      bottomQuartileValue: 65,
      unit: "days",
      topPerformers: ["Havells", "TTK Prestige", "Daikin"],
    },
    {
      metric: "Revenue Growth (YoY)",
      topQuartileValue: 22.0,
      medianValue: 14.5,
      bottomQuartileValue: 7.5,
      unit: "%",
      topPerformers: ["Dixon", "Amber", "Blue Star"],
    },
  ],
};

export default data;
