import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from "react";
import { useWebTheme } from "../theme/provider";

type TabsCtx = { value: string; setValue: (v: string) => void };
const Ctx = createContext<TabsCtx | null>(null);

export function Tabs({ defaultValue = "tab-1", children, ...props }: HTMLAttributes<HTMLDivElement> & { defaultValue?: string; children?: ReactNode }) {
  const [value, setValue] = useState(defaultValue);
  return <Ctx.Provider value={{ value, setValue }}><div {...props}>{children}</div></Ctx.Provider>;
}

export const TabList = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} style={{ display: "flex", gap: 8, marginBottom: 8, ...props.style }} />;

export function TabTrigger({ value, children, ...props }: HTMLAttributes<HTMLButtonElement> & { value: string; children?: ReactNode }) {
  const ctx = useContext(Ctx);
  const { colors } = useWebTheme();
  const active = ctx?.value === value;
  return (
    <button {...props} onClick={() => ctx?.setValue(value)} style={{ border: 0, borderRadius: 10, padding: "8px 12px", background: active ? colors.primary : colors.secondary, color: active ? colors.primaryForeground : colors.secondaryForeground, cursor: "pointer", ...props.style }}>
      {children}
    </button>
  );
}

export function TabPanel({ value, children, ...props }: HTMLAttributes<HTMLDivElement> & { value: string; children?: ReactNode }) {
  const ctx = useContext(Ctx);
  if (ctx?.value !== value) return null;
  return <div {...props}>{children}</div>;
}
