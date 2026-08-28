import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../state/auth.jsx";
import { NAV_GROUPS } from "../theme.js";

function Item({ item, locked, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-[14.5px] transition",
          isActive ? "bg-accent-200 font-semibold text-accent-800" : "text-neutral-800 hover:bg-neutral-200",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span className={`w-[18px] text-center text-base ${isActive ? "text-accent-700" : "text-neutral-700"}`}>{item.glyph}</span>
          <span className="flex-1">{item.label}</span>
          {locked ? <span className="text-[10px] uppercase tracking-wider text-neutral-700">key</span> : null}
        </>
      )}
    </NavLink>
  );
}

function Brand({ onNavigate }) {
  return (
    <Link to="/" onClick={onNavigate} className="flex items-center gap-3 rounded-md p-1 hover:bg-neutral-200">
      <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-accent-500 text-[26px] leading-none text-ink shadow-sm">ᚠ</span>
      <span>
        <span className="block font-heading text-[19px]">Futhark</span>
        <span className="block text-[11.5px] uppercase tracking-[0.14em] text-neutral-700">Academy</span>
      </span>
    </Link>
  );
}

/** Shared between the desktop aside and the mobile drawer. */
function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <>
      <Brand onNavigate={onNavigate} />

      <nav className="flex flex-col gap-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <div className="px-3 pb-1 text-[10.5px] uppercase tracking-[0.16em] text-neutral-700">{group.label}</div>
            {group.items.map((item) => (
              <Item key={item.to} item={item} locked={Boolean(item.gated && !user)} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t pt-4" style={{ borderColor: "var(--color-divider)" }}>
        {user ? (
          <div className="flex flex-col gap-2">
            <div className="truncate text-[12.5px] text-neutral-700">{user.email}</div>
            <button onClick={logout} className="btn btn-secondary text-sm">Log out</button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="text-[12.5px] leading-snug text-neutral-700">Sign in to unlock the ritual, study queue and your numbers.</div>
            <Link to="/signin" onClick={onNavigate} className="btn btn-primary text-sm">Sign in</Link>
          </div>
        )}
      </div>
    </>
  );
}

/** The 268px sticky sidebar. Hidden below 1100px, where MobileHeader takes over. */
export function Sidebar() {
  return (
    <aside
      className="sticky top-0 hidden h-screen flex-col gap-6 self-start overflow-y-auto border-r bg-surface px-4 py-6 min-[1100px]:flex"
      style={{ borderColor: "var(--color-divider)" }}
    >
      <SidebarContent />
    </aside>
  );
}

/**
 * Below 1100px the sidebar becomes a top bar plus a slide-in drawer. The
 * drawer closes on navigation, on Escape, and on the backdrop; the toggle
 * carries aria-expanded/aria-controls so the state is announced.
 */
export function MobileHeader() {
  const [open, setOpen] = React.useState(false);
  const { pathname } = useLocation();
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => { setOpen(false); }, [pathname]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-[1100px]:hidden">
      <header
        className="sticky top-0 z-40 flex items-center justify-between border-b bg-surface px-4 py-2"
        style={{ borderColor: "var(--color-divider)" }}
      >
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid h-11 w-11 place-items-center rounded-full text-neutral-800 hover:bg-neutral-200"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-ink/40"
            onClick={close}
            aria-hidden="true"
          />
          <div
            id="mobile-nav"
            className="flex h-full w-[300px] max-w-[85vw] flex-col gap-6 overflow-y-auto border-l bg-surface px-4 py-6 shadow-lg"
            style={{ borderColor: "var(--color-divider)" }}
          >
            <SidebarContent onNavigate={close} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
