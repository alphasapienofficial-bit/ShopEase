// React 19 form Action + useActionState: pending state & result without useState.
import { useActionState } from "react";
import { ordersApi } from "../../api/ordersApi";
import { getErrorMessage } from "../../api/apiClient";

type NewsletterState = { status: "idle" | "success" | "error"; message: string };

async function subscribeAction(_previous: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "");
  try {
    await ordersApi.subscribeNewsletter(email);
    return { status: "success", message: "Thanks for subscribing!" };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribeAction, { status: "idle", message: "" });

  return (
    <form
      action={formAction}
      className="card mt-12 flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 className="text-xl">Get deals in your inbox</h2>
        <p className="muted mt-1 text-sm">One email a week. No spam.</p>
        {state.message && (
          <p
            className={state.status === "error" ? "mt-2 text-sm text-red-600" : "mt-2 text-sm text-emerald-600"}
            role="status"
          >
            {state.message}
          </p>
        )}
      </div>
      <div className="flex w-full gap-2 sm:max-w-sm">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          className="input"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <button className="btn btn-primary shrink-0" disabled={isPending}>
          {isPending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
    </form>
  );
}
