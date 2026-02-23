import { DealTypeBadge } from "../../components/ui/DealTypeBadge";
import { formatINRCr, formatDate } from "../../lib/formatters";
import type { DealsTransactionsData } from "../../types/sections";

interface DealCardProps {
  deal: DealsTransactionsData["deals"][number];
}

function formatParties(
  type: DealCardProps["deal"]["type"],
  parties: string[],
): string {
  if (type === "M&A" && parties.length >= 2) {
    return `${parties[0]} \u2192 ${parties[1]}`;
  }
  if (type === "PE/VC" && parties.length >= 2) {
    return `${parties[1]} invests in ${parties[0]}`;
  }
  return parties.join(", ");
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-xs">
      {/* Header: type badge + date */}
      <div className="flex items-center justify-between">
        <DealTypeBadge type={deal.type} />
        <span className="text-[10px] text-text-muted">
          {formatDate(deal.date)}
        </span>
      </div>

      {/* Parties */}
      <p className="text-xs font-medium text-text-primary">
        {formatParties(deal.type, deal.parties)}
      </p>

      {/* Value (only if not null) */}
      {deal.valueCr !== null && (
        <p className="text-sm font-semibold text-text-primary">
          {formatINRCr(deal.valueCr)}
        </p>
      )}

      {/* Rationale */}
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
        {deal.rationale}
      </p>

      {/* Source */}
      <p className="text-[10px] text-text-muted">Source: {deal.source}</p>
    </div>
  );
}
