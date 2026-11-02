// CONTAINER component: fetches data, owns state, passes props down.
// Hooks used: useState, useEffect, useMemo, useCallback, useRef, useTransition,
// useDeferredValue, useSearchParams + custom hooks (useDebounce, useProducts…).
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { useToast } from "../../context/ToastContext";
import { useDebounce } from "../../hooks/useDebounce";
import { QueryBoundary } from "../../components/QueryBoundary";
import { addedToCart } from "../cart/cartSlice";
import { capitalize } from "../../utils/format";
import { SearchBar, type SearchBarHandle } from "./SearchBar";
import { ProductGrid } from "./ProductGrid";
import { useCategories, useProducts } from "./useProducts";
import { filterAndSortProducts, sortOptions } from "./productUtils";
import type { Product, SortOption } from "../../types";

export default function ProductsPage() {
  // URL state: category, sort and search survive refresh and can be shared
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const sort = (searchParams.get("sort") as SortOption | null) ?? "featured";

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 300); // wait until typing pauses
  const deferredSearch = useDeferredValue(debouncedSearch); // keep typing responsive
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<SearchBarHandle>(null);

  const dispatch = useAppDispatch();
  const showToast = useToast();
  const productsQuery = useProducts(category || undefined);
  const { data: categories = [] } = useCategories();

  // Keep ?q= in the URL in sync with the debounced search text
  useEffect(() => {
    if ((searchParams.get("q") ?? "") === debouncedSearch) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) next.set("q", debouncedSearch);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Press "/" anywhere to focus the search box (via the imperative handle)
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const typing = (event.target as HTMLElement).closest("input, textarea, select");
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Non-urgent update: changing filters re-renders the grid inside a transition
  function updateParam(key: "category" | "sort", value: string) {
    startTransition(() => {
      const next = new URLSearchParams(searchParams);
      if (value && value !== "featured") next.set(key, value);
      else next.delete(key);
      setSearchParams(next);
    });
  }

  // useMemo: only re-filter / re-sort when the data, search or sort change
  const visibleProducts = useMemo(
    () => filterAndSortProducts(productsQuery.data?.items ?? [], deferredSearch, sort),
    [productsQuery.data, deferredSearch, sort],
  );

  // useCallback: a stable function so memoized ProductCards don't re-render
  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addedToCart(product));
      showToast(`${product.title} added to cart`);
    },
    [dispatch, showToast],
  );

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Products</h1>
          <p className="muted mt-1 text-sm">Find something you'll love.</p>
        </div>
        {productsQuery.data && (
          <span className="muted text-sm">
            {visibleProducts.length} of {productsQuery.data.total}
          </span>
        )}
      </div>

      <div className="my-6 flex flex-wrap gap-3">
        <SearchBar ref={searchRef} value={search} onChange={setSearch} />

        <select
          className="input w-auto"
          aria-label="Category"
          value={category}
          onChange={e => updateParam("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c} value={c}>
              {capitalize(c)}
            </option>
          ))}
        </select>

        <select
          className="input w-auto"
          aria-label="Sort by"
          value={sort}
          onChange={e => updateParam("sort", e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className={
          isPending || productsQuery.isPlaceholderData ? "opacity-50 transition-opacity" : "transition-opacity"
        }
      >
        <QueryBoundary query={productsQuery} loadingText="Loading products…">
          {() => <ProductGrid products={visibleProducts} onAddToCart={handleAddToCart} />}
        </QueryBoundary>
      </div>
    </section>
  );
}
