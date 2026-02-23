import { describe, it, expect } from "vitest";
import {
  matchesCompany,
  matchesCompanyId,
  filterByCompany,
  filterByCompanyId,
  normalizeCompanyId,
} from "./company-matching";

describe("matchesCompany", () => {
  it("matches on first word of company name", () => {
    expect(
      matchesCompany(
        "Crompton Greaves Consumer",
        "Crompton Greaves Consumer Electricals",
        "crompton",
      ),
    ).toBe(true);
  });

  it("matches on company ID substring", () => {
    expect(
      matchesCompany(
        "Something crompton related",
        "Crompton Greaves Consumer Electricals",
        "crompton",
      ),
    ).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(
      matchesCompany(
        "AMBER Enterprises India",
        "Amber Enterprises India Limited",
        "amber",
      ),
    ).toBe(true);
  });

  it("returns false for non-matching field", () => {
    expect(
      matchesCompany("Voltas", "Amber Enterprises India Limited", "amber"),
    ).toBe(false);
  });
});

describe("matchesCompanyId", () => {
  it("matches exact lowercase ID", () => {
    expect(matchesCompanyId("amber", "amber")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(matchesCompanyId("Amber", "amber")).toBe(true);
  });

  it("does not do partial matching", () => {
    expect(matchesCompanyId("amber enterprises", "amber")).toBe(false);
  });
});

describe("filterByCompany", () => {
  const items = [
    { company: "Amber Enterprises" },
    { company: "Voltas" },
    { company: "Dixon Technologies" },
  ];

  it("filters to matching items", () => {
    const result = filterByCompany(
      items,
      (i) => i.company,
      "Amber Enterprises India Limited",
      "amber",
    );
    expect(result).toHaveLength(1);
    expect(result[0].company).toBe("Amber Enterprises");
  });

  it("returns empty array when no match", () => {
    const result = filterByCompany(
      items,
      (i) => i.company,
      "Havells India",
      "havells",
    );
    expect(result).toHaveLength(0);
  });
});

describe("filterByCompanyId", () => {
  const items = [
    { company: "amber" },
    { company: "dixon" },
    { company: "havells" },
  ];

  it("filters to exact match", () => {
    const result = filterByCompanyId(items, (i) => i.company, "amber");
    expect(result).toHaveLength(1);
    expect(result[0].company).toBe("amber");
  });

  it("is case-insensitive", () => {
    const result = filterByCompanyId(items, (i) => i.company, "Dixon");
    expect(result).toHaveLength(1);
    expect(result[0].company).toBe("dixon");
  });

  it("returns empty array when no match", () => {
    const result = filterByCompanyId(items, (i) => i.company, "voltas");
    expect(result).toHaveLength(0);
  });
});

describe("normalizeCompanyId", () => {
  it("normalizes lowercase canonical IDs", () => {
    expect(normalizeCompanyId("voltas")).toBe("voltas");
    expect(normalizeCompanyId("amber")).toBe("amber");
  });

  it("normalizes uppercase variants", () => {
    expect(normalizeCompanyId("AMBER")).toBe("amber");
    expect(normalizeCompanyId("VOLTAS")).toBe("voltas");
  });

  it("normalizes full display names", () => {
    expect(normalizeCompanyId("Voltas Ltd")).toBe("voltas");
    expect(normalizeCompanyId("Amber Enterprises India Limited")).toBe("amber");
    expect(normalizeCompanyId("Blue Star Limited")).toBe("bluestar");
  });

  it("normalizes ticker symbols", () => {
    expect(normalizeCompanyId("BAJAJELEC")).toBe("bajaj");
    expect(normalizeCompanyId("BLUESTARCO")).toBe("bluestar");
    expect(normalizeCompanyId("TTKPRESTIG")).toBe("ttk");
    expect(normalizeCompanyId("ORIENTELEC")).toBe("orient");
    expect(normalizeCompanyId("IFBIND")).toBe("ifb");
  });

  it("normalizes company names with extra whitespace", () => {
    expect(normalizeCompanyId("  Voltas  ")).toBe("voltas");
  });

  it("returns null for unknown company", () => {
    expect(normalizeCompanyId("Unknown Corp")).toBeNull();
    expect(normalizeCompanyId("")).toBeNull();
  });

  it("handles V-Guard with hyphen", () => {
    expect(normalizeCompanyId("V-Guard Industries")).toBe("vguard");
    expect(normalizeCompanyId("V-Guard")).toBe("vguard");
  });

  it("handles Crompton long name", () => {
    expect(normalizeCompanyId("Crompton Greaves Consumer Electricals")).toBe(
      "crompton",
    );
  });

  it("handles Whirlpool of India", () => {
    expect(normalizeCompanyId("Whirlpool of India")).toBe("whirlpool");
    expect(normalizeCompanyId("Whirlpool India")).toBe("whirlpool");
  });
});
