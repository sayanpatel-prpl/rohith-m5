import type { FinancialPerformanceData } from "../../types/sections";
import type { QuarterlySnapshot } from "../../types/financial";

// Helper type alias for readability
type History = QuarterlySnapshot[];

// ---------------------------------------------------------------------------
// Outperformers: improving trends over 6 quarters
// ---------------------------------------------------------------------------

const voltasHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.115, ebitdaMargin: 0.072, workingCapitalDays: 56, roce: 0.128, debtEquity: 0.18 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.128, ebitdaMargin: 0.075, workingCapitalDays: 54, roce: 0.135, debtEquity: 0.17 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.142, ebitdaMargin: 0.080, workingCapitalDays: 52, roce: 0.142, debtEquity: 0.16 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.158, ebitdaMargin: 0.085, workingCapitalDays: 50, roce: 0.152, debtEquity: 0.14 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.172, ebitdaMargin: 0.088, workingCapitalDays: 48, roce: 0.162, debtEquity: 0.13 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.183, ebitdaMargin: 0.092, workingCapitalDays: 45, roce: 0.168, debtEquity: 0.12 },
];

const bluestarHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.145, ebitdaMargin: 0.062, workingCapitalDays: 70, roce: 0.152, debtEquity: 0.12 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.158, ebitdaMargin: 0.065, workingCapitalDays: 68, roce: 0.160, debtEquity: 0.11 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.175, ebitdaMargin: 0.068, workingCapitalDays: 66, roce: 0.170, debtEquity: 0.10 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.190, ebitdaMargin: 0.072, workingCapitalDays: 65, roce: 0.178, debtEquity: 0.09 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.205, ebitdaMargin: 0.075, workingCapitalDays: 63, roce: 0.188, debtEquity: 0.09 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.215, ebitdaMargin: 0.078, workingCapitalDays: 62, roce: 0.195, debtEquity: 0.08 },
];

const havellsHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.098, ebitdaMargin: 0.102, workingCapitalDays: 34, roce: 0.210, debtEquity: 0.06 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.108, ebitdaMargin: 0.105, workingCapitalDays: 33, roce: 0.218, debtEquity: 0.06 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.118, ebitdaMargin: 0.108, workingCapitalDays: 31, roce: 0.225, debtEquity: 0.05 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.125, ebitdaMargin: 0.112, workingCapitalDays: 30, roce: 0.232, debtEquity: 0.05 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.135, ebitdaMargin: 0.115, workingCapitalDays: 29, roce: 0.238, debtEquity: 0.04 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.142, ebitdaMargin: 0.118, workingCapitalDays: 28, roce: 0.245, debtEquity: 0.04 },
];

const amberHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.185, ebitdaMargin: 0.068, workingCapitalDays: 55, roce: 0.108, debtEquity: 0.42 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.205, ebitdaMargin: 0.070, workingCapitalDays: 53, roce: 0.115, debtEquity: 0.40 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.228, ebitdaMargin: 0.073, workingCapitalDays: 52, roce: 0.122, debtEquity: 0.39 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.248, ebitdaMargin: 0.076, workingCapitalDays: 50, roce: 0.130, debtEquity: 0.37 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.268, ebitdaMargin: 0.079, workingCapitalDays: 49, roce: 0.138, debtEquity: 0.36 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.285, ebitdaMargin: 0.082, workingCapitalDays: 48, roce: 0.145, debtEquity: 0.35 },
];

const dixonHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.225, ebitdaMargin: 0.038, workingCapitalDays: 30, roce: 0.218, debtEquity: 0.25 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.248, ebitdaMargin: 0.039, workingCapitalDays: 29, roce: 0.228, debtEquity: 0.24 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.268, ebitdaMargin: 0.041, workingCapitalDays: 28, roce: 0.238, debtEquity: 0.23 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.290, ebitdaMargin: 0.042, workingCapitalDays: 27, roce: 0.248, debtEquity: 0.22 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.308, ebitdaMargin: 0.043, workingCapitalDays: 26, roce: 0.255, debtEquity: 0.21 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.325, ebitdaMargin: 0.045, workingCapitalDays: 25, roce: 0.265, debtEquity: 0.20 },
];

const daikinHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.118, ebitdaMargin: 0.092, workingCapitalDays: 46, roce: 0.162, debtEquity: 0.19 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.128, ebitdaMargin: 0.095, workingCapitalDays: 45, roce: 0.168, debtEquity: 0.18 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.138, ebitdaMargin: 0.098, workingCapitalDays: 44, roce: 0.175, debtEquity: 0.17 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.148, ebitdaMargin: 0.102, workingCapitalDays: 42, roce: 0.182, debtEquity: 0.17 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.158, ebitdaMargin: 0.105, workingCapitalDays: 41, roce: 0.190, debtEquity: 0.16 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.168, ebitdaMargin: 0.108, workingCapitalDays: 40, roce: 0.198, debtEquity: 0.15 },
];

