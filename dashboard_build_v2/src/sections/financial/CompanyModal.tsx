/**
 * FINP-03: Company Detail Modal
 *
 * Opens from the Financial Performance table when a row is clicked.
 * Uses native HTML <dialog> for accessibility (Escape to close, focus trap).
 * Two tabs: "Financial Details" (default) and "Talk vs Walk".
 *
 * Financial Details shows:
 * - 4 StatCards with key metrics
 * - Quarterly history mini-table
 * - A&M Engagement Suggestion card
 *
 * Talk vs Walk shows:
 * - Management narrative vs financial data comparison with disconnect/stealth badges
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { AMSignalBadge } from "./AMSignalBadge";
import { EngagementSuggestion } from "./EngagementSuggestion";
import { TalkVsWalk } from "./TalkVsWalk";
import { formatINRCr, formatPercent } from "@/lib/formatters";
import type { FinancialCompanyRow } from "@/types/financial";

interface CompanyModalProps {
  company: FinancialCompanyRow | null;
  allCompanies: FinancialCompanyRow[];
  onClose: () => void;
}

type TabId = "details" | "talk-vs-walk";

const TABS: { id: TabId; label: string }[] = [
  { id: "details", label: "Financial Details" },
  { id: "talk-vs-walk", label: "Talk vs Walk" },
];

export function CompanyModal({
  company,
  allCompanies,
  onClose,
}: CompanyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>("details");

  // Show/close dialog based on company prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (company) {
      if (!dialog.open) {
        setActiveTab("details");
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [company]);

  // Handle native close event (Escape key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        dialogRef.current?.close();
      }
    },
    [],
  );

  const m = company?.metrics;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="w-full max-w-2xl rounded-lg bg-surface border border-border shadow-xl p-0 backdrop:bg-black/50"
    >
      {company && (
        <div className="max-h-[80vh] overflow-y-auto p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-text-primary">
                {company.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted bg-surface-raised px-2 py-0.5 rounded">
                  {company.subSector}
                </span>
                <AMSignalBadge
                  signal={company.amSignal}
                  reason={company.amSignalReason}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="text-text-muted hover:text-text-primary transition-colors p-1 -mt-1 -mr-1"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b border-border mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors -mb-px ${
                  activeTab === tab.id
                    ? "border-b-2 border-text-primary text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-4">
              {/* Key Metric StatCards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  label="Revenue"
                  value={m?.revenue != null ? formatINRCr(m.revenue) : "-"}
                />
                <StatCard
                  label="EBITDA Margin"
                  value={
                    m?.ebitdaMargin != null
                      ? formatPercent(m.ebitdaMargin)
                      : "-"
                  }
                />
                <StatCard
                  label="ROCE"
                  value={m?.roce != null ? formatPercent(m.roce) : "-"}
                />
                <StatCard
                  label="Debt/Equity"
                  value={m?.debtEquity != null ? m.debtEquity.toFixed(2) : "-"}
                />
              </div>

              {/* Quarterly History Mini-Table */}
              {company.history.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Quarterly History
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-1.5 pr-3 font-medium text-text-muted">
                            Period
                          </th>
                          <th className="text-right py-1.5 px-3 font-medium text-text-muted">
                            Revenue (Cr)
                          </th>
                          <th className="text-right py-1.5 px-3 font-medium text-text-muted">
                            EBITDA Margin
                          </th>
                          <th className="text-right py-1.5 pl-3 font-medium text-text-muted">
                            Net Profit (Cr)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.history.slice(0, 6).map((entry) => (
                          <tr
                            key={entry.period}
                            className="border-b border-border/50"
                          >
                            <td className="py-1.5 pr-3 text-text-primary">
                              {entry.period}
                            </td>
                            <td className="py-1.5 px-3 text-right text-text-primary">
                              {formatINRCr(entry.revenue)}
                            </td>
                            <td className="py-1.5 px-3 text-right text-text-primary">
                              {formatPercent(entry.ebitdaMargin)}
                            </td>
                            <td className="py-1.5 pl-3 text-right text-text-primary">
                              {formatINRCr(entry.netProfit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* A&M Engagement Suggestion */}
              <EngagementSuggestion
                company={company}
                allCompanies={allCompanies}
              />
            </div>
          )}

          {activeTab === "talk-vs-walk" && (
            <TalkVsWalk
              companyId={company.id}
              companyName={company.name}
              metrics={company.metrics}
              performance={company.performance}
            />
          )}
        </div>
      )}
    </dialog>
  );
}
