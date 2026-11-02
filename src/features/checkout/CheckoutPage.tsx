// Checkout (protected by withAuth): Formik form → dispatch(createAsyncThunk) → success modal.
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Modal from "../../components/Modal";
import { FormField } from "../../components/FormField";
import { formatPrice } from "../../utils/format";
import { selectUser } from "../auth/authSlice";
import { selectCartCount, selectCartTotal } from "../cart/cartSelectors";
import { placeOrder } from "./orderThunks";
import type { Order, ShippingDetails } from "../../types";

const shippingSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  address: Yup.string().min(5, "Enter your full address").required("Address is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
});

export default function CheckoutPage() {
  const user = useAppSelector(selectUser);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  const initialValues: ShippingDetails = { fullName: user?.name ?? "", address: "", city: "", pincode: "" };

  if (count === 0 && !order) {
    return (
      <section className="grid justify-items-center gap-4 py-24 text-center">
        <h1 className="text-2xl">Nothing to check out</h1>
        <Link to="/products" className="btn btn-primary">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="card p-6">
        <h1 className="mb-6 text-2xl">Shipping details</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={shippingSchema}
          onSubmit={async (values, { setStatus }) => {
            setStatus(null);
            try {
              // unwrap() returns the fulfilled payload or throws the rejected value
              const placed = await dispatch(placeOrder(values)).unwrap();
              setOrder(placed);
            } catch (message) {
              setStatus(String(message));
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
              <FormField label="Full name" name="fullName" autoComplete="name" />
              <FormField label="Address" name="address" autoComplete="street-address" />
              <FormField label="City" name="city" autoComplete="address-level2" />
              <FormField label="Pincode" name="pincode" autoComplete="postal-code" />
              <button type="submit" className="btn btn-primary mt-2 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Placing order…" : `Pay ${formatPrice(total)}`}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <aside className="card p-6 lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg">Order summary</h2>
        <div className="flex justify-between text-sm">
          <span className="muted">Items</span>
          <span>{count}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="muted">Shipping</span>
          <span className="text-emerald-600">Free</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 font-semibold dark:border-zinc-800">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="muted mt-4 text-xs">Your token is sent as a Bearer header by the axios interceptor.</p>
      </aside>

      <Modal open={order !== null} onClose={() => navigate("/products")} titleId="order-title">
        <Modal.Header id="order-title">🎉 Order placed!</Modal.Header>
        <Modal.Body>
          <p>
            Order <strong>{order?.id}</strong> for {order?.itemCount} items ({order ? formatPrice(order.total) : ""}) is
            confirmed.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>
            Continue shopping
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
