import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "success" | "warning";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";
type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "bg-transparent text-foreground border border-border hover:bg-secondary",
  ghost: "text-foreground hover:bg-secondary",
  link: "text-primary hover:underline underline-offset-4 !px-0 !py-0",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  success: "bg-success text-success-foreground hover:opacity-90",
  warning: "bg-warning text-warning-foreground hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-[0.6875rem] gap-1",
  sm: "px-3.5 py-1.5 text-[0.75rem] gap-1.5",
  md: "px-5 py-2.5 text-[0.8125rem] gap-2",
  lg: "px-6 py-3 text-[0.9375rem] gap-2",
  xl: "px-8 py-3.5 text-[1rem] gap-2.5",
  icon: "p-2.5",
};

const radiusClasses: Record<ButtonRadius, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      radius = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center transition-all cursor-pointer
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${radiusClasses[radius]}
          ${fullWidth ? "w-full" : ""}
          ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
