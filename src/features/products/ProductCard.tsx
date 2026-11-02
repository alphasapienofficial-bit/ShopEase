// Presentational component wrapped in React.memo:
// it re-renders only when its props (product, onAddToCart) actually change.
import { memo } from "react";
import { Link } from "react-router";
import { formatPrice } from "../../utils/format";
import { usePrefetchProduct } from "./useProducts";
import type { Product } from "../../types";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export const ProductCard = memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const prefetchProduct = usePrefetchProduct();

  return (
    <article className="group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-900/5">
      <Link
        to={`/products/${product.id}`}
        className="block"
        onMouseEnter={() => prefetchProduct(product.id)}
        onFocus={() => prefetchProduct(product.id)}
      >
        <div
          className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-zinc-100 to-violet-100/60 text-6xl transition group-hover:scale-[1.02] dark:from-zinc-800 dark:to-violet-950/40"
          aria-hidden="true"
        >
          {product.image}
        </div>
        <div className="px-4 pt-4">
          <p className="muted text-xs capitalize">
            {product.category} · ★ {product.rating}
          </p>
          <h3 className="mt-1 font-medium">{product.title}</h3>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-2 p-4">
        <strong className="text-lg">{formatPrice(product.price)}</strong>
        <button className="btn btn-primary px-3 py-2" onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
});
