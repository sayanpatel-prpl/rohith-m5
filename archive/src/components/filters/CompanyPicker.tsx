import { Popover, Checkbox } from "radix-ui";
import { useFilterStore } from "../../stores/filter-store";

interface CompanyPickerProps {
  /** Available companies to select from */
  options: Array<{ id: string; name: string }>;
}

/**
 * Multi-select company dropdown using Radix Popover + Checkbox.
 * Radix Select does not support multi-select natively, so we use
 * Popover containing a scrollable Checkbox list.
 */
export function CompanyPicker({ options }: CompanyPickerProps) {
  const companies = useFilterStore((s) => s.companies);
  const setCompanies = useFilterStore((s) => s.setCompanies);

  function toggle(id: string) {
    setCompanies(
      companies.includes(id)
        ? companies.filter((c) => c !== id)
        : [...companies, id]
    );
  }

  function clearAll() {
    setCompanies([]);
  }

  // Build trigger label based on selection count
  let triggerLabel: string;
  if (companies.length === 0) {
    triggerLabel = "All Companies";
  } else if (companies.length <= 3) {
    triggerLabel = companies
      .map((id) => options.find((o) => o.id === id)?.name ?? id)
      .join(", ");
  } else {
    triggerLabel = `${companies.length} companies`;
  }

  return (
    <div className="flex items-center gap-xs">
      <span className="text-xs text-text-muted whitespace-nowrap">
        Companies
      </span>
      <Popover.Root>
        <Popover.Trigger className="inline-flex items-center gap-xs px-sm py-xs text-xs bg-surface-raised border border-surface-overlay rounded min-w-24 max-w-48 hover:bg-surface-overlay transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-brand-accent">
          <span className="truncate">{triggerLabel}</span>
          <span className="text-text-muted text-[10px] shrink-0">
            {"\u25BE"}
          </span>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="bg-surface-raised border border-surface-overlay rounded shadow-lg z-50 w-56"
            sideOffset={4}
            align="start"
          >
            <div className="max-h-60 overflow-y-auto p-xs">
              {options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-sm px-sm py-xs text-xs cursor-pointer hover:bg-surface-overlay rounded transition-colors"
                >
                  <Checkbox.Root
                    checked={companies.includes(opt.id)}
                    onCheckedChange={() => toggle(opt.id)}
                    className="h-3.5 w-3.5 shrink-0 border border-surface-overlay rounded-sm bg-surface flex items-center justify-center data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
                  >
                    <Checkbox.Indicator className="text-white text-[10px] leading-none">
                      {"\u2713"}
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="text-text-primary truncate">{opt.name}</span>
                </label>
              ))}
            </div>

            {companies.length > 0 && (
              <div className="border-t border-surface-overlay p-xs">
                <button
                  onClick={clearAll}
                  className="text-xs text-text-muted hover:text-text-primary w-full text-left px-sm py-xs cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
