// Cart: reads Redux with memoized selectors, confirms removal in a portal modal.
import { useCallback, useState } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Modal from "../../components/Modal";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/format";
import { CartItemRow } from "./CartItemRow";
import { removedFromCart } from "./cartSlice";
import { selectCartCount, selectCartItems, selectCartTotal } from "./cartSelectors";
import type { CartItem } from "../../types";

export default function CartPage() {
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();
  const showToast = useToast();
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const askToRemove = useCallback((item: CartItem) => setItemToRemove(item), []);
  const closeModal = useCallback(() => setItemToRemove(null), []);

  function confirmRemove() {
    if (!itemToRemove) return;
    dispatch(removedFromCart(itemToRemove.id));
    showToast(`${itemToRemove.title} removed`, "info");
    setItemToRemove(null);
  }

  if (items.length === 0) {
    return (
      <section className="grid justify-items-center gap-4 py-24 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-zinc-100 text-3xl dark:bg-zinc-900">🛒</span>
        <h1 className="text-2xl">Your cart is empty</h1>
        <p className="muted text-sm">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h1 className="text-3xl">Your cart</h1>
        <span className="muted text-sm">{count} items</span>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <ul className="card divide-y divide-zinc-200 px-5 dark:divide-zinc-800">
          {items.map(item => (
            <CartItemRow key={item.id} item={item} onRemove={askToRemove} />
          ))}
        </ul>

        <div className="card p-6 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between">
            <span className="muted text-sm">Total</span>
            <strong className="text-2xl">{formatPrice(total)}</strong>
          </div>
          <Link to="/checkout" className="btn btn-primary mt-5 w-full">
            Proceed to checkout
          </Link>
        </div>
      </div>

      {/* Rendered in #modal-root through createPortal */}
      <Modal open={itemToRemove !== null} onClose={closeModal} titleId="remove-title">
        <Modal.Header id="remove-title">Remove item?</Modal.Header>
        <Modal.Body>
          <p>
            Remove <strong>{itemToRemove?.title}</strong> from your cart?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={confirmRemove}>
            Remove
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
