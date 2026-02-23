/**
 * Shared source attribution helpers with clickable URLs.
 *
 * Every data source gets a URL so users can click through to the original.
 * Used by all section adapters for consistent source metadata.
 */

import type { SourceInfo } from "@/types/source";

const SOURCE_URLS = {
  screener: "https://www.screener.in/",
  trendlyne: "https://trendlyne.com/",
  sovrenn: "https://sovrenn.com/",
} as const;

export function screenerSource(lastUpdated: string, label?: string): SourceInfo {
  return {
    source: label ?? "Screener.in consolidated financial data",
    confidence: "verified",
    tier: 1,
    lastUpdated,
    url: SOURCE_URLS.screener,
  };
}

export function financialApiSource(lastUpdated: string): SourceInfo {
  return {
    source: "Screener.in + Trendlyne aggregated metrics",
    confidence: "verified",
    tier: 1,
    lastUpdated,
    url: SOURCE_URLS.screener,
  };
}

export function trendlyneSource(lastUpdated: string, label?: string): SourceInfo {
  return {
    source: label ?? "Trendlyne market data",
    confidence: "verified",
    tier: 2,
    lastUpdated,
    url: SOURCE_URLS.trendlyne,
  };
}

export function sovrennSource(lastUpdated: string, label?: string): SourceInfo {
  return {
    source: label ?? "Sovrenn Intelligence curated analysis",
    confidence: "derived",
    tier: 3,
    lastUpdated,
    url: SOURCE_URLS.sovrenn,
  };
}

export function derivedSource(lastUpdated: string, label?: string): SourceInfo {
  return {
    source: label ?? "Cross-source derived analysis",
    confidence: "derived",
    tier: 4,
    lastUpdated,
  };
}

export function crossRefSource(lastUpdated: string): SourceInfo {
  return {
    source: "Cross-section derived analysis",
    confidence: "derived",
    tier: 4,
    lastUpdated,
  };
}
