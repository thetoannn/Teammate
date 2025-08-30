import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/style/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UnicodeHelper } from "./helper/UnicodeHelper";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigsProvider } from "./contexts/configs";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { Toaster } from "sonner";

// Initialize Unicode decoding for network responses
UnicodeHelper.patchGlobalFetch();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <ConfigsProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </ConfigsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