// ---------------------------------------------------------------------------
// Inline: stable/mixed trends over 6 quarters
// ---------------------------------------------------------------------------

const cromptonHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.105, ebitdaMargin: 0.112, workingCapitalDays: 35, roce: 0.192, debtEquity: 0.20 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.095, ebitdaMargin: 0.108, workingCapitalDays: 37, roce: 0.188, debtEquity: 0.21 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.102, ebitdaMargin: 0.110, workingCapitalDays: 36, roce: 0.185, debtEquity: 0.21 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.092, ebitdaMargin: 0.106, workingCapitalDays: 39, roce: 0.180, debtEquity: 0.22 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.100, ebitdaMargin: 0.108, workingCapitalDays: 37, roce: 0.184, debtEquity: 0.22 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.098, ebitdaMargin: 0.105, workingCapitalDays: 38, roce: 0.182, debtEquity: 0.22 },
];

const symphonyHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.082, ebitdaMargin: 0.148, workingCapitalDays: 30, roce: 0.208, debtEquity: 0.09 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.068, ebitdaMargin: 0.152, workingCapitalDays: 33, roce: 0.215, debtEquity: 0.09 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.078, ebitdaMargin: 0.150, workingCapitalDays: 31, roce: 0.210, debtEquity: 0.08 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.072, ebitdaMargin: 0.158, workingCapitalDays: 34, roce: 0.218, debtEquity: 0.08 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.080, ebitdaMargin: 0.152, workingCapitalDays: 30, roce: 0.210, debtEquity: 0.08 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.075, ebitdaMargin: 0.155, workingCapitalDays: 32, roce: 0.212, debtEquity: 0.08 },
];

const bajajHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.075, ebitdaMargin: 0.062, workingCapitalDays: 62, roce: 0.098, debtEquity: 0.20 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.082, ebitdaMargin: 0.065, workingCapitalDays: 60, roce: 0.102, debtEquity: 0.19 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.078, ebitdaMargin: 0.068, workingCapitalDays: 61, roce: 0.105, debtEquity: 0.19 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.085, ebitdaMargin: 0.070, workingCapitalDays: 59, roce: 0.108, debtEquity: 0.18 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.090, ebitdaMargin: 0.068, workingCapitalDays: 57, roce: 0.110, debtEquity: 0.18 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.088, ebitdaMargin: 0.072, workingCapitalDays: 58, roce: 0.112, debtEquity: 0.18 },
];

const vguardHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.108, ebitdaMargin: 0.088, workingCapitalDays: 45, roce: 0.158, debtEquity: 0.12 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.112, ebitdaMargin: 0.090, workingCapitalDays: 44, roce: 0.162, debtEquity: 0.11 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.118, ebitdaMargin: 0.092, workingCapitalDays: 43, roce: 0.168, debtEquity: 0.11 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.122, ebitdaMargin: 0.091, workingCapitalDays: 44, roce: 0.170, debtEquity: 0.10 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.128, ebitdaMargin: 0.093, workingCapitalDays: 43, roce: 0.172, debtEquity: 0.10 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.125, ebitdaMargin: 0.095, workingCapitalDays: 42, roce: 0.175, debtEquity: 0.10 },
];

const ttkHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.068, ebitdaMargin: 0.128, workingCapitalDays: 38, roce: 0.215, debtEquity: 0.03 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.062, ebitdaMargin: 0.132, workingCapitalDays: 36, roce: 0.220, debtEquity: 0.03 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.058, ebitdaMargin: 0.130, workingCapitalDays: 37, roce: 0.218, debtEquity: 0.02 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.052, ebitdaMargin: 0.135, workingCapitalDays: 34, roce: 0.222, debtEquity: 0.02 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.060, ebitdaMargin: 0.132, workingCapitalDays: 36, roce: 0.220, debtEquity: 0.02 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.055, ebitdaMargin: 0.135, workingCapitalDays: 35, roce: 0.225, debtEquity: 0.02 },
];

// ---------------------------------------------------------------------------
// Underperformers: deteriorating trends over 6 quarters
// ---------------------------------------------------------------------------

const whirlpoolHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.135, ebitdaMargin: 0.078, workingCapitalDays: 48, roce: 0.128, debtEquity: 0.12 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.128, ebitdaMargin: 0.072, workingCapitalDays: 50, roce: 0.118, debtEquity: 0.13 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.122, ebitdaMargin: 0.068, workingCapitalDays: 51, roce: 0.112, debtEquity: 0.13 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.118, ebitdaMargin: 0.062, workingCapitalDays: 53, roce: 0.105, debtEquity: 0.14 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.115, ebitdaMargin: 0.058, workingCapitalDays: 54, roce: 0.100, debtEquity: 0.15 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.112, ebitdaMargin: 0.052, workingCapitalDays: 55, roce: 0.098, debtEquity: 0.15 },
];

const orientHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.098, ebitdaMargin: 0.088, workingCapitalDays: 58, roce: 0.125, debtEquity: 0.22 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.092, ebitdaMargin: 0.085, workingCapitalDays: 60, roce: 0.118, debtEquity: 0.23 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.085, ebitdaMargin: 0.080, workingCapitalDays: 63, roce: 0.112, debtEquity: 0.24 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.078, ebitdaMargin: 0.075, workingCapitalDays: 66, roce: 0.105, debtEquity: 0.26 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.072, ebitdaMargin: 0.072, workingCapitalDays: 69, roce: 0.098, debtEquity: 0.27 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.065, ebitdaMargin: 0.068, workingCapitalDays: 72, roce: 0.095, debtEquity: 0.28 },
];

const butterflyHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.108, ebitdaMargin: 0.058, workingCapitalDays: 58, roce: 0.092, debtEquity: 0.26 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.102, ebitdaMargin: 0.055, workingCapitalDays: 60, roce: 0.085, debtEquity: 0.27 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.095, ebitdaMargin: 0.050, workingCapitalDays: 62, roce: 0.080, debtEquity: 0.28 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.090, ebitdaMargin: 0.045, workingCapitalDays: 64, roce: 0.075, debtEquity: 0.30 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.085, ebitdaMargin: 0.042, workingCapitalDays: 66, roce: 0.070, debtEquity: 0.31 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.082, ebitdaMargin: 0.038, workingCapitalDays: 68, roce: 0.065, debtEquity: 0.32 },
];

const jchHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.125, ebitdaMargin: 0.082, workingCapitalDays: 46, roce: 0.115, debtEquity: 0.20 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.118, ebitdaMargin: 0.078, workingCapitalDays: 47, roce: 0.108, debtEquity: 0.21 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.112, ebitdaMargin: 0.075, workingCapitalDays: 48, roce: 0.102, debtEquity: 0.22 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.105, ebitdaMargin: 0.070, workingCapitalDays: 50, roce: 0.095, debtEquity: 0.23 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.098, ebitdaMargin: 0.065, workingCapitalDays: 51, roce: 0.092, debtEquity: 0.24 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.095, ebitdaMargin: 0.062, workingCapitalDays: 52, roce: 0.088, debtEquity: 0.25 },
];

const ifbHistory: History = [
  { period: "Q2 FY24", revenueGrowthYoY: 0.078, ebitdaMargin: 0.075, workingCapitalDays: 58, roce: 0.098, debtEquity: 0.32 },
  { period: "Q3 FY24", revenueGrowthYoY: 0.072, ebitdaMargin: 0.072, workingCapitalDays: 59, roce: 0.092, debtEquity: 0.33 },
  { period: "Q4 FY24", revenueGrowthYoY: 0.065, ebitdaMargin: 0.068, workingCapitalDays: 61, roce: 0.088, debtEquity: 0.34 },
  { period: "Q1 FY25", revenueGrowthYoY: 0.058, ebitdaMargin: 0.065, workingCapitalDays: 62, roce: 0.082, debtEquity: 0.36 },
  { period: "Q2 FY25", revenueGrowthYoY: 0.052, ebitdaMargin: 0.060, workingCapitalDays: 64, roce: 0.078, debtEquity: 0.37 },
  { period: "Q3 FY25", revenueGrowthYoY: 0.045, ebitdaMargin: 0.058, workingCapitalDays: 65, roce: 0.072, debtEquity: 0.38 },
];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

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
      history: voltasHistory,
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
      history: bluestarHistory,
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
      history: havellsHistory,
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
      history: cromptonHistory,
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
      history: whirlpoolHistory,
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
      history: symphonyHistory,
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
      history: orientHistory,
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
      history: bajajHistory,
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
      history: vguardHistory,
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
      history: ttkHistory,
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
      history: butterflyHistory,
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
      history: amberHistory,
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
      history: dixonHistory,
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
      history: jchHistory,
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
      history: daikinHistory,
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
      history: ifbHistory,
    },
  ],
};

export default data;
