import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { LeadershipSummaryStats } from "./LeadershipSummaryStats";
import { CxoChangesTable } from "./CxoChangesTable";
import { BoardReshuffles } from "./BoardReshuffles";
import { PromoterStakes } from "./PromoterStakes";
import { AuditorFlags } from "./AuditorFlags";
import { LeadershipRiskFlags } from "./LeadershipRiskFlags";
import type { LeadershipGovernanceData } from "../../types/sections";

/**
 * Leadership & Governance section.
 * Monitors people changes and governance events -- CXO appointments/departures,
 * board composition, promoter behavior, audit concerns -- signals that reveal
 * company stress or BD opportunity windows.
 */
export default function LeadershipGovernance() {
  const { data, isPending, error } =
    useFilteredData<LeadershipGovernanceData>("leadership");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  return (
    <div className="p-md space-y-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Leadership & Governance
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Summary Stats */}
      <LeadershipSummaryStats data={data} />

      {/* AI Risk Flags -- shown first after stats for immediate attention */}
      {data.aiRiskFlags.length > 0 && (
        <LeadershipRiskFlags flags={data.aiRiskFlags} />
      )}

      {/* CXO Changes */}
      <CxoChangesTable changes={data.cxoChanges} />

      {/* Board Reshuffles */}
      <BoardReshuffles reshuffles={data.boardReshuffles} />

      {/* Promoter Stake Changes */}
      <PromoterStakes stakes={data.promoterStakeChanges} />

      {/* Auditor Flags */}
      <AuditorFlags flags={data.auditorFlags} />
    </div>
  );
}
