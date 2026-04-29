/* Auth routes layout — redirects to app if already authed */
import { useSyncExternalStore } from "react";
import { Navigate, Outlet } from "react-router";
import { AnimatePresence } from "motion/react";
import { authStore } from "./stores/authStore";

export function AuthLayout() {
  const authed = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
  if (authed) return <Navigate to="/discover" replace />;
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-white">
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </div>
  );
}
