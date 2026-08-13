import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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

const queryClient = new QueryClient();

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