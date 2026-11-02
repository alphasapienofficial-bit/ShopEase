// Cart slice: createSlice + entity adapter + prepare callback + extraReducers.
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { cartAdapter } from "./cartAdapter";
import { placeOrder } from "../checkout/orderThunks";
import type { CartItem, Product } from "../../types";

const cartSlice = createSlice({
  name: "cart",
  initialState: cartAdapter.getInitialState(),
  reducers: {
    // prepare() shapes the payload, so components can just pass a product
    addedToCart: {
      reducer(state, action: PayloadAction<CartItem>) {
        const existing = state.entities[action.payload.id];
        if (existing) {
          existing.quantity += action.payload.quantity;
        } else {
          cartAdapter.addOne(state, action.payload);
        }
      },
      prepare(product: Product, quantity = 1) {
        const { id, title, price, image } = product;
        return { payload: { id, title, price, image, quantity } };
      },
    },

    quantityChanged(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        cartAdapter.removeOne(state, id);
      } else {
        cartAdapter.updateOne(state, { id, changes: { quantity } });
      }
    },

    removedFromCart: cartAdapter.removeOne,
    cartCleared: cartAdapter.removeAll,
  },

  // React to an action defined elsewhere: empty the cart after a successful order
  extraReducers: builder => {
    builder.addCase(placeOrder.fulfilled, state => {
      cartAdapter.removeAll(state);
    });
  },
});

export const { addedToCart, quantityChanged, removedFromCart, cartCleared } = cartSlice.actions;
export default cartSlice.reducer;
