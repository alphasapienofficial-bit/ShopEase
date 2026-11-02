import { memo } from "react";
import { useAppDispatch } from "../../app/hooks";
import { formatPrice } from "../../utils/format";
import { quantityChanged } from "./cartSlice";
import type { CartItem } from "../../types";

type CartItemRowProps = {
  item: CartItem;
  onRemove: (item: CartItem) => void;
};

export const CartItemRow = memo(function CartItemRow({ item, onRemove }: CartItemRowProps) {
  const dispatch = useAppDispatch();
  const setQuantity = (quantity: number) => dispatch(quantityChanged({ id: item.id, quantity }));

  return (
    <li className="flex flex-wrap items-center gap-4 py-5">
      <span
        className="grid size-16 place-items-center rounded-xl bg-zinc-100 text-3xl dark:bg-zinc-800"
        aria-hidden="true"
      >
        {item.image}
      </span>
      <div className="flex min-w-32 flex-1 flex-col">
        <strong className="font-medium">{item.title}</strong>
        <span className="muted text-sm">{formatPrice(item.price)} each</span>
      </div>
      <div className="flex items-center gap-2 rounded-xl p-1 ring-1 ring-zinc-200 dark:ring-zinc-800">
        <button
          className="icon-btn size-7 ring-0"
          aria-label={`Decrease ${item.title}`}
          onClick={() => setQuantity(item.quantity - 1)}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
        <button
          className="icon-btn size-7 ring-0"
          aria-label={`Increase ${item.title}`}
          onClick={() => setQuantity(item.quantity + 1)}
        >
          +
        </button>
      </div>
      <strong className="w-24 text-right">{formatPrice(item.price * item.quantity)}</strong>
      <button
        className="btn btn-ghost px-3 text-red-600 hover:text-red-700 dark:text-red-400"
        onClick={() => onRemove(item)}
      >
        Remove
      </button>
    </li>
  );
});
