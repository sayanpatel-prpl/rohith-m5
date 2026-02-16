import { Collapsible } from "radix-ui";
import { formatDate } from "../../lib/formatters";
import type { LeadershipGovernanceData } from "../../types/sections";

interface CxoChangesTableProps {
  changes: LeadershipGovernanceData["cxoChanges"];
}

export function CxoChangesTable({ changes }: CxoChangesTableProps) {
  if (changes.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary mb-sm">
        CXO Changes
      </h3>
      <div className="border border-surface-overlay rounded overflow-hidden">
        {changes.map((change, i) => (
          <Collapsible.Root key={i}>
            <div className="flex items-center py-sm px-md border-b border-surface-overlay hover:bg-surface-raised transition-colors">
              <span className="w-28 text-xs font-medium text-text-primary truncate shrink-0">
                {change.company}
              </span>
              <span className="w-36 text-xs text-text-secondary truncate shrink-0">
                {change.role}
              </span>
              <span className="flex-1 min-w-0">
                <DirectionLabel
                  incoming={change.incoming}
                  outgoing={change.outgoing}
                />
              </span>
              <span className="text-[10px] text-text-muted shrink-0 ml-md">
                {formatDate(change.effectiveDate)}
              </span>
              <Collapsible.Trigger className="ml-sm text-text-muted text-xs cursor-pointer shrink-0 transition-transform data-[state=open]:rotate-180">
                {"\u25BE"}
              </Collapsible.Trigger>
            </div>
            <Collapsible.Content className="px-md py-sm bg-surface-raised text-xs text-text-secondary border-b border-surface-overlay leading-relaxed">
              {change.context}
            </Collapsible.Content>
          </Collapsible.Root>
        ))}
      </div>
    </div>
  );
}

function DirectionLabel({
  incoming,
  outgoing,
}: {
  incoming: string | null;
  outgoing: string | null;
}) {
  if (incoming && outgoing) {
    return (
      <span className="text-xs text-text-secondary truncate">
        {incoming}{" "}
        <span className="text-text-muted">(replaces {outgoing})</span>
      </span>
    );
  }
  if (incoming) {
    return (
      <span className="text-xs text-positive truncate">
        Appointed: {incoming}
      </span>
    );
  }
  if (outgoing) {
    return (
      <span className="text-xs text-negative truncate">
        Departed: {outgoing}
      </span>
    );
  }
  return null;
}
