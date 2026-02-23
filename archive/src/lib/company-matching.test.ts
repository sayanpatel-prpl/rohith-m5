import { describe, it, expect } from "vitest";
import {
  matchesCompany,
  matchesCompanyId,
  filterByCompany,
  filterByCompanyId,
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
