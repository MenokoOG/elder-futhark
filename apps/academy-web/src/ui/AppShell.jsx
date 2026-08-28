import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, MobileHeader } from "./components/Sidebar.jsx";
import { PageHeader } from "./components/PageHeader.jsx";
import { themeFor } from "./theme.js";

export function AppShell() {
  const { pathname } = useLocation();
  const theme = themeFor(pathname);

  return (
    <div className="min-h-screen bg-bg text-ink min-[1100px]:grid min-[1100px]:grid-cols-[268px_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0">
        <MobileHeader />
        <main
          className="min-w-0 pb-16"
          style={{ "--pa": theme.accent, "--pt": theme.tint, "--pd": theme.deep }}
        >
          <PageHeader theme={theme} />
          <div className="max-w-[1180px] px-5 pt-8 sm:px-8 min-[1100px]:px-11">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
