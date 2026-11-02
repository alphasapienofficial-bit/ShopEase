// Register: Formik + Yup (incl. confirm password) + server error on a field.
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router";
import { FormField } from "../../components/FormField";
import { getErrorMessage } from "../../api/apiClient";
import { useAppSelector } from "../../app/hooks";
import { useToast } from "../../context/ToastContext";
import { selectIsLoggedIn } from "./authSlice";
import { useRegister } from "./useAuthMutations";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerSchema = Yup.object({
  name: Yup.string().trim().min(2, "At least 2 characters").required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const initialValues: RegisterValues = { name: "", email: "", password: "", confirmPassword: "" };

export default function RegisterPage() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const register = useRegister();
  const navigate = useNavigate();
  const showToast = useToast();

  if (isLoggedIn) return <Navigate to="/" replace />;

  return (
    <section className="mx-auto w-full max-w-sm pt-6">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-violet-600 font-bold text-white">
          S
        </span>
        <h1 className="text-2xl">Create your account</h1>
        <p className="muted mt-1 text-sm">It takes less than a minute</p>
      </div>
      <div className="card p-6 shadow-sm">
        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={async ({ name, email, password }, { setFieldError, setStatus }) => {
            setStatus(null);
            try {
              await register.mutateAsync({ name, email, password });
              showToast("Account created — you're logged in!");
              navigate("/products", { replace: true });
            } catch (error) {
              // 409 → show the server message under the email field
              if (axios.isAxiosError(error) && error.response?.status === 409) {
                setFieldError("email", getErrorMessage(error));
              } else {
                setStatus(getErrorMessage(error));
              }
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
              <FormField label="Full name" name="name" autoComplete="name" />
              <FormField label="Email" name="email" type="email" autoComplete="email" />
              <FormField label="Password" name="password" type="password" autoComplete="new-password" />
              <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" />
              <button type="submit" className="btn btn-primary mt-1 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account…" : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <p className="muted mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
          Log in
        </Link>
      </p>
    </section>
  );
}
