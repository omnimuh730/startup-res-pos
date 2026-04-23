import { createContext, useContext, type ReactNode } from "react";
import { darkTheme, lightTheme, type UiTheme } from "@rn/ui-core";

const ThemeContext = createContext<UiTheme>(lightTheme);

export interface WebThemeProviderProps {
  children: ReactNode;
  scheme?: "light" | "dark";
  theme?: UiTheme;
}

export function WebThemeProvider({ children, scheme = "light", theme }: WebThemeProviderProps) {
  const value = theme ?? (scheme === "dark" ? darkTheme : lightTheme);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useWebTheme(): UiTheme {
  return useContext(ThemeContext);
}
