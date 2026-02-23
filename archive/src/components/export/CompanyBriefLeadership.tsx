import { formatDate, formatPercent } from "../../lib/formatters";
import type { LeadershipGovernanceData } from "../../types/sections";

type CxoChange = LeadershipGovernanceData["cxoChanges"][number];
type BoardReshuffle = LeadershipGovernanceData["boardReshuffles"][number];
type PromoterStakeChange = LeadershipGovernanceData["promoterStakeChanges"][number];

interface CompanyBriefLeadershipProps {
  cxoChanges: CxoChange[];
  boardChanges: BoardReshuffle[];
  promoterChanges: PromoterStakeChange[];
}

export function CompanyBriefLeadership({
  cxoChanges,
  boardChanges,
  promoterChanges,
}: CompanyBriefLeadershipProps) {
  const hasGovernanceEvents =
    cxoChanges.length > 0 || boardChanges.length > 0 || promoterChanges.length > 0;

  return (
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
  );
}
