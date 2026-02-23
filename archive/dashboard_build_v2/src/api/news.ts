/**
 * Public API surface for news data (NEWS-07)
 *
 * Re-exports all news functions from the data loader so consumers
 * can import from src/api/news.ts as the requirements specify.
 */

export {
  loadNewsItems,
  getNewsForSection,
  getNewsForCompany,
  isCorroborated,
  isContradicted,
} from "../data/loaders/news";
