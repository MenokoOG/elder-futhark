import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./ui/AppShell.jsx";
import { useAuth } from "./state/auth.jsx";

import { Home } from "./views/Home.jsx";
import { SignIn } from "./views/SignIn.jsx";
import { Runes } from "./views/Runes.jsx";
import { Flashcards } from "./views/Flashcards.jsx";
import { Study } from "./views/Study.jsx";
import { Quiz } from "./views/Quiz.jsx";
import { Draw } from "./views/tools/Draw.jsx";
import { OrbLab } from "./views/tools/OrbLab.jsx";
import { Transliterate } from "./views/tools/Transliterate.jsx";
import { Ritual } from "./views/Ritual.jsx";
import { Stones } from "./views/Stones.jsx";
import { Lore } from "./views/Lore.jsx";
import { Progress } from "./views/Progress.jsx";
import { Stats } from "./views/Stats.jsx";
import { NotFound } from "./views/NotFound.jsx";

function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/signin" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/runes", element: <Runes /> },
      { path: "/flashcards", element: <Flashcards /> },
      {
        path: "/study",
        element: (
          <RequireAuth>
            <Study />
          </RequireAuth>
        ),
      },
      { path: "/quiz", element: <Quiz /> },
      { path: "/tools/draw", element: <Navigate to="/tools/canvas" replace /> },
      { path: "/tools/canvas", element: <Draw /> },
      { path: "/tools/orb", element: <OrbLab /> },
      { path: "/tools/transliterate", element: <Transliterate /> },
      {
        path: "/ritual",
        element: (
          <RequireAuth>
            <Ritual />
          </RequireAuth>
        ),
      },
      { path: "/stones", element: <Stones /> },
      { path: "/lore", element: <Lore /> },
      {
        path: "/progress",
        element: (
          <RequireAuth>
            <Progress />
          </RequireAuth>
        ),
      },
      {
        path: "/stats",
        element: (
          <RequireAuth>
            <Stats />
          </RequireAuth>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
