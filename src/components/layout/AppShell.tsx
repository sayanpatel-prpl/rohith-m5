import { Outlet } from "react-router";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="flex flex-col h-screen bg-surface text-text-primary font-body">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-auto p-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
