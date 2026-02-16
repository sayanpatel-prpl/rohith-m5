import { StatCard } from "../../components/ui/StatCard";
import type { LeadershipGovernanceData } from "../../types/sections";

interface LeadershipSummaryStatsProps {
  data: LeadershipGovernanceData;
}

export function LeadershipSummaryStats({ data }: LeadershipSummaryStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-md">
      <StatCard label="CXO Changes" value={String(data.cxoChanges.length)} />
      <StatCard
        label="Board Changes"
        value={String(data.boardReshuffles.length)}
      />
      <StatCard
        label="Promoter Moves"
        value={String(data.promoterStakeChanges.length)}
      />
      <StatCard
        label="Auditor Flags"
        value={String(data.auditorFlags.length)}
      />
    </div>
  );
}
