import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../state/auth.jsx";
import { Button } from "./Button.jsx";

const linkBase = "rounded-lg px-3 py-2 text-sm hover:bg-zinc-800/70";
const linkActive = "bg-zinc-800";

export function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">ᚠ</span>
          <span className="font-semibold">EFA</span>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/runes"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Runes
          </NavLink>
          <NavLink
            to="/flashcards"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Decks
          </NavLink>
          <NavLink
            to="/study"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Study
          </NavLink>
          <NavLink
            to="/quiz"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Quiz
          </NavLink>
          <NavLink
            to="/tools/canvas"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Draw
          </NavLink>
          <NavLink
            to="/tools/orb"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Orb
          </NavLink>
          <NavLink
            to="/tools/transliterate"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Transliterate
          </NavLink>
          <NavLink
            to="/ritual"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Ritual
          </NavLink>
          <NavLink
            to="/stones"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Stones
          </NavLink>
          <NavLink
            to="/lore"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Lore
          </NavLink>
          <NavLink
            to="/gods"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Gods
          </NavLink>
          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Progress
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Stats
          </NavLink>

          <div className="ml-2 flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-xs text-zinc-300 sm:inline">
                  {user.email}
                </span>
                <Button onClick={logout} className="text-sm">
                  Logout
                </Button>
              </>
            ) : (
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : ""}`
                }
              >
                Sign In
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
