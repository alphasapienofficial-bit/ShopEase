// Shared TypeScript types used across the app

export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string; // emoji used as a lightweight product image
  rating: number;
  stock: number;
  description: string;
};

export type ProductsResponse = {
  items: Product[];
  total: number;
};

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { name: string; email: string; password: string };

export type CartItem = {
  id: number; // same as the product id
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export type ShippingDetails = {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
};

export type OrderRequest = {
  items: { id: number; quantity: number }[];
  shipping: ShippingDetails;
};

export type Order = {
  id: string;
  total: number;
  itemCount: number;
  createdAt: string;
};

export type ApiErrorBody = { message: string };
