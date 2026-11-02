// Integration-style unit test: Formik form + TanStack mutation + MSW + Redux.
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import LoginPage from "../features/auth/LoginPage";
import { renderWithProviders } from "../test/test-utils";

describe("LoginPage", () => {
  test("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: "/login" });

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test("logs in and stores the token in Redux", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginPage />, { route: "/login" });

    await user.type(screen.getByLabelText(/email/i), "demo@shop.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await screen.findByText(/welcome back, demo user/i); // toast
    expect(store.getState().auth.token).toMatch(/^mock-jwt\./);
  });

  test("shows the server error when credentials are wrong", async () => {
    server.use(
      http.post("/api/auth/login", () => HttpResponse.json({ message: "Invalid email or password" }, { status: 401 })),
    );
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: "/login" });

    await user.type(screen.getByLabelText(/email/i), "demo@shop.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-pass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid email or password/i);
  });
});
