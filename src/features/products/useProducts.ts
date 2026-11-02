// TanStack Query hooks for product data (server state).
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { productsApi } from "../../api/productsApi";
import { queryKeys } from "../../api/queryKeys";

export function useProducts(category?: string) {
  return useQuery({
    queryKey: queryKeys.products(category),
    queryFn: () => productsApi.getProducts(category),
    placeholderData: keepPreviousData, // keep showing old list while a new category loads
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: Number.isFinite(id), // dependent query: wait for a valid id
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: productsApi.getCategories,
    staleTime: Infinity, // categories rarely change
  });
}

// Prefetch a product when the user hovers its card → details page opens instantly
export function usePrefetchProduct() {
  const queryClient = useQueryClient();
  return useCallback(
    (id: number) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.product(id),
        queryFn: () => productsApi.getProduct(id),
      }),
    [queryClient],
  );
}
