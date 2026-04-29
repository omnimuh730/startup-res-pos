import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { useResolvedAppTheme } from "../theme/appTheme";

export default function App() {
  const theme = useResolvedAppTheme();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton theme={theme} />
      <Toaster position="bottom-right" richColors closeButton theme={theme} />
    </>
  );
}
