// Save / load part of the Redux state in localStorage (used by the listener middleware).
import type { RootState } from "./store";

const KEY = "shopease:state";

type PersistedState = Pick<RootState, "auth" | "cart">;

export function loadState(): Partial<RootState> | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : undefined;
  } catch {
    return undefined; // private mode / blocked storage
  }
}

export function saveState(state: PersistedState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore write errors (quota, private mode)
  }
}
