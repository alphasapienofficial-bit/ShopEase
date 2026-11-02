import { apiClient } from "./apiClient";
import type { Order, OrderRequest } from "../types";

export const ordersApi = {
  // Protected endpoint: the request interceptor adds "Authorization: Bearer <token>"
  async createOrder(body: OrderRequest) {
    const { data } = await apiClient.post<Order>("/orders", body);
    return data;
  },

  async subscribeNewsletter(email: string) {
    const { data } = await apiClient.post<{ message: string }>("/newsletter", { email });
    return data;
  },
};
