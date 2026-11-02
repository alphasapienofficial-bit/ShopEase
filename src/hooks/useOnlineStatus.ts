// useSyncExternalStore: subscribe to a browser "store" (online / offline).
import { useDebugValue, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // client snapshot
    () => true, // server snapshot (SSR)
  );
  useDebugValue(isOnline ? "Online" : "Offline"); // label in React DevTools
  return isOnline;
}
