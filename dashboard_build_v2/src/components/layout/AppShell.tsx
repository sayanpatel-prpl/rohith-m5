import { Outlet } from "react-router";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { FilterBar } from "./FilterBar";
import { useFilterUrlSync } from "../../stores/url-sync";

/**
 * Main dashboard shell layout.
 * Calls useFilterUrlSync() at the top level for bidirectional URL <-> store sync.
 * Renders: fixed Sidebar (260px) | main area with TopBar, FilterBar, and content <Outlet />.
 */
export function AppShell() {
  // Activate bidirectional URL <-> store sync for the entire report shell
  useFilterUrlSync();

  return (
    <div className="flex h-screen bg-surface text-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <FilterBar />
        <main className="flex-1 overflow-y-auto bg-surface">
          <div className="max-w-[1600px] mx-auto px-xl py-lg animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
