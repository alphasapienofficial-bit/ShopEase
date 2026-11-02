// Redux Toolkit store: configureStore + combineReducers + listener middleware.
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import ordersReducer from "../features/checkout/ordersSlice";
import { listenerMiddleware } from "./listeners";
import { loadState } from "./storage";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  orders: ordersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// A factory makes it easy to create a fresh store in tests.
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    // configureStore already adds thunk + dev checks; we prepend our listener.
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });
}

export const store = makeStore(loadState());

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
