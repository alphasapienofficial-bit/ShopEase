import { Link, useLocation } from "react-router";

export default function NotFoundPage() {
  const location = useLocation();
  return (
    <section className="grid justify-items-center gap-4 py-24 text-center">
      <p className="text-6xl font-bold text-violet-600">404</p>
      <h1 className="text-2xl">Page not found</h1>
      <p className="muted">
        Nothing lives at <code>{location.pathname}</code>.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </section>
  );
}
