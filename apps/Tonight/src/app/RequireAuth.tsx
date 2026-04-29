/* Auth guard — redirects to /auth/login if unauthenticated */
import { useSyncExternalStore } from "react";
import { Navigate, Outlet, useLocation, useOutletContext } from "react-router";
import { authStore } from "./stores/authStore";

export function RequireAuth() {
  const authed = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
  const location = useLocation();
  const parentCtx = useOutletContext();
  if (!authed) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet context={parentCtx} />;
}
