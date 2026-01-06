import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./ui/AppShell";

import { Home } from "./ui/pages/Home";
import { RuneExplorer } from "./ui/pages/RuneExplorer";
import { Flashcards } from "./ui/pages/Flashcards";
import { Quiz } from "./ui/pages/Quiz";
import { SignIn } from "./ui/pages/SignIn";
import { TransliteratePage } from "./ui/pages/Transliterate";
import { DrawPage } from "./ui/pages/Draw";
import { RitualPage } from "./ui/pages/Ritual";
import { StonesPage } from "./ui/pages/Stones";
import { LorePage } from "./ui/pages/Lore";
import { StudyPage } from "./ui/pages/Study";
import { ProgressPage } from "./ui/pages/Progress";
import { StatsPage } from "./ui/pages/Stats";

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">404</h1>
      <p className="mt-2 text-white/60">No route matches this URL.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" href="/">
          Home
        </a>
        <a className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" href="/runes">
          Rune Explorer
        </a>
        <a className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" href="/tools/draw">
          Draw Tool
        </a>
        <a className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" href="/stats">
          Stats
        </a>
      </div>
    </div>
  );
}

export const router: unknown = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },

      { path: "/runes", element: <RuneExplorer /> },
      { path: "/flashcards", element: <Flashcards /> },
      { path: "/study", element: <StudyPage /> },
      { path: "/quiz", element: <Quiz /> },

      { path: "/tools/transliterate", element: <TransliteratePage /> },
      { path: "/tools/draw", element: <DrawPage /> },

      { path: "/ritual", element: <RitualPage /> },
      { path: "/stones", element: <StonesPage /> },
      { path: "/lore", element: <LorePage /> },
      { path: "/progress", element: <ProgressPage /> },
      { path: "/stats", element: <StatsPage /> },
      { path: "/signin", element: <SignIn /> },

      // aliases for “guessed” URLs (prevents dumb 404s)
      { path: "/draw", element: <Navigate to="/tools/draw" replace /> },
      { path: "/transliterate", element: <Navigate to="/tools/transliterate" replace /> }
    ]
  }
]);