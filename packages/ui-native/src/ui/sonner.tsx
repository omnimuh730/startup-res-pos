import * as React from "react";
import { ToastProvider as BaseToastProvider } from "../components/Feedback";

export type SonnerProps = React.ComponentProps<typeof BaseToastProvider>;

export function Sonner(props: SonnerProps) {
  return <BaseToastProvider {...props} />;
}
