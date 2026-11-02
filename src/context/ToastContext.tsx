// Toast notifications: Provider pattern + useReducer + a portal.
import { createContext, useCallback, useContext, useReducer, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };

type ToastAction = { type: "added"; toast: Toast } | { type: "removed"; id: number };

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "added":
      return [...state, action.toast];
    case "removed":
      return state.filter(toast => toast.id !== action.id);
  }
}

type ShowToast = (message: string, type?: ToastType) => void;

const toastColors: Record<ToastType, string> = {
  success: "bg-zinc-900 dark:bg-zinc-800",
  error: "bg-red-600",
  info: "bg-violet-600",
};

const ToastContext = createContext<ShowToast | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const nextId = useRef(1); // a mutable counter that doesn't trigger renders

  const showToast = useCallback<ShowToast>((message, type = "success") => {
    const id = nextId.current++;
    dispatch({ type: "added", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "removed", id }), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {createPortal(
        <div className="fixed right-4 bottom-4 z-[60] grid gap-2" role="status" aria-live="polite">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${toastColors[toast.type]}`}
            >
              {toast.message}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
