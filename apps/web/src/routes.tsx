import React from "react";
import { createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
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
      { path: "/signin", element: <SignIn /> }
    ]
  }
]);