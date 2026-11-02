// Top nav: Home + Products on the left, theme / account / cart on the right.
import { Link, NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectUser } from "../features/auth/authSlice";
import { selectCartCount } from "../features/cart/cartSelectors";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

// NavLink gives us an `isActive` flag for the current route
const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-2.5 py-2 text-sm sm:px-3 font-medium transition ${
    isActive
      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
  }`;

export function Navbar() {
  const user = useAppSelector(selectUser);
  const cartCount = useAppSelector(selectCartCount);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const showToast = useToast();

  function handleLogout() {
    dispatch(logout());
    showToast("You have been logged out", "info");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-1.5 px-3 sm:gap-2 sm:px-6">
        {/* Left: brand + main links */}
        <Link to="/" className="mr-1 flex items-center gap-2 text-base font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-violet-600 text-sm text-white">S</span>
          <span className="hidden sm:inline">ShopEase</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>
        </nav>

        {/* Right: theme, account, cart */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "☾" : "☀"}
          </button>
          {user ? (
            <>
              <span className="muted hidden text-sm md:inline">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-ghost px-2.5 sm:px-3" onClick={handleLogout} aria-label="Logout">
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 sm:hidden"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-ghost px-2.5 sm:px-3" aria-label="Login">
              <svg
                viewBox="0 0 24 24"
                className="size-4 sm:hidden"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">Login</span>
            </NavLink>
          )}
          <NavLink
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 sm:px-3.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2m6 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-violet-500 px-1.5 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
