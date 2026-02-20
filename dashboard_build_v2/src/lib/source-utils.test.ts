import { describe, it, expect } from "vitest";
import {
  getSourceForDataPoint,
  isHighConfidence,
  formatSourceDate,
} from "./source-utils";

describe("getSourceForDataPoint", () => {
  it("resolves screener to Screener.in with tier 1", () => {
    const source = getSourceForDataPoint("screener", "2026-02-18");
    expect(source.source).toBe("Screener.in");
    expect(source.tier).toBe(1);
    expect(source.confidence).toBe("verified");
    expect(source.lastUpdated).toBe("2026-02-18");
  });

  it("resolves trendlyne to Trendlyne with tier 1", () => {
    const source = getSourceForDataPoint("trendlyne", "2026-02-18");
    expect(source.source).toBe("Trendlyne");
    expect(source.tier).toBe(1);
  });

  it("resolves sovrenn to Sovrenn Intelligence with tier 3", () => {
    const source = getSourceForDataPoint("sovrenn", "2026-02-18");
    expect(source.source).toBe("Sovrenn Intelligence");
    expect(source.tier).toBe(3);
    expect(source.confidence).toBe("derived");
  });

  it("resolves case-insensitively", () => {
    const source = getSourceForDataPoint("Screener.in", "2026-02-18");
    expect(source.source).toBe("Screener.in");
    expect(source.tier).toBe(1);
  });

  it("resolves partial matches in source string", () => {
    const source = getSourceForDataPoint(
      "screener-all-companies.json",
      "2026-02-18",
    );
    expect(source.source).toBe("Screener.in");
    expect(source.tier).toBe(1);
  });

  it("NEVER returns a filename as source for known sources", () => {
    const source = getSourceForDataPoint(
      "sovrenn-intelligence.json",
      "2026-02-18",
    );
    expect(source.source).toBe("Sovrenn Intelligence");
    expect(source.source).not.toContain(".json");
  });

  it("strips file extensions from unknown sources", () => {
    const source = getSourceForDataPoint(
      "custom-data-file.json",
      "2026-02-18",
    );
    expect(source.source).not.toContain(".json");
  });

  it("returns tier 3 derived for unknown sources", () => {
    const source = getSourceForDataPoint("unknown-source", "2026-02-18");
    expect(source.tier).toBe(3);
    expect(source.confidence).toBe("derived");
  });

  it("resolves business media to tier 2", () => {
    const source = getSourceForDataPoint("Economic Times", "2026-02-18");
    expect(source.source).toBe("Economic Times");
    expect(source.tier).toBe(2);
    expect(source.confidence).toBe("verified");
  });
});

describe("isHighConfidence", () => {
  it("returns true for tier 1 verified", () => {
    expect(
      isHighConfidence({
        source: "Screener.in",
        tier: 1,
        confidence: "verified",
        lastUpdated: "2026-02-18",
      }),
    ).toBe(true);
  });

  it("returns true for tier 2 verified", () => {
    expect(
      isHighConfidence({
        source: "Economic Times",
        tier: 2,
        confidence: "verified",
        lastUpdated: "2026-02-18",
      }),
    ).toBe(true);
  });

  it("returns false for tier 3", () => {
    expect(
      isHighConfidence({
        source: "Sovrenn Intelligence",
        tier: 3,
        confidence: "derived",
        lastUpdated: "2026-02-18",
      }),
    ).toBe(false);
  });

  it("returns false for tier 1 with derived confidence", () => {
    expect(
      isHighConfidence({
        source: "Custom",
        tier: 1,
        confidence: "derived",
        lastUpdated: "2026-02-18",
      }),
    ).toBe(false);
  });
});

describe("formatSourceDate", () => {
  it("formats ISO date to readable format", () => {
    expect(formatSourceDate("2026-02-18")).toBe("Feb 18, 2026");
  });

  it("formats December date", () => {
    expect(formatSourceDate("2025-12-01")).toBe("Dec 1, 2025");
  });

  it("formats January date", () => {
    expect(formatSourceDate("2026-01-15")).toBe("Jan 15, 2026");
  });
});
