import { kompeteBrand } from "./kompete";
import { bcgBrand } from "./bcg";
import { amBrand } from "./am";
import type { BrandConfig } from "./types";

const brandRegistry: Record<string, BrandConfig> = {
  kompete: kompeteBrand,
  bcg: bcgBrand,
  am: amBrand,
};

/** Resolve brand config from URL slug. Falls back to A&M for unknown slugs (A&M is default for this build). */
export function getBrandConfig(slug: string): BrandConfig {
  return brandRegistry[slug] ?? amBrand;
}

export type { BrandConfig };
