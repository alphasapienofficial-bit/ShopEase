// MSW in the browser: a Service Worker intercepts requests during development.
// Run `npm run msw:init` once to create public/mockServiceWorker.js.
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
