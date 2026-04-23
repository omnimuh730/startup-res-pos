import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { getButtonContract, type ButtonRadius, type ButtonSize, type ButtonVariant } from "@rn/ui-core";
import { useWebTheme } from "../theme/provider";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const sizeTypography: Record<ButtonSize, CSSProperties> = {
  xs: { fontSize: 11 },
  sm: { fontSize: 12 },
  md: { fontSize: 13 },
  lg: { fontSize: 15 },
  xl: { fontSize: 16 },
  icon: { fontSize: 13 }
};

export function Button({
  variant = "primary",
  size = "md",
  radius = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  children,
  ...props
}: ButtonProps) {
  const theme = useWebTheme();
  const contract = getButtonContract(theme, variant, size, radius);
  const isDisabled = disabled || loading;

  const buttonStyle: CSSProperties = {
    backgroundColor: contract.container.backgroundColor,
    borderColor: contract.container.borderColor,
    borderWidth: contract.container.borderWidth,
    borderStyle: "solid",
    color: contract.container.textColor,
    borderRadius: contract.radius,
    padding: `${contract.spacing.paddingY}px ${contract.spacing.paddingX}px`,
    width: fullWidth ? "100%" : undefined,
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...sizeTypography[size],
    ...style
  };

  return (
    <button disabled={isDisabled} style={buttonStyle} {...props}>
      {leftIcon}
      {loading ? "Loading..." : children}
      {rightIcon}
    </button>
  );
}
