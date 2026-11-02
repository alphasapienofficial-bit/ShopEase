import { apiClient } from "./apiClient";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const authApi = {
  async login(body: LoginRequest) {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", body);
    return data;
  },

  async register(body: RegisterRequest) {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", body);
    return data;
  },
};
