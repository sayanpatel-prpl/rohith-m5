import type { CompetitiveMovesData } from "../../types/sections";

interface QCPartnershipsProps {
  partnerships: CompetitiveMovesData["qcPartnerships"];
}

/** Config-record: status -> badge styling */
const statusBadgeConfig: Record<
  CompetitiveMovesData["qcPartnerships"][number]["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-positive/10 text-positive border-positive/20",
  },
  announced: {
    label: "Announced",
    className: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  },
  rumored: {
    label: "Rumored",
    className: "bg-neutral/10 text-neutral border-neutral/20",
  },
};

export function QCPartnerships({ partnerships }: QCPartnershipsProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Quick Commerce Partnerships
      </h3>

      {partnerships.length === 0 ? (
        <p className="text-xs text-text-muted italic">
          No quick commerce partnerships in this period.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-sm">
          {partnerships.map((p, i) => {
            const badge = statusBadgeConfig[p.status];
            return (
              <div
                key={`${p.company}-${p.partner}-${i}`}
                className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-xs"
              >
                {/* Company x Partner */}
                <p className="text-xs font-semibold text-text-primary">
                  {p.company} x {p.partner}
                </p>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded border whitespace-nowrap ${badge.className}`}
                >
                  {badge.label}
                </span>

                {/* Scope */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  {p.scope}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
