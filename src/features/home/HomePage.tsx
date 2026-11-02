// Home: hero, categories (links with search params), top-rated products, newsletter.
import { useCallback, useMemo } from "react";
import { Link } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { useToast } from "../../context/ToastContext";
import { QueryBoundary } from "../../components/QueryBoundary";
import { capitalize } from "../../utils/format";
import { addedToCart } from "../cart/cartSlice";
import { ProductGrid } from "../products/ProductGrid";
import { useCategories, useProducts } from "../products/useProducts";
import { Newsletter } from "./Newsletter";
import type { Product } from "../../types";

const categoryIcons: Record<string, string> = { electronics: "🎧", fashion: "👟", home: "🪴" };

export default function HomePage() {
  const productsQuery = useProducts(); // same cache entry the Products page uses
  const { data: categories = [] } = useCategories();
  const dispatch = useAppDispatch();
  const showToast = useToast();

  const topRated = useMemo(
    () => [...(productsQuery.data?.items ?? [])].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [productsQuery.data],
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addedToCart(product));
      showToast(`${product.title} added to cart`);
    },
    [dispatch, showToast],
  );

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-14 text-white sm:px-12 sm:py-20 dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-violet-600/40 blur-3xl" aria-hidden="true" />
        <div
          className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-fuchsia-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-xl">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/15">
            New season · Free shipping
          </span>
          <h1 className="mt-5 text-4xl leading-tight sm:text-5xl">Everything you need, delivered fast.</h1>
          <p className="mt-4 text-zinc-300">
            A capstone store built with React, TypeScript, Redux Toolkit, TanStack Query and Formik.
          </p>
          <Link to="/products" className="btn mt-8 bg-white px-6 text-zinc-900 hover:bg-zinc-200">
            Shop now →
          </Link>
        </div>
      </section>

      <h2 className="mt-12 mb-4 text-xl">Shop by category</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {categories.map(category => (
          <Link
            key={category}
            to={`/products?category=${category}`}
            className="card flex items-center gap-4 p-5 font-medium capitalize transition hover:-translate-y-0.5 hover:ring-violet-300 dark:hover:ring-violet-700"
          >
            <span
              className="grid size-12 place-items-center rounded-xl bg-violet-50 text-2xl dark:bg-violet-500/10"
              aria-hidden="true"
            >
              {categoryIcons[category] ?? "🛒"}
            </span>
            {capitalize(category)}
          </Link>
        ))}
      </div>

      <h2 className="mt-12 mb-4 text-xl">Top rated</h2>
      <QueryBoundary query={productsQuery} loadingText="Loading top products…">
        {() => <ProductGrid products={topRated} onAddToCart={handleAddToCart} />}
      </QueryBoundary>

      <Newsletter />
    </>
  );
}
