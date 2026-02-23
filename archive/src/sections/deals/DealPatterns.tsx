import { InsightCard } from "../../components/ui/InsightCard";
import type { DealsTransactionsData } from "../../types/sections";

interface DealPatternsProps {
  patterns: DealsTransactionsData["aiPatterns"];
}

export function DealPatterns({ patterns }: DealPatternsProps) {
  if (patterns.length === 0) return null;

  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-semibold text-text-primary">
        AI Pattern Recognition
      </h3>
      {patterns.map((p, i) => (
        <InsightCard
          key={i}
          title={p.pattern}
          confidence={p.confidence}
          explanation={p.explanation}
          variant="pattern"
        />
      ))}
    </div>
  );
}
