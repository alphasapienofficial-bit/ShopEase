// A tiny in-memory "backend". MSW handlers call these functions,
// so the React app talks to it exactly like a real REST API.
import type { AuthResponse, Order, OrderRequest, Product, ProductsResponse, User } from "../types";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const products: Product[] = [
  { id: 1, title: "Wireless Headphones", price: 2999, category: "electronics", image: "🎧", rating: 4.6, stock: 12, description: "Noise-cancelling over-ear headphones with 30-hour battery life." },
  { id: 2, title: "Smart Watch", price: 4999, category: "electronics", image: "⌚", rating: 4.4, stock: 8, description: "Track workouts, sleep and notifications from your wrist." },
  { id: 3, title: "Bluetooth Speaker", price: 1799, category: "electronics", image: "🔊", rating: 4.3, stock: 20, description: "Pocket-sized speaker with deep bass and splash resistance." },
  { id: 4, title: "Mechanical Keyboard", price: 3499, category: "electronics", image: "⌨️", rating: 4.7, stock: 5, description: "Tactile switches, RGB backlight and a compact 75% layout." },
  { id: 5, title: "Running Shoes", price: 2499, category: "fashion", image: "👟", rating: 4.5, stock: 15, description: "Lightweight, breathable shoes for everyday runs." },
  { id: 6, title: "Denim Jacket", price: 1999, category: "fashion", image: "🧥", rating: 4.2, stock: 9, description: "Classic blue denim jacket with a relaxed fit." },
  { id: 7, title: "Sunglasses", price: 899, category: "fashion", image: "🕶️", rating: 4.1, stock: 30, description: "UV400 polarised lenses in a lightweight frame." },
  { id: 8, title: "Backpack", price: 1299, category: "fashion", image: "🎒", rating: 4.6, stock: 18, description: "Water-resistant backpack with a padded laptop sleeve." },
  { id: 9, title: "Coffee Maker", price: 3299, category: "home", image: "☕", rating: 4.4, stock: 7, description: "Brews a full pot of fresh coffee in under 5 minutes." },
  { id: 10, title: "Desk Lamp", price: 999, category: "home", image: "💡", rating: 4.0, stock: 25, description: "Adjustable LED lamp with three brightness levels." },
  { id: 11, title: "Indoor Plant", price: 599, category: "home", image: "🪴", rating: 4.8, stock: 40, description: "Low-maintenance plant that brightens any room." },
  { id: 12, title: "Scented Candle", price: 449, category: "home", image: "🕯️", rating: 4.3, stock: 50, description: "Hand-poured soy candle with a calming lavender scent." },
];

type StoredUser = User & { password: string };

const users: StoredUser[] = [
  { id: 1, name: "Demo User", email: "demo@shop.com", password: "password123" },
];

const subscribers = new Set<string>();

const toPublicUser = ({ id, name, email }: StoredUser): User => ({ id, name, email });

// A fake "JWT": real backends sign tokens; here we just encode the user id.
function issueToken(user: StoredUser): AuthResponse {
  return { user: toPublicUser(user), token: `mock-jwt.${btoa(String(user.id))}` };
}

function userFromAuthHeader(header?: string | null): StoredUser {
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const id = token?.startsWith("mock-jwt.") ? Number(atob(token.slice(9))) : NaN;
  const user = users.find(u => u.id === id);
  if (!user) throw new ApiError(401, "Your session has expired. Please log in again.");
  return user;
}

export const db = {
  getProducts(category?: string | null): ProductsResponse {
    const items = category ? products.filter(p => p.category === category) : products;
    return { items, total: items.length };
  },

  getProduct(id: number): Product {
    const product = products.find(p => p.id === id);
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  },

  getCategories(): string[] {
    return [...new Set(products.map(p => p.category))];
  },

  login(email: string, password: string): AuthResponse {
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user || user.password !== password) throw new ApiError(401, "Invalid email or password");
    return issueToken(user);
  },

  register(name: string, email: string, password: string): AuthResponse {
    const normalized = email.toLowerCase();
    if (users.some(u => u.email === normalized)) throw new ApiError(409, "This email is already registered");
    const user: StoredUser = { id: users.length + 1, name, email: normalized, password };
    users.push(user);
    return issueToken(user);
  },

  // Protected endpoint: requires "Authorization: Bearer <token>"
  createOrder(authHeader: string | null | undefined, body: OrderRequest): Order {
    userFromAuthHeader(authHeader);
    if (!body.items?.length) throw new ApiError(400, "Your cart is empty");
    const total = body.items.reduce((sum, item) => sum + this.getProduct(item.id).price * item.quantity, 0);
    const itemCount = body.items.reduce((n, item) => n + item.quantity, 0);
    return { id: `ORD-${Date.now().toString().slice(-6)}`, total, itemCount, createdAt: new Date().toISOString() };
  },

  subscribe(email: string): { message: string } {
    if (subscribers.has(email)) throw new ApiError(409, "You're already subscribed");
    subscribers.add(email);
    return { message: "Subscribed" };
  },
};
