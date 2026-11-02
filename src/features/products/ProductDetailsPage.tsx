// Product details: route params (useParams) + a dependent TanStack query.
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useToast } from "../../context/ToastContext";
import { QueryBoundary } from "../../components/QueryBoundary";
import { formatPrice } from "../../utils/format";
import { addedToCart } from "../cart/cartSlice";
import { selectCartItemById } from "../cart/cartSelectors";
import { useProduct } from "./useProducts";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const id = Number(productId);
  const productQuery = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const inCart = useAppSelector(state => selectCartItemById(state, id));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showToast = useToast();

  // Side effect: update the browser tab title
  useEffect(() => {
    if (productQuery.data) document.title = `${productQuery.data.title} · ShopEase`;
    return () => {
      document.title = "ShopEase";
    };
  }, [productQuery.data]);

  return (
    <section>
      <Link
        to="/products"
        className="muted mb-6 inline-flex items-center gap-1 text-sm hover:text-zinc-900 dark:hover:text-white"
      >
        ← Back to products
      </Link>

      <QueryBoundary query={productQuery} loadingText="Loading product…">
        {product => (
          <div className="grid gap-8 md:grid-cols-2">
            <div
              className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-zinc-100 to-violet-100 text-[9rem] ring-1 ring-zinc-200/80 dark:from-zinc-900 dark:to-violet-950/50 dark:ring-zinc-800"
              aria-hidden="true"
            >
              {product.image}
            </div>
            <div className="flex flex-col justify-center">
              <p className="muted text-sm capitalize">
                {product.category} · ★ {product.rating} · {product.stock} in stock
              </p>
              <h1 className="mt-2 text-4xl">{product.title}</h1>
              <p className="muted mt-4 leading-relaxed">{product.description}</p>
              <p className="mt-6 text-3xl font-semibold">{formatPrice(product.price)}</p>

              <div className="mt-6 inline-flex w-fit items-center gap-4 rounded-xl p-1 ring-1 ring-zinc-200 dark:ring-zinc-800">
                <button
                  className="icon-btn ring-0"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span aria-live="polite" className="w-6 text-center font-medium">
                  {quantity}
                </span>
                <button
                  className="icon-btn ring-0"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="btn btn-primary px-6"
                  onClick={() => {
                    dispatch(addedToCart(product, quantity));
                    showToast(`Added ${quantity} × ${product.title}`);
                  }}
                >
                  Add to cart
                </button>
                <button
                  className="btn btn-secondary px-6"
                  onClick={() => {
                    dispatch(addedToCart(product, quantity));
                    navigate("/cart");
                  }}
                >
                  Buy now
                </button>
              </div>
              {inCart && <p className="muted mt-4 text-sm">You already have {inCart.quantity} in your cart.</p>}
            </div>
          </div>
        )}
      </QueryBoundary>
    </section>
  );
}
