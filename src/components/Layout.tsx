// Root layout route: shared navbar + footer, pages render inside <Outlet />.
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { OnlineBanner } from "./OnlineBanner";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <OnlineBanner />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <footer className="muted border-t border-zinc-200 py-6 text-center text-sm dark:border-zinc-800">
        © ShopEase · Capstone project
      </footer>
    </div>
  );
}
