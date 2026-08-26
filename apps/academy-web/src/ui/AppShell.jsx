import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./components/NavBar.jsx";

export function AppShell() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
