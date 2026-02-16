import { SignalCard } from "../../components/ui/SignalCard";
import { getCompanyById } from "../../data/mock/companies";
import type { OperationalIntelligenceData } from "../../types/sections";

interface ProcurementShiftsProps {
  shifts: OperationalIntelligenceData["procurementShifts"];
}

export function ProcurementShifts({ shifts }: ProcurementShiftsProps) {
  return (
    <div className="space-y-sm">
      <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Procurement Shifts
      </h4>
      {shifts.map((s, i) => {
        const companyNames = s.affectedCompanies
          .map((id) => getCompanyById(id)?.name ?? id)
          .join(", ");
        return (
          <SignalCard
            key={i}
            title={s.category}
            detail={s.shift}
            impact="neutral"
            metadata={`Affected: ${companyNames}`}
          />
        );
      })}
    </div>
  );
}
