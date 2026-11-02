// Selectors: adapter selectors + memoized derived data with createSelector.
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { cartAdapter } from "./cartAdapter";

const adapterSelectors = cartAdapter.getSelectors<RootState>(state => state.cart);

export const selectCartItems = adapterSelectors.selectAll;
export const selectCartItemById = adapterSelectors.selectById;

// Recomputed only when the cart items change
export const selectCartCount = createSelector([selectCartItems], items =>
  items.reduce((count, item) => count + item.quantity, 0),
);

export const selectCartTotal = createSelector([selectCartItems], items =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);
