/**
 * Financial Performance section (FINP-01 through FINP-06).
 *
 * Workhorse section for A&M consultants -- 15-company financial tracker with
 * sortable/filterable table, A&M Signal triage badges, inline sparklines,
 * and toggleable derived intelligence columns (Market Share, Pricing Power,
 * Competitive Intensity).
 */

import { useState } from "react";
import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { FinancialData } from "@/types/financial";
import { FinancialTable } from "./FinancialTable";
import { DerivedColumnsToggle } from "./DerivedColumnsToggle";
import { CompanyModal } from "./CompanyModal";

export default function FinancialPerformance() {
  const { data, isPending, error } = useFilteredData<FinancialData>("financial");
  const [showDerived, setShowDerived] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  if (isPending) {
    return <SectionSkeleton variant="table" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load Financial Performance</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="space-y-md">
      <header className="flex items-start justify-between gap-md">
        <div>
          <h2 className="text-xl font-semibold text-text-primary tracking-tight">
            Financial Performance
          </h2>
          <p className="text-sm text-text-secondary mt-xs">
            Quarterly financials across {data.companies.length} Consumer Durables
            companies
          </p>
        </div>

        <DerivedColumnsToggle
          columns={data.derivedColumns}
          visible={showDerived}
          onToggle={() => setShowDerived((v) => !v)}
        />
      </header>

      <FinancialTable
        companies={data.companies}
        derivedColumns={data.derivedColumns}
        showDerived={showDerived}
        onRowClick={(row) => setSelectedCompanyId(row.id)}
      />

      <CompanyModal
        company={
          selectedCompanyId
            ? (data.companies.find((c) => c.id === selectedCompanyId) ?? null)
            : null
        }
        allCompanies={data.companies}
        onClose={() => setSelectedCompanyId(null)}
      />

      {data.dataAsOf && (
        <p className="text-[10px] text-text-muted text-right">
          Data as of {data.dataAsOf}
        </p>
      )}
    </section>
  );
}
