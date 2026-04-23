import { createContext, useContext, type ReactNode } from "react";
import { darkTheme, lightTheme, type NativeTheme } from "./tokens";

const ThemeContext = createContext<NativeTheme>(lightTheme);

export interface NativeThemeProviderProps {
  children: ReactNode;
  scheme?: "light" | "dark";
  theme?: NativeTheme;
}

export function NativeThemeProvider({ children, scheme = "light", theme }: NativeThemeProviderProps) {
  const value = theme ?? (scheme === "dark" ? darkTheme : lightTheme);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useNativeTheme(): NativeTheme {
  return useContext(ThemeContext);
}
