import { createBrowserRouter, Navigate } from "react-router";
import { Suspense, type ReactNode } from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Helper: React Router's route-level lazy for default exports
const rl = (imp: () => Promise<any>) => ({
  lazy: async () => {
    const mod = await imp();
    return { Component: mod.default };
  },
  HydrateFallback,
});

// Helper: React Router's route-level lazy for named exports
const rln = (imp: () => Promise<any>, name: string) => ({
  lazy: async () => {
    const mod = await imp();
    return { Component: mod[name] };
  },
  HydrateFallback,
});

export const router = createBrowserRouter([
  // Default route → Sign In
  { path: "/", element: <Navigate to="/signin" replace /> },
  // Auth pages
  { path: "/signin", ...rl(() => import("./pages/pos/SignIn")) },
  { path: "/signup", ...rl(() => import("./pages/pos/SignUp")) },
  { path: "/lock", ...rl(() => import("./pages/pos/LockScreen")) },
  // POS System (main app, after auth)
  {
    path: "/pos",
    ...rl(() => import("./pages/pos/POSLayout")),
    children: [
      { index: true, ...rl(() => import("./pages/pos/floor-plan")) },
      { path: "orders", ...rl(() => import("./pages/pos/orders")) },
      { path: "kitchen", ...rl(() => import("./pages/pos/kitchen")) },
      { path: "analytics", ...rl(() => import("./pages/pos/Analytics")) },
      { path: "settings", ...rl(() => import("./pages/pos/settings")) },
      { path: "payment", ...rl(() => import("./pages/pos/payment")) },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/signin" replace />,
  },
]);