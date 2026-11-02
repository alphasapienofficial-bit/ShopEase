// PROVIDER pattern: compose every app-wide provider in one component.
import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import { queryClient as defaultQueryClient } from "./queryClient";
import { store as defaultStore, type AppStore } from "./store";

type AppProvidersProps = {
  children: ReactNode;
  store?: AppStore; // overridable in tests
  queryClient?: QueryClient;
};

export function AppProviders({ children, store = defaultStore, queryClient = defaultQueryClient }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
