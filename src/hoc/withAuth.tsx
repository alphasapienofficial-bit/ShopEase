// HOC: wraps a page so only logged-in users can see it.
import type { ComponentType } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../app/hooks";
import { selectIsLoggedIn } from "../features/auth/authSlice";

export function withAuth<P extends object>(Component: ComponentType<P>) {
  function ProtectedComponent(props: P) {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const location = useLocation();

    if (!isLoggedIn) {
      // Remember where the user was going, so login can send them back
      return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    return <Component {...props} />;
  }

  ProtectedComponent.displayName = `withAuth(${Component.displayName ?? Component.name ?? "Component"})`;
  return ProtectedComponent;
}
