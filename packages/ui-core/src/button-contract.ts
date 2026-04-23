import type { UiTheme } from "./tokens";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "success" | "warning";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";
export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonContract {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    textColor: string;
  };
  spacing: {
    paddingX: number;
    paddingY: number;
  };
  radius: number;
}

const buttonSizeSpacing: Record<ButtonSize, { paddingX: number; paddingY: number }> = {
  xs: { paddingX: 10, paddingY: 6 },
  sm: { paddingX: 14, paddingY: 8 },
  md: { paddingX: 20, paddingY: 10 },
  lg: { paddingX: 24, paddingY: 12 },
  xl: { paddingX: 32, paddingY: 14 },
  icon: { paddingX: 10, paddingY: 10 }
};

export function getButtonContract(theme: UiTheme, variant: ButtonVariant, size: ButtonSize, radius: ButtonRadius): ButtonContract {
  const colors = theme.colors;
  const palette = {
    primary: { backgroundColor: colors.primary, borderColor: colors.primary, borderWidth: 1, textColor: colors.primaryForeground },
    secondary: { backgroundColor: colors.secondary, borderColor: colors.secondary, borderWidth: 1, textColor: colors.secondaryForeground },
    outline: { backgroundColor: "transparent", borderColor: colors.border, borderWidth: 1, textColor: colors.foreground },
    ghost: { backgroundColor: "transparent", borderColor: "transparent", borderWidth: 1, textColor: colors.foreground },
    link: { backgroundColor: "transparent", borderColor: "transparent", borderWidth: 0, textColor: colors.primary },
    destructive: { backgroundColor: colors.destructive, borderColor: colors.destructive, borderWidth: 1, textColor: colors.destructiveForeground },
    success: { backgroundColor: colors.success, borderColor: colors.success, borderWidth: 1, textColor: colors.successForeground },
    warning: { backgroundColor: colors.warning, borderColor: colors.warning, borderWidth: 1, textColor: colors.warningForeground }
  };

  return {
    container: palette[variant],
    spacing: buttonSizeSpacing[size],
    radius: theme.radius[radius]
  };
}
