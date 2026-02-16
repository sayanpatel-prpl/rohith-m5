import { getCompanyById } from "../../data/mock/companies";
import financialData from "../../data/mock/financial";
import dealsData from "../../data/mock/deals";
import leadershipData from "../../data/mock/leadership";
import operationsData from "../../data/mock/operations";
import watchlistData from "../../data/mock/watchlist";
import { PerformanceTag } from "../ui/PerformanceTag";
import {
  formatGrowthRate,
  formatPercent,
  formatINRCr,
  formatDate,
} from "../../lib/formatters";

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

  // --- Financial data ---
  const financialCompany = financialData.companies.find(
    (c) => c.id.toLowerCase() === companyId.toLowerCase(),
  );

  // --- Deals data ---
  const companyDeals = dealsData.deals
    .filter((d) =>
      d.parties.some(
        (p) =>
          p.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()) ||
          p.toLowerCase().includes(companyId.toLowerCase()),
      ),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // --- Leadership data ---
  const cxoChanges = leadershipData.cxoChanges.filter(
    (c) =>
      c.company.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()) ||
      c.company.toLowerCase().includes(companyId.toLowerCase()),
  );
  const boardChanges = leadershipData.boardReshuffles.filter(
    (b) =>
      b.company.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()) ||
      b.company.toLowerCase().includes(companyId.toLowerCase()),
  );
  const promoterChanges = leadershipData.promoterStakeChanges.filter(
    (p) =>
      p.company.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()) ||
      p.company.toLowerCase().includes(companyId.toLowerCase()),
  );
  const hasGovernanceEvents =
    cxoChanges.length > 0 || boardChanges.length > 0 || promoterChanges.length > 0;

  // --- Operations data ---
  const supplyChainItems = operationsData.supplyChainSignals.filter(
    (s) => s.company.toLowerCase() === companyId.toLowerCase(),
  );
  const mfgItems = operationsData.manufacturingCapacity.filter(
    (m) => m.company.toLowerCase() === companyId.toLowerCase(),
  );
  const retailItems = operationsData.retailFootprint.filter(
    (r) => r.company.toLowerCase() === companyId.toLowerCase(),
  );
  const hasOperationalSignals =
    supplyChainItems.length > 0 || mfgItems.length > 0 || retailItems.length > 0;

  // --- Watchlist data ---
  const fundraise = watchlistData.fundraiseSignals.filter(
    (f) =>
      f.company.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()) ||
      f.company.toLowerCase().includes(companyId.toLowerCase()),
  );
  const marginInflection = watchlistData.marginInflectionCandidates.filter(
    (m) =>
      m.company.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()) ||
      m.company.toLowerCase().includes(companyId.toLowerCase()),
  );
  const consolidation = watchlistData.consolidationTargets.filter(
    (c) =>
      c.company.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()) ||
      c.company.toLowerCase().includes(companyId.toLowerCase()),
  );
  const stress = watchlistData.stressIndicators.filter(
    (s) =>
      s.company.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()) ||
      s.company.toLowerCase().includes(companyId.toLowerCase()),
  );
  const hasWatchlistSignals =
    fundraise.length > 0 ||
    marginInflection.length > 0 ||
    consolidation.length > 0 ||
    stress.length > 0;

  // --- Talking Points (conditional logic based on data) ---
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

  const SEVERITY_STYLES: Record<string, string> = {
    critical: "bg-negative/10 text-negative",
    warning: "bg-brand-accent/10 text-brand-accent",
    watch: "bg-neutral/10 text-neutral",
  };

  const IMPACT_STYLES: Record<string, string> = {
    positive: "text-positive",
    negative: "text-negative",
    neutral: "text-neutral",
  };

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

      {/* Financial Snapshot */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-xs flex items-center gap-sm">
          Financial Snapshot
          {financialCompany && (
            <PerformanceTag level={financialCompany.performance} compact />
          )}
        </h3>
        {financialCompany ? (
          <div className="grid grid-cols-5 gap-sm">
            <MetricCard
              label="Revenue Growth"
              value={formatGrowthRate(financialCompany.metrics.revenueGrowthYoY)}
            />
            <MetricCard
              label="EBITDA Margin"
              value={formatPercent(financialCompany.metrics.ebitdaMargin * 100)}
            />
            <MetricCard
              label="Working Capital"
              value={`${financialCompany.metrics.workingCapitalDays} days`}
            />
            <MetricCard
              label="ROCE"
              value={formatPercent(financialCompany.metrics.roce * 100)}
            />
            <MetricCard
              label="Debt/Equity"
              value={`${financialCompany.metrics.debtEquity.toFixed(2)}x`}
            />
          </div>
        ) : (
          <p className="text-xs text-text-secondary italic">
            No financial data available
          </p>
        )}
        {financialCompany?.varianceAnalysis && (
          <p className="text-xs text-text-secondary mt-xs leading-relaxed">
            {financialCompany.varianceAnalysis}
          </p>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-xs">
          Recent Activity
        </h3>
        {companyDeals.length > 0 ? (
          <div className="space-y-xs">
            {companyDeals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-start gap-sm text-xs border-l-2 border-brand-primary/30 pl-sm"
              >
                <span className="shrink-0 font-medium text-text-primary w-12">
                  {deal.type}
                </span>
                <span className="shrink-0 text-text-secondary w-20">
                  {formatDate(deal.date)}
                </span>
                <span className="text-text-secondary">
                  {deal.rationale.length > 120
                    ? deal.rationale.slice(0, 120) + "..."
                    : deal.rationale}
                  {deal.valueCr != null && (
                    <span className="font-medium text-text-primary ml-xs">
                      ({formatINRCr(deal.valueCr)})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-secondary italic">
            No recent deal activity
          </p>
        )}
      </section>

      {/* Leadership & Governance */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-xs">
          Leadership & Governance
        </h3>
        {hasGovernanceEvents ? (
          <div className="space-y-xs text-xs">
            {cxoChanges.map((c, i) => (
              <div key={`cxo-${i}`} className="border-l-2 border-brand-accent/30 pl-sm">
                <span className="font-medium text-text-primary">{c.role}:</span>{" "}
                <span className="text-text-secondary">
                  {c.outgoing && `${c.outgoing} \u2192 `}
                  {c.incoming ?? "Vacant"}
                  {" ("}
                  {formatDate(c.effectiveDate)}
                  {")"}
                </span>
              </div>
            ))}
            {boardChanges.map((b, i) => (
              <div key={`board-${i}`} className="border-l-2 border-neutral/30 pl-sm text-text-secondary">
                Board: {b.change}
              </div>
            ))}
            {promoterChanges.map((p, i) => (
              <div key={`promo-${i}`} className="border-l-2 border-neutral/30 pl-sm text-text-secondary">
                Promoter ({p.promoterGroup}): {p.currentPct.toFixed(1)}%
                {p.changePct !== 0 && (
                  <span className={p.changePct < 0 ? "text-negative" : "text-positive"}>
                    {" "}
                    ({formatPercent(p.changePct)})
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-secondary italic">
            No recent governance changes
          </p>
        )}
      </section>

      {/* Operational Signals */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-xs">
          Operational Signals
        </h3>
        {hasOperationalSignals ? (
          <div className="space-y-xs text-xs">
            {supplyChainItems.map((s, i) => (
              <div key={`sc-${i}`} className="border-l-2 border-surface-overlay pl-sm">
                <span className={IMPACT_STYLES[s.impact] ?? "text-text-secondary"}>
                  [{s.impact.toUpperCase()}]
                </span>{" "}
                <span className="text-text-secondary">{s.signal}</span>
              </div>
            ))}
            {mfgItems.map((m, i) => (
              <div key={`mfg-${i}`} className="border-l-2 border-surface-overlay pl-sm text-text-secondary">
                Manufacturing ({m.action}): {m.facility}
                {m.investmentCr != null && ` -- ${formatINRCr(m.investmentCr)}`}
                {" | "}{m.timeline}
              </div>
            ))}
            {retailItems.map((r, i) => (
              <div key={`retail-${i}`} className="border-l-2 border-surface-overlay pl-sm text-text-secondary">
                Retail ({r.action}): {r.storeCount} stores in {r.geography}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-secondary italic">
            No operational signals
          </p>
        )}
      </section>

      {/* Watchlist Status */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary mb-xs">
          Watchlist Status
        </h3>
        {hasWatchlistSignals ? (
          <div className="space-y-xs text-xs">
            {fundraise.map((f, i) => (
              <div key={`fund-${i}`} className="border-l-2 border-positive/30 pl-sm text-text-secondary">
                <span className="font-medium text-text-primary">Fundraise:</span>{" "}
                {f.signal}
                <span className="ml-xs text-[10px] text-text-secondary">
                  (Confidence: {f.confidence}, {f.timeframeMonths}mo)
                </span>
              </div>
            ))}
            {marginInflection.map((m, i) => (
              <div key={`margin-${i}`} className="border-l-2 border-positive/30 pl-sm text-text-secondary">
                <span className="font-medium text-text-primary">Margin Inflection:</span>{" "}
                {m.currentMarginPct}% → {m.projectedMarginPct}% -- {m.catalyst.length > 100 ? m.catalyst.slice(0, 100) + "..." : m.catalyst}
              </div>
            ))}
            {consolidation.map((c, i) => (
              <div key={`consol-${i}`} className="border-l-2 border-brand-accent/30 pl-sm text-text-secondary">
                <span className="font-medium text-text-primary">Consolidation Target:</span>{" "}
                {c.rationale.length > 120 ? c.rationale.slice(0, 120) + "..." : c.rationale}
                <span className="ml-xs text-[10px]">
                  Likely acquirers: {c.likelyAcquirers.join(", ")}
                </span>
              </div>
            ))}
            {stress.map((s, i) => (
              <div key={`stress-${i}`} className="border-l-2 border-negative/30 pl-sm">
                <span
                  className={`inline-block text-[10px] font-medium px-xs py-px rounded mr-xs ${SEVERITY_STYLES[s.severity] ?? ""}`}
                >
                  {s.severity.toUpperCase()}
                </span>
                <span className="text-text-secondary">{s.indicator}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-secondary italic">
            Not on current watchlist
          </p>
        )}
      </section>

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

// --- Helpers ---

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-xs text-center">
      <p className="text-[10px] text-text-secondary mb-px">{label}</p>
      <p className="text-xs font-semibold text-text-primary">{value}</p>
    </div>
  );
}
