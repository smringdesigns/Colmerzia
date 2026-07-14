import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { ToastProvider } from "./components/ui/ToastProvider";
import AppRoot from "./App";

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
