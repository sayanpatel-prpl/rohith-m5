import { formatINRCr } from "../../lib/formatters";
import type { OperationalIntelligenceData } from "../../types/sections";

type SupplyChainSignal = OperationalIntelligenceData["supplyChainSignals"][number];
type ManufacturingCapacity = OperationalIntelligenceData["manufacturingCapacity"][number];
type RetailFootprint = OperationalIntelligenceData["retailFootprint"][number];

const IMPACT_STYLES: Record<string, string> = {
  positive: "text-positive",
  negative: "text-negative",
  neutral: "text-neutral",
};

interface CompanyBriefOperationsProps {
  supplyChainItems: SupplyChainSignal[];
  mfgItems: ManufacturingCapacity[];
  retailItems: RetailFootprint[];
}

export function CompanyBriefOperations({
  supplyChainItems,
  mfgItems,
  retailItems,
}: CompanyBriefOperationsProps) {
  const hasOperationalSignals =
    supplyChainItems.length > 0 || mfgItems.length > 0 || retailItems.length > 0;

  return (
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
  );
}
