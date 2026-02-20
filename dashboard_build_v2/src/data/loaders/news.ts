/**
 * Data loader for news data (NEWS-02, NEWS-03, NEWS-04, NEWS-07)
 *
 * Loads news items when available, with anti-clickbait filtering at
 * the data layer (NEWS-02). Returns empty arrays gracefully when
 * no news data file exists.
 *
 * Exported functions are re-exported via src/api/news.ts for the
 * public API surface (NEWS-07).
 */

import type { NewsItem } from "../../types/news";
import type { SectionId } from "../../types/common";

// ---------------------------------------------------------------------------
// News data loading with graceful degradation
// ---------------------------------------------------------------------------

/**
 * Attempt to load news data. Returns empty array if no news file exists.
 * When the news JSON drops into @data, update this to import it.
 *
 * NEWS-02: Anti-clickbait filtering -- filters out items with
 * sourceCredibility === "low" at the data layer so they never reach UI.
 */
let _cachedItems: NewsItem[] | null = null;

export function loadNewsItems(): NewsItem[] {
  if (_cachedItems !== null) return _cachedItems;

  try {
    // News data file does not exist yet -- will be integrated when available.
    // When the file arrives, change this to:
    //   import rawNews from "@data/news-data.json";
    // and use it here.
    const rawItems: NewsItem[] = [];

    // NEWS-02: Anti-clickbait filtering at data layer
    _cachedItems = rawItems.filter(
      (item) => item.sourceCredibility !== "low",
    );

    return _cachedItems;
  } catch {
    // Graceful degradation: return empty array if loading fails
    _cachedItems = [];
    return _cachedItems;
  }
}

// ---------------------------------------------------------------------------
// Filtering functions
// ---------------------------------------------------------------------------

/**
 * Get news items relevant to a specific section.
 * Matches against the sectionIds field on each NewsItem.
 */
export function getNewsForSection(sectionId: SectionId): NewsItem[] {
  return loadNewsItems().filter((item) =>
    item.sectionIds.includes(sectionId),
  );
}

/**
 * Get news items relevant to a specific company.
 * Matches against the companyIds field on each NewsItem.
 */
export function getNewsForCompany(companyId: string): NewsItem[] {
  return loadNewsItems().filter((item) =>
    item.companyIds.includes(companyId),
  );
}

// ---------------------------------------------------------------------------
// Credibility helpers (NEWS-03, NEWS-04)
// ---------------------------------------------------------------------------

/**
 * NEWS-03: Check if a news item is corroborated by other sources.
 * Corroborated items have at least one entry in corroboratedBy.
 */
export function isCorroborated(item: NewsItem): boolean {
  return Array.isArray(item.corroboratedBy) && item.corroboratedBy.length > 0;
}

/**
 * NEWS-04: Check if a news item is contradicted by other sources.
 * Contradicted items have at least one entry in contradictedBy.
 */
export function isContradicted(item: NewsItem): boolean {
  return Array.isArray(item.contradictedBy) && item.contradictedBy.length > 0;
}
