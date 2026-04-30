import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ToastProvider } from "./components/ds/Toast";

export default function App() {
  return (
    <ToastProvider position="top-center">
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
