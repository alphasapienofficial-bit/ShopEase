// Axios interceptors run on EVERY request/response made with apiClient.
// They receive the Redux store so they can read the token and dispatch logout.
import type { AppStore } from "../app/store";
import { apiClient } from "./apiClient";
import { logout } from "../features/auth/authSlice";

let registered: { request: number; response: number } | null = null;

export function setupInterceptors(store: AppStore) {
  // Remove previously registered interceptors (tests create a new store each time)
  if (registered) {
    apiClient.interceptors.request.eject(registered.request);
    apiClient.interceptors.response.eject(registered.response);
  }

  // 1. REQUEST interceptor: attach the bearer token
  const request = apiClient.interceptors.request.use(config => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 2. RESPONSE interceptor: handle expired / invalid sessions in one place
  const response = apiClient.interceptors.response.use(
    res => res,
    error => {
      const isAuthRequest = String(error.config?.url ?? "").startsWith("/auth");
      if (error.response?.status === 401 && !isAuthRequest) {
        // Token is invalid → clear the session. Protected routes then redirect to /login.
        store.dispatch(logout());
      }
      return Promise.reject(error);
    },
  );

  registered = { request, response };
}
