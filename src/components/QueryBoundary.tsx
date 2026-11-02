// RENDER PROPS pattern: handles loading + error, then calls children(data).
// Usage: <QueryBoundary query={productsQuery}>{data => <ProductGrid … />}</QueryBoundary>
import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { getErrorMessage } from "../api/apiClient";
import { Spinner } from "./Spinner";

type QueryBoundaryProps<T> = {
  query: UseQueryResult<T>;
  loadingText?: string;
  children: (data: T) => ReactNode;
};

export function QueryBoundary<T>({ query, loadingText, children }: QueryBoundaryProps<T>) {
  if (query.isPending) return <Spinner label={loadingText} />;

  if (query.isError) {
    return (
      <div className="grid justify-items-center gap-3 py-16 text-center text-red-600" role="alert">
        <p>{getErrorMessage(query.error)}</p>
        <button className="btn btn-secondary" onClick={() => query.refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return <>{children(query.data)}</>;
}
