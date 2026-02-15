import { pricioBrand } from "./pricio";
import { bcgBrand } from "./bcg";
import { amBrand } from "./am";
import type { BrandConfig } from "./types";

const brandRegistry: Record<string, BrandConfig> = {
  pricio: pricioBrand,
  bcg: bcgBrand,
  am: amBrand,
};

/** Resolve brand config from URL slug. Falls back to Pricio for unknown slugs. */
export function getBrandConfig(slug: string): BrandConfig {
  return brandRegistry[slug] ?? pricioBrand;
}

export type { BrandConfig };
