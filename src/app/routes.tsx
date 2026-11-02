// Route config: nested routes under a layout, lazy pages, protected checkout, 404.
import { lazy } from "react";
import type { RouteObject } from "react-router";
import { Layout } from "../components/Layout";
import { withAuth } from "../hoc/withAuth";
import { withSuspense } from "../hoc/withSuspense";

// Code splitting: each page becomes its own chunk, loaded on first visit
const HomePage = withSuspense(lazy(() => import("../features/home/HomePage")));
const ProductsPage = withSuspense(lazy(() => import("../features/products/ProductsPage")));
const ProductDetailsPage = withSuspense(lazy(() => import("../features/products/ProductDetailsPage")));
const CartPage = withSuspense(lazy(() => import("../features/cart/CartPage")));
const LoginPage = withSuspense(lazy(() => import("../features/auth/LoginPage")));
const RegisterPage = withSuspense(lazy(() => import("../features/auth/RegisterPage")));
const NotFoundPage = withSuspense(lazy(() => import("../components/NotFoundPage")));

// HOCs compose: login required + lazy loading
const CheckoutPage = withAuth(withSuspense(lazy(() => import("../features/checkout/CheckoutPage"))));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:productId", element: <ProductDetailsPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
