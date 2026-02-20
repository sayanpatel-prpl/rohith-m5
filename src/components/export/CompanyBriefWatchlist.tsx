import type { WatchlistData } from "../../types/sections";

type FundraiseSignal = WatchlistData["fundraiseSignals"][number];
type MarginInflectionCandidate = WatchlistData["marginInflectionCandidates"][number];
type ConsolidationTarget = WatchlistData["consolidationTargets"][number];
type StressIndicator = WatchlistData["stressIndicators"][number];

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-negative/10 text-negative",
  warning: "bg-brand-accent/10 text-brand-accent",
  watch: "bg-neutral/10 text-neutral",
};

interface CompanyBriefWatchlistProps {
  fundraise: FundraiseSignal[];
  marginInflection: MarginInflectionCandidate[];
  consolidation: ConsolidationTarget[];
  stress: StressIndicator[];
}

export function CompanyBriefWatchlist({
  fundraise,
  marginInflection,
  consolidation,
  stress,
}: CompanyBriefWatchlistProps) {
  const hasWatchlistSignals =
    fundraise.length > 0 ||
    marginInflection.length > 0 ||
    consolidation.length > 0 ||
    stress.length > 0;

  return (
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
  );
}
