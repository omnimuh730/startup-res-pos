import { createBrowserRouter, createHashRouter, Navigate } from "react-router";
import { SplashGate } from "./SplashGate";
import { AuthLayout } from "./AuthLayout";
import { RequireAuth } from "./RequireAuth";
import { AppLayout } from "./AppLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { DiscoverPage } from "./pages/discover/DiscoverPage";
import { DiningPage } from "./pages/dining/DiningPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { SavedRoute, QRPayRoute } from "./routeWrappers";

const routes = [
  {
    path: "/",
    Component: SplashGate,
    children: [
      { index: true, element: <Navigate to="/discover" replace /> },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { index: true, element: <Navigate to="/auth/login" replace /> },
          { path: "login", Component: LoginPage },
          { path: "register", Component: RegisterPage },
          { path: "forgot", Component: ForgotPasswordPage },
        ],
      },
      {
        Component: RequireAuth,
        children: [
          { path: "qrpay", Component: QRPayRoute },
        ],
      },
      {
        Component: AppLayout,
        children: [
          { path: "discover/*", Component: DiscoverPage },
          { path: "explorer/*", element: <Navigate to="/discover" replace /> },
          {
            Component: RequireAuth,
            children: [
              { path: "wishlist", Component: SavedRoute },
              { path: "saved", element: <Navigate to="/wishlist" replace /> },
              { path: "notifications", element: <Navigate to="/profile/notifications" replace /> },
              { path: "dining/*", Component: DiningPage },
              { path: "profile/*", Component: ProfilePage },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to="/discover" replace /> },
    ],
  },
];

function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export const router = isTauriRuntime()
  ? createHashRouter(routes)
  : createBrowserRouter(routes);
