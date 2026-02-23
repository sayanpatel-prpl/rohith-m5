import { kompeteBrand } from "./kompete";
import { bcgBrand } from "./bcg";
import { amBrand } from "./am";
import type { BrandConfig } from "./types";

const brandRegistry: Record<string, BrandConfig> = {
  kompete: kompeteBrand,
  bcg: bcgBrand,
  am: amBrand,
};

/** Resolve brand config from URL slug. Falls back to Kompete for unknown slugs. */
export function getBrandConfig(slug: string): BrandConfig {
  return brandRegistry[slug] ?? kompeteBrand;
}

export type { BrandConfig };
