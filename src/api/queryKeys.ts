// Query key factory: one place that defines every TanStack Query cache key.
export const queryKeys = {
  products: (category?: string) => ["products", { category: category ?? "all" }] as const,
  product: (id: number) => ["product", id] as const,
  categories: ["categories"] as const,
};
