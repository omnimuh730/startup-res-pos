import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from "react-native";
import { useNativeTheme } from "../theme/provider";
import { getButtonContract, type ButtonRadius, type ButtonSize, type ButtonVariant } from "@rn/ui-core";

export interface ButtonProps extends Omit<PressableProps, "style"> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  xs: { paddingHorizontal: 10, paddingVertical: 6 },
  sm: { paddingHorizontal: 14, paddingVertical: 8 },
  md: { paddingHorizontal: 20, paddingVertical: 10 },
  lg: { paddingHorizontal: 24, paddingVertical: 12 },
  xl: { paddingHorizontal: 32, paddingVertical: 14 },
  icon: { width: 42, height: 42, alignItems: "center", justifyContent: "center" }
};

const textSizeStyles: Record<ButtonSize, TextStyle> = {
  xs: { fontSize: 11 },
  sm: { fontSize: 12 },
  md: { fontSize: 13 },
  lg: { fontSize: 15 },
  xl: { fontSize: 16 },
  icon: { fontSize: 13 }
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  radius = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { colors, radius: radii } = useNativeTheme();
  const isDisabled = Boolean(disabled || loading);
  const contract = getButtonContract({ colors, radius: radii }, variant, size, radius);
  const textColor = contract.container.textColor;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.base,
        sizeStyles[size],
        {
          borderRadius: contract.radius,
          backgroundColor: contract.container.backgroundColor,
          borderColor: contract.container.borderColor,
          borderWidth: contract.container.borderWidth,
          paddingHorizontal: contract.spacing.paddingX,
          paddingVertical: contract.spacing.paddingY
        },
        fullWidth ? styles.fullWidth : null,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
        style
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text style={[styles.text, textSizeStyles[size], { color: textColor }]}>{children}</Text>
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  text: {
    fontWeight: "600"
  },
  icon: {
    alignItems: "center",
    justifyContent: "center"
  },
  fullWidth: {
    width: "100%"
  },
  disabled: {
    opacity: 0.5
  },
  pressed: {
    opacity: 0.85
  }
});
