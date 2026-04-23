import { StyleSheet, Text, View, type ViewProps } from "react-native";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useNativeTheme } from "../theme/provider";

export function Alert({ children, ...props }: ViewProps) {
  const { colors } = useNativeTheme();
  return <View {...props} style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }, props.style]}><Text style={{ color: colors.foreground }}>{children}</Text></View>;
}

export function Banner({ children, ...props }: ViewProps) {
  const { colors } = useNativeTheme();
  return <View {...props} style={[styles.box, { borderColor: colors.primary, backgroundColor: colors.primary }, props.style]}><Text style={{ color: colors.primaryForeground }}>{children}</Text></View>;
}

type ToastApi = {
  message: string | null;
  toast: (msg: string) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
};
const ToastCtx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children?: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const api = useMemo<ToastApi>(() => ({
    message,
    toast: (msg) => setMessage(msg),
    success: (msg) => setMessage(msg),
    error: (msg) => setMessage(msg)
  }), [message]);
  return (
    <ToastCtx.Provider value={api}>
      {children}
      {message ? <View style={styles.toast}><Text style={{ color: "#fff" }}>{message}</Text></View> : null}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx) ?? {
    message: null,
    toast: () => undefined,
    success: () => undefined,
    error: () => undefined
  };
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 10, padding: 10 },
  toast: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#111"
  }
});
