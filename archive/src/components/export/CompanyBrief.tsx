import { getCompanyById } from "../../data/mock/companies";
import financialData from "../../data/mock/financial";
import dealsData from "../../data/mock/deals";
import leadershipData from "../../data/mock/leadership";
import operationsData from "../../data/mock/operations";
import watchlistData from "../../data/mock/watchlist";
import {
  matchesCompany,
  filterByCompany,
  filterByCompanyId,
} from "../../lib/company-matching";
import { CompanyBriefFinancials } from "./CompanyBriefFinancials";
import { CompanyBriefActivity } from "./CompanyBriefActivity";
import { CompanyBriefLeadership } from "./CompanyBriefLeadership";
import { CompanyBriefOperations } from "./CompanyBriefOperations";
import { CompanyBriefWatchlist } from "./CompanyBriefWatchlist";

interface CompanyBriefProps {
  companyId: string;
}

/**
 * Structured 1-page company brief aggregating data from all mock data sources.
 * Designed for print-readiness: clear section headers, compact layout, B&W friendly.
 */
export default function CompanyBrief({ companyId }: CompanyBriefProps) {
  const company = getCompanyById(companyId);
  if (!company) {
    return (
      <div className="text-text-secondary text-sm py-lg text-center">
        Company not found: {companyId}
      </div>
    );
  }

  // --- Data filtering ---
  const financialCompany = financialData.companies.find(
    (c) => c.id.toLowerCase() === companyId.toLowerCase(),
  );

  const companyDeals = dealsData.deals
    .filter((d) =>
      d.parties.some((p) => matchesCompany(p, company.name, companyId)),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const cxoChanges = filterByCompany(leadershipData.cxoChanges, (c) => c.company, company.name, companyId);
  const boardChanges = filterByCompany(leadershipData.boardReshuffles, (b) => b.company, company.name, companyId);
  const promoterChanges = filterByCompany(leadershipData.promoterStakeChanges, (p) => p.company, company.name, companyId);

  const supplyChainItems = filterByCompanyId(operationsData.supplyChainSignals, (s) => s.company, companyId);
  const mfgItems = filterByCompanyId(operationsData.manufacturingCapacity, (m) => m.company, companyId);
  const retailItems = filterByCompanyId(operationsData.retailFootprint, (r) => r.company, companyId);

  const fundraise = filterByCompany(watchlistData.fundraiseSignals, (f) => f.company, company.name, companyId);
  const marginInflection = filterByCompany(watchlistData.marginInflectionCandidates, (m) => m.company, company.name, companyId);
  const consolidation = filterByCompany(watchlistData.consolidationTargets, (c) => c.company, company.name, companyId);
  const stress = filterByCompany(watchlistData.stressIndicators, (s) => s.company, company.name, companyId);

  // --- Talking Points ---
  const talkingPoints: string[] = [];
  if (stress.length > 0) {
    talkingPoints.push("Explore turnaround advisory services -- stress signals detected in watchlist");
  }
  if (companyDeals.length > 0) {
    talkingPoints.push("Discuss deal integration support -- recent transaction activity observed");
  }
  if (mfgItems.some((m) => m.action === "expansion" || m.action === "greenfield")) {
    talkingPoints.push("Position capacity planning services -- manufacturing expansion underway");
  }
  if (marginInflection.length > 0) {
    talkingPoints.push("Present margin improvement frameworks -- company identified as margin inflection candidate");
  }
  if (fundraise.length > 0) {
    talkingPoints.push("Offer capital markets advisory -- active fundraise signals detected");
  }
  if (talkingPoints.length === 0) {
    talkingPoints.push("Review growth strategy alignment");
    talkingPoints.push("Discuss operational efficiency opportunities");
    talkingPoints.push("Explore partnership and advisory engagement models");
  }

  return (
    <div className="space-y-md" data-print-content>
      {/* Company Header */}
      <div className="border-b border-surface-overlay pb-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-text-primary">
              {company.name}
            </h2>
            <p className="text-xs text-text-secondary">
              {company.ticker} | {company.subSector}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-secondary">
              Data as of {financialData.dataAsOf}
            </p>
            <p className="text-[10px] text-text-secondary">
              Brief generated {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      <CompanyBriefFinancials financialCompany={financialCompany} />
      <CompanyBriefActivity deals={companyDeals} />
      <CompanyBriefLeadership cxoChanges={cxoChanges} boardChanges={boardChanges} promoterChanges={promoterChanges} />
      <CompanyBriefOperations supplyChainItems={supplyChainItems} mfgItems={mfgItems} retailItems={retailItems} />
      <CompanyBriefWatchlist fundraise={fundraise} marginInflection={marginInflection} consolidation={consolidation} stress={stress} />

      {/* Talking Points */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-xs">
          Talking Points
        </h3>
        <ul className="space-y-xs text-xs text-text-secondary list-none">
          {talkingPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-xs">
              <span className="shrink-0 text-brand-primary font-bold">{i + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
