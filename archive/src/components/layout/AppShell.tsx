import { Outlet } from "react-router";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { FilterBar } from "../filters/FilterBar";
import { useFilterUrlSync } from "../../stores/url-sync";

export function AppShell() {
  // Activate bidirectional URL <-> store sync for the entire report shell
  useFilterUrlSync();

  return (
    <div className="flex flex-col h-screen bg-surface text-text-primary font-body">
      <TopBar />
      <FilterBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-xl py-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
