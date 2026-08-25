import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import { ToastProvider } from "./components/ui/ToastProvider";
import AppRoot from "./App";

// =========================================================
// Estilos del frontend
// =========================================================

import "./styles/index.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/responsive.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppRoot />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);