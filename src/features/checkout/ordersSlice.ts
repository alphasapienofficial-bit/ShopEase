// Orders slice: tracks the placeOrder thunk's lifecycle with extraReducers.
import { createSlice } from "@reduxjs/toolkit";
import { placeOrder } from "./orderThunks";
import type { Order } from "../../types";

type OrdersState = {
  status: "idle" | "pending" | "succeeded" | "failed";
  lastOrder: Order | null;
  error: string | null;
};

const initialState: OrdersState = { status: "idle", lastOrder: null, error: null };

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    orderStatusReset(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(placeOrder.pending, state => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not place order";
      });
  },
});

export const { orderStatusReset } = ordersSlice.actions;
export default ordersSlice.reducer;
