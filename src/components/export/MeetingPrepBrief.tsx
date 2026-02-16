import { useState } from "react";
import { Dialog } from "radix-ui";
import { COMPANIES } from "../../data/mock/companies";
import MeetingPrepButton from "./MeetingPrepButton";
import CompanyBrief from "./CompanyBrief";

/**
 * Meeting Prep Brief generator -- self-contained component with Radix Dialog.
 * Renders its own trigger button (MeetingPrepButton) and manages dialog state internally.
 * TopBar simply renders <MeetingPrepBrief /> without managing any state.
 */
export default function MeetingPrepBrief() {
  const [open, setOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(COMPANIES[0].id);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div>
          <MeetingPrepButton onClick={() => setOpen(true)} />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 animate-fade-in" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                     bg-surface-base border border-surface-overlay rounded-lg
                     max-w-3xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto
                     shadow-lg animate-fade-in"
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface-base border-b border-surface-overlay px-lg py-sm flex items-center justify-between z-10">
            <Dialog.Title className="text-sm font-display font-semibold text-text-primary">
              Meeting Prep Brief
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-text-secondary hover:text-text-primary text-lg cursor-pointer
                           w-6 h-6 flex items-center justify-center rounded hover:bg-surface-overlay transition-colors"
                aria-label="Close"
              >
                {"\u00D7"}
              </button>
            </Dialog.Close>
          </div>

          {/* Company Selector */}
          <div className="px-lg pt-sm pb-xs">
            <label className="text-xs text-text-secondary block mb-xs">
              Select Company
            </label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full text-sm bg-surface-raised border border-surface-overlay rounded
                         px-sm py-xs text-text-primary cursor-pointer
                         focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              {COMPANIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.ticker})
                </option>
              ))}
            </select>
          </div>

          {/* Brief Content */}
          <div className="px-lg py-sm">
            <CompanyBrief companyId={selectedCompanyId} />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-surface-base border-t border-surface-overlay px-lg py-sm flex justify-end gap-sm">
            <Dialog.Close asChild>
              <button
                className="text-xs font-medium px-md py-xs bg-surface-raised border border-surface-overlay
                           rounded hover:bg-surface-overlay transition-colors cursor-pointer
                           text-text-secondary hover:text-text-primary"
              >
                Close
              </button>
            </Dialog.Close>
            <button
              onClick={() => window.print()}
              className="text-xs font-medium px-md py-xs bg-brand-primary text-white
                         rounded hover:opacity-90 transition-colors cursor-pointer"
            >
              Print Brief
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
