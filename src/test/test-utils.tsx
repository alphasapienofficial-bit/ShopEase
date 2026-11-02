// renderWithProviders: render a component with a fresh store, query client and router.
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient } from "@tanstack/react-query";
import { AppProviders } from "../app/AppProviders";
import { makeStore, type RootState } from "../app/store";
import { setupInterceptors } from "../api/interceptors";

type Options = { route?: string; preloadedState?: Partial<RootState> };

export function renderWithProviders(ui: ReactElement, { route = "/", preloadedState }: Options = {}) {
  const store = makeStore(preloadedState);
  setupInterceptors(store);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return {
    store,
    ...render(
      <AppProviders store={store} queryClient={queryClient}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AppProviders>,
    ),
  };
}
