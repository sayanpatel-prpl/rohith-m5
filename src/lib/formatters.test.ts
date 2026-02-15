import { describe, it, expect } from "vitest";
import {
  formatINRCr,
  formatINRLakh,
  formatINRAuto,
  formatPercent,
  formatBps,
  formatGrowthRate,
  formatIndianNumber,
} from "./formatters";

// ---------------------------------------------------------------------------
// formatINRCr
// ---------------------------------------------------------------------------

describe("formatINRCr", () => {
  it("formats 1500 Cr with Indian grouping", () => {
    expect(formatINRCr(1500)).toBe("INR 1,500 Cr");
  });

  it("formats fractional crore values", () => {
    expect(formatINRCr(0.5)).toBe("INR 0.5 Cr");
  });

  it("formats large values with Indian grouping", () => {
    // 15000 Cr -> "INR 15,000 Cr"
    expect(formatINRCr(15000)).toBe("INR 15,000 Cr");
  });
});

// ---------------------------------------------------------------------------
// formatINRLakh
// ---------------------------------------------------------------------------

describe("formatINRLakh", () => {
  it("formats lakh values", () => {
    expect(formatINRLakh(45.2)).toBe("INR 45.2 L");
  });

  it("formats whole lakh values", () => {
    expect(formatINRLakh(100)).toBe("INR 100 L");
  });
});

// ---------------------------------------------------------------------------
// formatINRAuto
// ---------------------------------------------------------------------------

describe("formatINRAuto", () => {
  it("uses Crore for values >= 1", () => {
    const result = formatINRAuto(1500);
    expect(result).toContain("INR");
    expect(result).toContain("Cr");
  });

  it("converts to Lakh for values < 1 Cr", () => {
    const result = formatINRAuto(0.5);
    expect(result).toContain("L");
  });

  it("handles exactly 1 Cr as Crore", () => {
    expect(formatINRAuto(1)).toContain("Cr");
  });
});

// ---------------------------------------------------------------------------
// formatPercent
// ---------------------------------------------------------------------------

describe("formatPercent", () => {
  it("formats positive percentage with plus sign", () => {
    expect(formatPercent(12.5)).toBe("+12.5%");
  });

  it("formats negative percentage with minus sign", () => {
    expect(formatPercent(-3.2)).toBe("-3.2%");
  });

  it("formats zero percentage without sign", () => {
    const result = formatPercent(0);
    expect(result).toContain("0");
    expect(result).toContain("%");
  });

  it("respects custom decimal places", () => {
    expect(formatPercent(12.567, 2)).toBe("+12.57%");
  });
});

// ---------------------------------------------------------------------------
// formatBps
// ---------------------------------------------------------------------------

describe("formatBps", () => {
  it("formats positive basis points", () => {
    expect(formatBps(180)).toBe("+180 bps");
  });

  it("formats negative basis points", () => {
    expect(formatBps(-50)).toBe("-50 bps");
  });

  it("formats zero basis points", () => {
    expect(formatBps(0)).toBe("0 bps");
  });
});

// ---------------------------------------------------------------------------
// formatGrowthRate
// ---------------------------------------------------------------------------

describe("formatGrowthRate", () => {
  it("formats positive growth rate with default YoY period", () => {
    expect(formatGrowthRate(0.125)).toBe("+12.5% YoY");
  });

  it("formats growth rate with explicit QoQ period", () => {
    expect(formatGrowthRate(0.125, "QoQ")).toBe("+12.5% QoQ");
  });

  it("formats negative growth rate", () => {
    const result = formatGrowthRate(-0.032);
    expect(result).toMatch(/^-/);
    expect(result).toContain("YoY");
  });
});

// ---------------------------------------------------------------------------
// formatIndianNumber
// ---------------------------------------------------------------------------

describe("formatIndianNumber", () => {
  it("formats with Indian grouping pattern", () => {
    // 150000 in Indian grouping: 1,50,000
    expect(formatIndianNumber(150000)).toBe("1,50,000");
  });

  it("formats small numbers without grouping", () => {
    expect(formatIndianNumber(999)).toBe("999");
  });

  it("formats large numbers with correct Indian grouping", () => {
    // 12345678 -> 1,23,45,678
    expect(formatIndianNumber(12345678)).toBe("1,23,45,678");
  });
});
