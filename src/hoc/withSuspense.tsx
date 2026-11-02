// HOC: wraps a lazy-loaded page in an ErrorBoundary + Suspense fallback.
import { Suspense, type ComponentType, type ReactNode } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Spinner } from "../components/Spinner";

export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  fallback: ReactNode = <Spinner label="Loading page…" />,
) {
  function SuspenseWrapper(props: P) {
    return (
      <ErrorBoundary>
        <Suspense fallback={fallback}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  SuspenseWrapper.displayName = `withSuspense(${Component.displayName ?? "LazyPage"})`;
  return SuspenseWrapper;
}
