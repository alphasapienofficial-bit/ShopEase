// Auth slice: who is logged in + their token (read by the axios interceptor).
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { AuthResponse, User } from "../../types";

type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState: AuthState = { user: null, token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user; // Immer lets us "mutate" safely
      state.token = action.payload.token;
    },
    logout() {
      return initialState;
    },
  },
});

export const { loggedIn, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => Boolean(state.auth.token);
