import type { Company } from "../../types/company";

export const COMPANIES: Company[] = [
  {
    id: "voltas",
    name: "Voltas Limited",
    ticker: "VOLTAS",
    subSector: "Air Conditioning",
  },
  {
    id: "bluestar",
    name: "Blue Star Limited",
    ticker: "BLUESTAR",
    subSector: "Air Conditioning",
  },
  {
    id: "havells",
    name: "Havells India Limited",
    ticker: "HAVELLS",
    subSector: "Electrical Equipment",
  },
  {
    id: "crompton",
    name: "Crompton Greaves Consumer Electricals",
    ticker: "CROMPTON",
    subSector: "Electrical Equipment",
  },
  {
    id: "whirlpool",
    name: "Whirlpool of India Limited",
    ticker: "WHIRLPOOL",
    subSector: "Home Appliances",
  },
  {
    id: "symphony",
    name: "Symphony Limited",
    ticker: "SYMPHONY",
    subSector: "Air Conditioning",
  },
  {
    id: "orient",
    name: "Orient Electric Limited",
    ticker: "ORIENTELEC",
    subSector: "Electrical Equipment",
  },
  {
    id: "bajaj",
    name: "Bajaj Electricals Limited",
    ticker: "BAJAJELEC",
    subSector: "Electrical Equipment",
  },
  {
    id: "vguard",
    name: "V-Guard Industries Limited",
    ticker: "VGUARD",
    subSector: "Electrical Equipment",
  },
  {
    id: "ttk",
    name: "TTK Prestige Limited",
    ticker: "TTKPRESTIG",
    subSector: "Kitchen Appliances",
  },
  {
    id: "butterfly",
    name: "Butterfly Gandhimathi Appliances",
    ticker: "BUTTERFLY",
    subSector: "Kitchen Appliances",
  },
  {
    id: "amber",
    name: "Amber Enterprises India Limited",
    ticker: "AMBER",
    subSector: "Air Conditioning",
  },
  {
    id: "dixon",
    name: "Dixon Technologies (India) Limited",
    ticker: "DIXON",
    subSector: "Electronics Manufacturing",
  },
  {
    id: "jch",
    name: "Johnson Controls-Hitachi Air Conditioning",
    ticker: "JCHAC",
    subSector: "Air Conditioning",
  },
  {
    id: "daikin",
    name: "Daikin Airconditioning India",
    ticker: "DAIKIN",
    subSector: "Air Conditioning",
  },
  {
    id: "ifb",
    name: "IFB Industries Limited",
    ticker: "IFBIND",
    subSector: "Home Appliances",
  },
];

/** Unique sub-sector values derived from the company universe */
export const SUB_SECTORS: string[] = [
  ...new Set(COMPANIES.map((c) => c.subSector)),
].sort();

/** Look up a company by its unique ID */
export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}
