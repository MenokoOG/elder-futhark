import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router as any} />
      </AuthProvider>
    </QueryClientProvider>
  
);