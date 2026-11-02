// MSW request handlers: intercept /api/* calls and answer from the mock db.
import { delay, http, HttpResponse } from "msw";
import { ApiError, db } from "./db";
import type { LoginRequest, OrderRequest, RegisterRequest } from "../types";

// Turn db results into JSON responses, and ApiErrors into error responses.
function respond(getData: () => unknown, status = 200) {
  try {
    return HttpResponse.json(getData() as object, { status });
  } catch (error) {
    if (error instanceof ApiError) {
      return HttpResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}

export const handlers = [
  http.get("/api/products", async ({ request }) => {
    await delay(400); // simulate network latency so loading states are visible
    const category = new URL(request.url).searchParams.get("category");
    return respond(() => db.getProducts(category));
  }),

  http.get("/api/products/:id", async ({ params }) => {
    await delay(300);
    return respond(() => db.getProduct(Number(params.id)));
  }),

  http.get("/api/categories", () => respond(() => db.getCategories())),

  http.post("/api/auth/login", async ({ request }) => {
    await delay(500);
    const { email, password } = (await request.json()) as LoginRequest;
    return respond(() => db.login(email, password));
  }),

  http.post("/api/auth/register", async ({ request }) => {
    await delay(500);
    const { name, email, password } = (await request.json()) as RegisterRequest;
    return respond(() => db.register(name, email, password), 201);
  }),

  // Protected: the handler reads the bearer token set by the axios interceptor
  http.post("/api/orders", async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as OrderRequest;
    return respond(() => db.createOrder(request.headers.get("Authorization"), body), 201);
  }),

  http.post("/api/newsletter", async ({ request }) => {
    await delay(400);
    const { email } = (await request.json()) as { email: string };
    return respond(() => db.subscribe(email), 201);
  }),
];
