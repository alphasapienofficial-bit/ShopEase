// createAsyncThunk: async logic that dispatches pending / fulfilled / rejected.
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { ordersApi } from "../../api/ordersApi";
import { getErrorMessage } from "../../api/apiClient";
import { selectCartItems } from "../cart/cartSelectors";
import type { Order, ShippingDetails } from "../../types";

export const placeOrder = createAsyncThunk<
  Order, // what fulfilled returns
  ShippingDetails, // argument passed to dispatch(placeOrder(...))
  { state: RootState; rejectValue: string }
>("orders/place", async (shipping, { getState, rejectWithValue }) => {
  const items = selectCartItems(getState()).map(({ id, quantity }) => ({ id, quantity }));
  try {
    return await ordersApi.createOrder({ items, shipping });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
