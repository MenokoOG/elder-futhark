import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./ui/AppShell";
import { Home } from "./ui/pages/Home";
import { RuneExplorer } from "./ui/pages/RuneExplorer";
import { Flashcards } from "./ui/pages/Flashcards";
import { Quiz } from "./ui/pages/Quiz";
import { SignIn } from "./ui/pages/SignIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "/runes", element: <RuneExplorer /> },
      { path: "/flashcards", element: <Flashcards /> },
      { path: "/quiz", element: <Quiz /> },
      { path: "/signin", element: <SignIn /> }
    ]
  }
]);