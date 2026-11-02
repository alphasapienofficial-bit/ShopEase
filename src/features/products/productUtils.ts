// Pure helpers: easy to unit test and to memoize with useMemo.
import type { Product, SortOption } from "../../types";

export function filterAndSortProducts(products: Product[], search: string, sort: SortOption): Product[] {
  const term = search.trim().toLowerCase();
  const filtered = term
    ? products.filter(p => p.title.toLowerCase().includes(term) || p.category.includes(term))
    : products;

  const sorted = [...filtered]; // never mutate the cached query data
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];
