// App entry: start MSW (dev), wire axios interceptors to the store, render.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AppProviders } from "./app/AppProviders";
import { router } from "./app/router";
import { store } from "./app/store";
import { setupInterceptors } from "./api/interceptors";
import "./styles/global.css";

async function enableMocking() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" }); // mock /api, let other requests through
}

setupInterceptors(store); // bearer token + 401 handling

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  );
});
