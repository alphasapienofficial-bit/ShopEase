// Data router for the browser (history API URLs like /products?category=home).
import { createBrowserRouter } from "react-router";
import { routes } from "./routes";

export const router = createBrowserRouter(routes);
