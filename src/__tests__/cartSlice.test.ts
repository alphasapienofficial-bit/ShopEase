// Unit tests for the cart reducer + memoized selectors (no React needed).
import cartReducer, { addedToCart, quantityChanged } from "../features/cart/cartSlice";
import { selectCartCount, selectCartTotal } from "../features/cart/cartSelectors";
import type { RootState } from "../app/store";
import type { Product } from "../types";

const headphones: Product = {
  id: 1, title: "Wireless Headphones", price: 2999, category: "electronics",
  image: "🎧", rating: 4.6, stock: 12, description: "",
};

describe("cartSlice", () => {
  test("adding the same product twice increases its quantity", () => {
    let state = cartReducer(undefined, addedToCart(headphones));
    state = cartReducer(state, addedToCart(headphones, 2));

    expect(state.ids).toEqual([1]);
    expect(state.entities[1]?.quantity).toBe(3);
  });

  test("setting quantity to 0 removes the item", () => {
    let state = cartReducer(undefined, addedToCart(headphones));
    state = cartReducer(state, quantityChanged({ id: 1, quantity: 0 }));

    expect(state.ids).toEqual([]);
  });

  test("selectors compute count and total", () => {
    const cart = cartReducer(undefined, addedToCart(headphones, 2));
    const rootState = { cart } as RootState;

    expect(selectCartCount(rootState)).toBe(2);
    expect(selectCartTotal(rootState)).toBe(5998);
  });
});
