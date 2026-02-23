import { DropdownMenu } from "radix-ui";
import type { SectionId } from "../../types/common";
import { triggerPDFExport } from "./PDFExport";
import { exportSectionAsCSV } from "./CSVExport";

interface ExportToolbarProps {
  activeSection: SectionId;
}

/**
 * Compact export toolbar with a Radix DropdownMenu offering
 * PDF (via browser print) and CSV (data download) options.
 */
export function ExportToolbar({ activeSection }: ExportToolbarProps) {
  function handlePDFExport() {
    triggerPDFExport();
  }

  function handleCSVExport() {
    void exportSectionAsCSV(activeSection);
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="text-xs font-medium px-sm py-xs bg-surface-raised border border-surface-overlay
                     rounded hover:bg-surface-overlay transition-colors cursor-pointer
                     flex items-center gap-xs text-text-secondary hover:text-text-primary"
        >
          Export
          <span className="text-[10px] leading-none">{"\u25BE"}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="end"
          className="min-w-[160px] bg-surface-raised border border-surface-overlay rounded shadow-md
                     py-xs z-50 animate-fade-in"
        >
          <DropdownMenu.Item
            onSelect={handlePDFExport}
            className="flex items-center gap-sm px-md py-sm text-xs text-text-secondary
                       hover:bg-surface-overlay hover:text-text-primary cursor-pointer outline-none
                       data-[highlighted]:bg-surface-overlay data-[highlighted]:text-text-primary"
          >
            Export as PDF
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={handleCSVExport}
            className="flex items-center gap-sm px-md py-sm text-xs text-text-secondary
                       hover:bg-surface-overlay hover:text-text-primary cursor-pointer outline-none
                       data-[highlighted]:bg-surface-overlay data-[highlighted]:text-text-primary"
          >
            Export Data as CSV
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
