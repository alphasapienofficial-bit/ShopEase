import { apiClient } from "./apiClient";
import type { Product, ProductsResponse } from "../types";

export const productsApi = {
  async getProducts(category?: string) {
    const { data } = await apiClient.get<ProductsResponse>("/products", { params: { category } });
    return data;
  },

  async getProduct(id: number) {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  async getCategories() {
    const { data } = await apiClient.get<string[]>("/categories");
    return data;
  },
};
