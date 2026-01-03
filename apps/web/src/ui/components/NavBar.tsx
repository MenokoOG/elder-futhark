import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { LogOut, User, Sparkles, Pencil, Cuboid, Flame, Trophy } from "lucide-react";

function Item({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export function NavBar() {
  const { token, handle, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl rune-glow">
            ᚠ
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold">Elder Futhark Academy</div>
            <div className="text-xs text-white/60 font-mono">learn • quiz • master</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Item to="/runes" label="Runes" />
          <Item to="/flashcards" label="Flashcards" />
          <Item to="/study" label="Study (SM-2)" />
          <Item to="/quiz" label="Quiz" />
          <Item to="/lore" label="Lore" />
          <Item to="/ritual" label="Ritual" />
          <Item to="/stones" label="Stones 3D" />
          <Item to="/tools/transliterate" label="Transliterate" />
          <Item to="/tools/draw" label="Draw" />
          <Item to="/progress" label="Progress" />
        </nav>

        <div className="flex items-center gap-2">
          {token ? (
            <>
              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm md:flex">
                <User size={16} />
                <span className="font-semibold">{handle ?? "Seer"}</span>
              </div>
              <button onClick={logout} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/signin">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm">
                <User size={16} />
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile quick actions */}
      <div className="border-t border-white/10 bg-black/60 md:hidden">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
          <Link to="/ritual" className="shrink-0">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5">
              <Flame size={16} /> Ritual
            </button>
          </Link>
          <Link to="/study" className="shrink-0">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5">
              <Sparkles size={16} /> SM-2
            </button>
          </Link>
          <Link to="/stones" className="shrink-0">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5">
              <Cuboid size={16} /> 3D
            </button>
          </Link>
          <Link to="/tools/draw" className="shrink-0">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5">
              <Pencil size={16} /> Draw
            </button>
          </Link>
          <Link to="/progress" className="shrink-0">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5">
              <Trophy size={16} /> Progress
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}