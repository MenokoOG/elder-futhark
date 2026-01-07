// src/ui/components/NavBar.tsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../lib/auth"; // <-- adjust if your path differs

type NavItem = { to: string; label: string };

const navItems: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/study", label: "Study" },
  { to: "/draw", label: "Draw" },
  { to: "/lore", label: "Lore" },
  { to: "/progress", label: "Progress" },
];

export default function NavBar() {
  const [open, setOpen] = React.useState(false);

  // ✅ IMPORTANT: do NOT destructure "handle" (it doesn't exist in AuthContextValue)
  const auth = useAuth();

  const user = (auth as any).user; // keeps compile-safe even if your AuthContextValue differs
  const logout = (auth as any).logout;

  const derivedHandle =
    user?.displayName ||
    (typeof user?.email === "string" ? user.email.split("@")[0] : null) ||
    "Guest";

  return (
    <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-bold tracking-wide text-white">
          Elder Futhark Academy
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "text-sm transition",
                  isActive ? "text-yellow-300" : "text-white/80 hover:text-white",
                ].join(" ")
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="text-xs text-white/70">Hi, {derivedHandle}</span>

          {typeof logout === "function" ? (
            <button
              onClick={async () => {
                try {
                  await logout();
                } finally {
                  setOpen(false);
                }
              }}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/90 hover:bg-white/10"
            >
              Logout
            </button>
          ) : null}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden rounded-md border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open ? (
        <div className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-md px-3 py-2 text-sm transition",
                    isActive ? "bg-white/10 text-yellow-300" : "text-white/90 hover:bg-white/10",
                  ].join(" ")
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-2 flex items-center justify-between px-3">
              <span className="text-xs text-white/70">Hi, {derivedHandle}</span>
              {typeof logout === "function" ? (
                <button
                  onClick={async () => {
                    try {
                      await logout();
                    } finally {
                      setOpen(false);
                    }
                  }}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/90 hover:bg-white/10"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
