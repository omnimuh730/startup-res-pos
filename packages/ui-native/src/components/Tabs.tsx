import { Pressable, StyleSheet, Text, View, type ViewProps } from "react-native";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useNativeTheme } from "../theme/provider";

type TabsCtx = { value: string; setValue: (v: string) => void };
const Ctx = createContext<TabsCtx | null>(null);

export function Tabs({ defaultValue = "tab-1", children, ...props }: ViewProps & { defaultValue?: string; children?: ReactNode }) {
  const [value, setValue] = useState(defaultValue);
  return <Ctx.Provider value={{ value, setValue }}><View {...props}>{children}</View></Ctx.Provider>;
}

export const TabList = (props: ViewProps) => <View {...props} style={[styles.list, props.style]} />;

export function TabTrigger({ value, children, ...props }: ViewProps & { value: string; children?: ReactNode }) {
  const ctx = useContext(Ctx);
  const { colors } = useNativeTheme();
  const active = ctx?.value === value;
  return (
    <Pressable onPress={() => ctx?.setValue(value)} {...props} style={[styles.trigger, { backgroundColor: active ? colors.primary : colors.secondary }, props.style]}>
      <Text style={{ color: active ? colors.primaryForeground : colors.secondaryForeground }}>{children}</Text>
    </Pressable>
  );
}

export function TabPanel({ value, children, ...props }: ViewProps & { value: string; children?: ReactNode }) {
  const ctx = useContext(Ctx);
  if (ctx?.value !== value) return null;
  return <View {...props}>{children}</View>;
}

const styles = StyleSheet.create({
  list: { flexDirection: "row", gap: 8, marginBottom: 8 },
  trigger: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }
});
