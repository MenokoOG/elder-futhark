import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function NavItem(props: { to: string; label: string }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-2 text-sm font-semibold transition",
          "border border-white/10 bg-white/5 hover:bg-white/10",
          isActive ? "ring-2 ring-white/30" : ""
        ].join(" ")
      }
    >
      {props.label}
    </NavLink>
  );
}

export function AppShell() {
  return (
    <div className="min-h-dvh bg-[#070A10] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <span className="text-xl rune-glow">ᚠ</span>
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight">Elder Futhark Academy</div>
              <div className="text-xs text-white/60">Learn runes • Train memory • Draw stones</div>
            </div>
          </div>

          <nav className="hidden flex-wrap items-center gap-2 md:flex">
            <NavItem to="/" label="Home" />
            <NavItem to="/runes" label="Rune Explorer" />
            <NavItem to="/draw" label="Draw" />
            <NavItem to="/flashcards" label="Spaced Repetition" />
            <NavItem to="/stones" label="3D Stones" />
            <NavItem to="/lore" label="Lore Mode" />
            <NavItem to="/stats" label="Stats" />
            <NavItem to="/signin" label="Sign In" />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6">
        <div className="mx-auto max-w-6xl px-4 text-xs text-white/50">
          Built for fun. No paywalls. Render-ready. ✨
        </div>
      </footer>
    </div>
  );
}
