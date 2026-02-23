import type { CompetitiveMovesData } from "../../types/sections";

interface D2CInitiativesProps {
  initiatives: CompetitiveMovesData["d2cInitiatives"];
}

/** Config-record: status -> badge styling */
const statusBadgeConfig: Record<
  CompetitiveMovesData["d2cInitiatives"][number]["status"],
  { label: string; className: string }
> = {
  launched: {
    label: "Launched",
    className: "bg-positive/10 text-positive border-positive/20",
  },
  piloting: {
    label: "Piloting",
    className: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  },
  announced: {
    label: "Announced",
    className: "bg-neutral/10 text-neutral border-neutral/20",
  },
};

export function D2CInitiatives({ initiatives }: D2CInitiativesProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        D2C Initiatives
      </h3>

      {initiatives.length === 0 ? (
        <p className="text-xs text-text-muted italic">
          No D2C initiatives in this period.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-sm">
          {initiatives.map((init, i) => {
            const badge = statusBadgeConfig[init.status];
            return (
              <div
                key={`${init.company}-${init.initiative}-${i}`}
                className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-xs"
              >
                {/* Company + status badge */}
                <div className="flex items-center justify-between gap-xs">
                  <span className="text-xs font-semibold text-text-primary truncate">
                    {init.company}
                  </span>
                  <span
                    className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded border whitespace-nowrap ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Channel */}
                <p className="text-xs text-text-muted">{init.channel}</p>

                {/* Initiative name */}
                <p className="text-xs text-text-primary font-medium">
                  {init.initiative}
                </p>

                {/* Details */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  {init.details}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
