import { createContext, useContext, useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { useWebTheme } from "../theme/provider";

export function Alert({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { colors } = useWebTheme();
  return <div {...props} style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 10, background: colors.card, color: colors.foreground, ...style }} />;
}

export function Banner({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { colors } = useWebTheme();
  return <div {...props} style={{ border: `1px solid ${colors.primary}`, borderRadius: 10, padding: 10, background: colors.primary, color: colors.primaryForeground, ...style }} />;
}

type ToastApi = { toast: (msg: string) => void; success: (msg: string) => void; error: (msg: string) => void };
const Ctx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children?: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const api = useMemo<ToastApi>(() => ({
    toast: (msg) => setMessage(msg),
    success: (msg) => setMessage(msg),
    error: (msg) => setMessage(msg)
  }), []);
  return (
    <Ctx.Provider value={api}>
      {children}
      {message ? <div style={{ position: "fixed", left: 16, right: 16, bottom: 16, borderRadius: 10, padding: 12, background: "#111", color: "#fff", zIndex: 60 }}>{message}</div> : null}
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx) ?? {
    toast: () => undefined,
    success: () => undefined,
    error: () => undefined
  };
}
