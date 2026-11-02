// Login: Formik + Yup validation, TanStack useMutation, router redirect back.
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { FormField } from "../../components/FormField";
import { getErrorMessage } from "../../api/apiClient";
import { useAppSelector } from "../../app/hooks";
import { useToast } from "../../context/ToastContext";
import { selectIsLoggedIn } from "./authSlice";
import { useLogin } from "./useAuthMutations";
import type { LoginRequest } from "../../types";

const loginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
});

const initialValues: LoginRequest = { email: "", password: "" };

export default function LoginPage() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  // withAuth puts the page the user wanted into location.state
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  if (isLoggedIn) return <Navigate to={redirectTo} replace />;

  return (
    <section className="mx-auto w-full max-w-sm pt-6">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-violet-600 font-bold text-white">
          S
        </span>
        <h1 className="text-2xl">Welcome back</h1>
        <p className="muted mt-1 text-sm">Sign in to continue shopping</p>
      </div>
      <div className="card p-6 shadow-sm">
        <p className="mb-5 rounded-xl bg-violet-50 px-3.5 py-2.5 text-xs text-violet-800 dark:bg-violet-500/10 dark:text-violet-300">
          Demo account: <strong>demo@shop.com</strong> / <strong>password123</strong>
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={async (values, { setStatus }) => {
            setStatus(null);
            try {
              const session = await login.mutateAsync(values);
              showToast(`Welcome back, ${session.user.name}!`);
              navigate(redirectTo, { replace: true });
            } catch (error) {
              setStatus(getErrorMessage(error)); // e.g. "Invalid email or password"
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form noValidate className="grid gap-4">
              {status && (
                <p
                  className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400"
                  role="alert"
                >
                  {status}
                </p>
              )}
              <FormField label="Email" name="email" type="email" autoComplete="email" />
              <FormField label="Password" name="password" type="password" autoComplete="current-password" />
              <button type="submit" className="btn btn-primary mt-1 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <p className="muted mt-6 text-center text-sm">
        New here?{" "}
        <Link to="/register" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
          Create an account
        </Link>
      </p>
    </section>
  );
}
