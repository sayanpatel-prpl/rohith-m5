import { formatDate, formatINRCr } from "../../lib/formatters";
import type { DealsTransactionsData } from "../../types/sections";

type Deal = DealsTransactionsData["deals"][number];

interface CompanyBriefActivityProps {
  deals: Deal[];
}

export function CompanyBriefActivity({ deals }: CompanyBriefActivityProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-text-primary mb-xs">
        Recent Activity
      </h3>
      {deals.length > 0 ? (
        <div className="space-y-xs">
          {deals.map((deal) => (
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
  );
}
