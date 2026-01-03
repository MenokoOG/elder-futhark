import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./components/NavBar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
      </div>

      <div className="relative">
        <NavBar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```