import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";

function NavItem(props: { to: string; label: string; onNavigate?: () => void }) {
  return (
    <NavLink
      to={props.to}
      onClick={() => props.onNavigate?.()}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-2 text-sm font-semibold transition",
          "border border-white/10 bg-white/5 hover:bg-white/10",
          isActive ? "ring-2 ring-white/30" : "",
        ].join(" ")
      }
    >
      {props.label}
    </NavLink>
  );
}

export function AppShell() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const closeMobile = React.useCallback(() => setMobileOpen(false), []);
  const toggleMobile = React.useCallback(() => setMobileOpen((v) => !v), []);

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-[#070A10] text-white">
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

          {/* Desktop nav */}
          <nav className="hidden flex-wrap items-center gap-2 md:flex">
            <NavItem to="/" label="Home" />
            <NavItem to="/runes" label="Rune Explorer" />
            <NavItem to="/draw" label="Draw" />
            <NavItem to="/flashcards" label="Spaced Repetition" />
            <NavItem to="/stones" label="3D Stones" />
            <NavItem to="/lore" label="Lore Mode" />
            <NavItem to="/stats" label="Stats" />
            {!user && <NavItem to="/signin" label="Sign In" />}
          </nav>

          <div className="flex items-center gap-2 text-sm">
            {/* Desktop auth badge */}
            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/80">
                    {user.email}
                  </div>
                  <button
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold hover:bg-white/10"
                    onClick={logout}
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={toggleMobile}
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen ? (
          <div className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <nav className="flex flex-col gap-2">
                <NavItem to="/" label="Home" onNavigate={closeMobile} />
                <NavItem to="/runes" label="Rune Explorer" onNavigate={closeMobile} />
                <NavItem to="/draw" label="Draw" onNavigate={closeMobile} />
                <NavItem to="/flashcards" label="Spaced Repetition" onNavigate={closeMobile} />
                <NavItem to="/stones" label="3D Stones" onNavigate={closeMobile} />
                <NavItem to="/lore" label="Lore Mode" onNavigate={closeMobile} />
                <NavItem to="/stats" label="Stats" onNavigate={closeMobile} />
                {!user && <NavItem to="/signin" label="Sign In" onNavigate={closeMobile} />}
              </nav>

              <div className="mt-3 flex items-center justify-between gap-2">
                {user ? (
                  <>
                    <div className="max-w-[65%] truncate rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/80">
                      {user.email}
                    </div>
                    <button
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold hover:bg-white/10"
                      onClick={() => {
                        closeMobile();
                        logout();
                      }}
                      type="button"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="text-xs text-white/60">Not signed in</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
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
