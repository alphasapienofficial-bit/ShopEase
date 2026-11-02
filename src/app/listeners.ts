// Listener middleware: run side effects in response to actions or state changes.
import { createListenerMiddleware } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";
import { saveState } from "./storage";

export const listenerMiddleware = createListenerMiddleware();

const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>();

// Persist the session and cart whenever either of them changes.
startAppListening({
  predicate: (_action, currentState, previousState) =>
    currentState.cart !== previousState.cart || currentState.auth !== previousState.auth,
  effect: (_action, listenerApi) => {
    const { auth, cart } = listenerApi.getState();
    saveState({ auth, cart });
  },
});
