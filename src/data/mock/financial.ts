import type { FinancialPerformanceData } from "../../types/sections";

const data: FinancialPerformanceData = {
  section: "financial-performance",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  companies: [
    {
      id: "voltas",
      name: "Voltas Limited",
      ticker: "VOLTAS",
      metrics: {
        revenueGrowthYoY: 0.183,
        ebitdaMargin: 0.092,
        workingCapitalDays: 45,
        roce: 0.168,
        debtEquity: 0.12,
      },
      performance: "outperform",
      varianceAnalysis:
        "Strong AC season drove 18% revenue growth; margin expansion from operating leverage and premium mix shift. Working capital improved 5 days QoQ on better dealer collections.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "bluestar",
      name: "Blue Star Limited",
      ticker: "BLUESTAR",
      metrics: {
        revenueGrowthYoY: 0.215,
        ebitdaMargin: 0.078,
        workingCapitalDays: 62,
        roce: 0.195,
        debtEquity: 0.08,
      },
      performance: "outperform",
      varianceAnalysis:
        "Highest revenue growth in coverage universe at 21.5%; commercial AC segment outperforming residential. ROCE expansion driven by asset-light VRF distribution model.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "havells",
      name: "Havells India Limited",
      ticker: "HAVELLS",
      metrics: {
        revenueGrowthYoY: 0.142,
        ebitdaMargin: 0.118,
        workingCapitalDays: 28,
        roce: 0.245,
        debtEquity: 0.04,
      },
      performance: "outperform",
      varianceAnalysis:
        "Best-in-class EBITDA margin and ROCE; Lloyd AC brand gaining share. Lowest working capital days in peer set -- strong channel financing and cash management.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "crompton",
      name: "Crompton Greaves Consumer Electricals",
      ticker: "CROMPTON",
      metrics: {
        revenueGrowthYoY: 0.098,
        ebitdaMargin: 0.105,
        workingCapitalDays: 38,
        roce: 0.182,
        debtEquity: 0.22,
      },
      performance: "inline",
      varianceAnalysis:
        "Butterfly integration weighing on margins; core fans and lighting business stable. Revenue growth below peer average due to kitchen appliances transition.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "whirlpool",
      name: "Whirlpool of India Limited",
      ticker: "WHIRLPOOL",
      metrics: {
        revenueGrowthYoY: 0.112,
        ebitdaMargin: 0.052,
        workingCapitalDays: 55,
        roce: 0.098,
        debtEquity: 0.15,
      },
      performance: "underperform",
      varianceAnalysis:
        "EBITDA margin at 5.2% is lowest in 8 quarters; input cost pass-through lagging. Washing machine category margins under pressure from Korean competitors.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "symphony",
      name: "Symphony Limited",
      ticker: "SYMPHONY",
      metrics: {
        revenueGrowthYoY: 0.075,
        ebitdaMargin: 0.155,
        workingCapitalDays: 32,
        roce: 0.212,
        debtEquity: 0.08,
      },
      performance: "inline",
      varianceAnalysis:
        "Domestic air cooler margins remain sector-best at 15.5%; international subsidiary losses dragging consolidated performance. Revenue growth muted due to seasonal patterns.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "orient",
      name: "Orient Electric Limited",
      ticker: "ORIENTELEC",
      metrics: {
        revenueGrowthYoY: 0.065,
        ebitdaMargin: 0.068,
        workingCapitalDays: 72,
        roce: 0.095,
        debtEquity: 0.28,
      },
      performance: "underperform",
      varianceAnalysis:
        "Working capital deteriorated 15 days YoY; dealer channel stress visible. Fans category facing pricing pressure from unorganized segment. ROCE below cost of capital.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "bajaj",
      name: "Bajaj Electricals Limited",
      ticker: "BAJAJELEC",
      metrics: {
        revenueGrowthYoY: 0.088,
        ebitdaMargin: 0.072,
        workingCapitalDays: 58,
        roce: 0.112,
        debtEquity: 0.18,
      },
      performance: "inline",
      varianceAnalysis:
        "EPC demerger complete; consumer business showing gradual margin improvement. Morphy Richards brand relaunch contributing to premium mix but scale remains limited.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "vguard",
      name: "V-Guard Industries Limited",
      ticker: "VGUARD",
      metrics: {
        revenueGrowthYoY: 0.125,
        ebitdaMargin: 0.095,
        workingCapitalDays: 42,
        roce: 0.175,
        debtEquity: 0.1,
      },
      performance: "inline",
      varianceAnalysis:
        "Sunflame acquisition integration on track; combined distribution network driving 12.5% growth. South India stronghold being replicated in North -- early signs of success.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "ttk",
      name: "TTK Prestige Limited",
      ticker: "TTKPRESTIG",
      metrics: {
        revenueGrowthYoY: 0.055,
        ebitdaMargin: 0.135,
        workingCapitalDays: 35,
        roce: 0.225,
        debtEquity: 0.02,
      },
      performance: "inline",
      varianceAnalysis:
        "Premium kitchen appliances brand maintaining healthy margins; growth moderation due to base effect and urban demand softness. Near-zero leverage provides strategic flexibility.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "butterfly",
      name: "Butterfly Gandhimathi Appliances",
      ticker: "BUTTERFLY",
      metrics: {
        revenueGrowthYoY: 0.082,
        ebitdaMargin: 0.038,
        workingCapitalDays: 68,
        roce: 0.065,
        debtEquity: 0.32,
      },
      performance: "underperform",
      varianceAnalysis:
        "Third quarter of negative operating cash flow despite 8% revenue growth. Crompton integration costs and trade incentive overreach compressing margins. ROCE well below cost of capital.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "amber",
      name: "Amber Enterprises India Limited",
      ticker: "AMBER",
      metrics: {
        revenueGrowthYoY: 0.285,
        ebitdaMargin: 0.082,
        workingCapitalDays: 48,
        roce: 0.145,
        debtEquity: 0.35,
      },
      performance: "outperform",
      varianceAnalysis:
        "PLI scheme driving 28.5% revenue growth -- highest in coverage universe. OEM order book at record levels. Margin diluted by component mix but absolute EBITDA up 35% YoY.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "dixon",
      name: "Dixon Technologies (India) Limited",
      ticker: "DIXON",
      metrics: {
        revenueGrowthYoY: 0.325,
        ebitdaMargin: 0.045,
        workingCapitalDays: 25,
        roce: 0.265,
        debtEquity: 0.2,
      },
      performance: "outperform",
      varianceAnalysis:
        "32.5% revenue growth fueled by PLI-linked electronics manufacturing and new OEM wins. Thin margins typical of EMS model but ROCE exceptional at 26.5% due to asset efficiency.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "jch",
      name: "Johnson Controls-Hitachi Air Conditioning",
      ticker: "JCHAC",
      metrics: {
        revenueGrowthYoY: 0.095,
        ebitdaMargin: 0.062,
        workingCapitalDays: 52,
        roce: 0.088,
        debtEquity: 0.25,
      },
      performance: "underperform",
      varianceAnalysis:
        "Market share loss in residential AC to Voltas and Blue Star. Commercial segment holding but margins compressed by input costs. Parent company strategic review may lead to ownership change.",
      source: "BSE filing Q3 FY25",
    },
    {
      id: "daikin",
      name: "Daikin Airconditioning India",
      ticker: "DAIKIN",
      metrics: {
        revenueGrowthYoY: 0.168,
        ebitdaMargin: 0.108,
        workingCapitalDays: 40,
        roce: 0.198,
        debtEquity: 0.15,
      },
      performance: "outperform",
      varianceAnalysis:
        "Premium positioning insulates from price wars; 16.8% growth driven by VRF systems and inverter ACs. Neemrana manufacturing expansion adding capacity for next summer season.",
      source: "Industry estimates Q3 FY25",
    },
    {
      id: "ifb",
      name: "IFB Industries Limited",
      ticker: "IFBIND",
      metrics: {
        revenueGrowthYoY: 0.045,
        ebitdaMargin: 0.058,
        workingCapitalDays: 65,
        roce: 0.072,
        debtEquity: 0.38,
      },
      performance: "underperform",
      varianceAnalysis:
        "Weakest growth in coverage universe at 4.5%; IFB appliances losing share in front-load washers. Engineering division related-party concerns and auditor qualification add governance overhang.",
      source: "BSE filing Q3 FY25",
    },
  ],
};

export default data;
