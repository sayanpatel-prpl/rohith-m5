import { useMemo } from "react";
import { Accordion } from "radix-ui";
import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { getCompanyById } from "../../data/mock/companies";
import { SupplyChainSignals } from "./SupplyChainSignals";
import { ManufacturingCapacity } from "./ManufacturingCapacity";
import { ProcurementShifts } from "./ProcurementShifts";
import { RetailFootprint } from "./RetailFootprint";
import type { OperationalIntelligenceData } from "../../types/sections";

// ---------------------------------------------------------------------------
// Company grouping
// ---------------------------------------------------------------------------

interface CompanySignalGroup {
  id: string;
  name: string;
  supplyChain: OperationalIntelligenceData["supplyChainSignals"];
  manufacturing: OperationalIntelligenceData["manufacturingCapacity"];
  procurement: OperationalIntelligenceData["procurementShifts"];
  retail: OperationalIntelligenceData["retailFootprint"];
  totalSignals: number;
}

function groupByCompany(data: OperationalIntelligenceData): CompanySignalGroup[] {
  const map = new Map<string, Omit<CompanySignalGroup, "totalSignals">>();

  function ensure(id: string) {
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: getCompanyById(id)?.name ?? id,
        supplyChain: [],
        manufacturing: [],
        procurement: [],
        retail: [],
      });
    }
    return map.get(id)!;
  }

  for (const s of data.supplyChainSignals) ensure(s.company).supplyChain.push(s);
  for (const m of data.manufacturingCapacity) ensure(m.company).manufacturing.push(m);
  // Procurement shifts: fan out to each affected company
  for (const p of data.procurementShifts) {
    for (const companyId of p.affectedCompanies) {
      ensure(companyId).procurement.push(p);
    }
  }
  for (const r of data.retailFootprint) ensure(r.company).retail.push(r);

  return Array.from(map.values())
    .map((g) => ({
      ...g,
      totalSignals:
        g.supplyChain.length +
        g.manufacturing.length +
        g.procurement.length +
        g.retail.length,
    }))
    .sort((a, b) => b.totalSignals - a.totalSignals);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Operational Intelligence section -- per-company operational signals
 * covering supply chain, manufacturing capacity, procurement shifts,
 * and retail footprint changes in a company-grouped accordion layout.
 */
export default function OperationalIntelligence() {
  const { data, isPending, error } =
    useFilteredData<OperationalIntelligenceData>("operations");

  const groups = useMemo(() => (data ? groupByCompany(data) : []), [data]);

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  const totalSignals = groups.reduce((sum, g) => sum + g.totalSignals, 0);

  return (
    <div className="p-md space-y-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Operational Intelligence
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Summary */}
      <p className="text-xs text-text-muted">
        {totalSignals} signals across {groups.length} companies
      </p>

      {/* Empty state */}
      {groups.length === 0 && (
        <p className="text-xs text-text-muted italic">
          No operational signals match the current filters.
        </p>
      )}

      {/* Company-grouped accordion */}
      {groups.length > 0 && (
        <Accordion.Root type="multiple" defaultValue={groups.map((g) => g.id)}>
          {groups.map((group) => (
            <Accordion.Item key={group.id} value={group.id}>
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full p-md text-sm font-medium text-text-primary hover:bg-surface-raised transition-colors rounded cursor-pointer">
                  <span>{group.name}</span>
                  <span className="text-xs text-text-muted">
                    {group.totalSignals} signal{group.totalSignals !== 1 ? "s" : ""}
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordion-open_200ms_ease-out] data-[state=closed]:animate-[accordion-close_200ms_ease-in]">
                <div className="space-y-md px-md pb-md">
                  {group.supplyChain.length > 0 && (
                    <SupplyChainSignals signals={group.supplyChain} />
                  )}
                  {group.manufacturing.length > 0 && (
                    <ManufacturingCapacity items={group.manufacturing} />
                  )}
                  {group.procurement.length > 0 && (
                    <ProcurementShifts shifts={group.procurement} />
                  )}
                  {group.retail.length > 0 && (
                    <RetailFootprint items={group.retail} />
                  )}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </div>
  );
}
