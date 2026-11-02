// createEntityAdapter stores cart items normalised as { ids: [], entities: {} }
// and gives us ready-made reducers (addOne, updateOne, removeOne…) and selectors.
import { createEntityAdapter } from "@reduxjs/toolkit";
import type { CartItem } from "../../types";

export const cartAdapter = createEntityAdapter<CartItem>();
