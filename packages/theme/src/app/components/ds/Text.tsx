import { forwardRef, type HTMLAttributes, type ElementType } from "react";

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type TextColor = "default" | "muted" | "primary" | "success" | "warning" | "destructive" | "info";
type TextAlign = "left" | "center" | "right";
type TextWeight = "normal" | "medium" | "semibold" | "bold";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: TextSize;
  color?: TextColor;
  align?: TextAlign;
  weight?: TextWeight;
  truncate?: boolean;
  mono?: boolean;
  muted?: boolean;
  className?: string;
}

const sizeClasses: Record<TextSize, string> = {
  xs: "text-[0.6875rem]",
  sm: "text-[0.75rem]",
  md: "text-[0.8125rem]",
  lg: "text-[0.9375rem]",
  xl: "text-[1.0625rem]",
  "2xl": "text-[1.25rem]",
  "3xl": "text-[1.5rem]",
  "4xl": "text-[2rem]",
};

const colorClasses: Record<TextColor, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
};

const alignClasses: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const weightClasses: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Component = "p",
      size = "md",
      color = "default",
      align,
      weight,
      truncate = false,
      mono = false,
      muted = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const finalColor = muted ? "muted" : color;

    return (
      <Component
        ref={ref}
        className={`
          ${sizeClasses[size]}
          ${colorClasses[finalColor]}
          ${align ? alignClasses[align] : ""}
          ${weight ? weightClasses[weight] : ""}
          ${truncate ? "truncate" : ""}
          ${mono ? "font-mono" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";

// ── Heading convenience ────────────────────────────────────
export interface HeadingProps extends Omit<TextProps, "as"> {
  level?: 1 | 2 | 3 | 4;
}

const headingSizeMap: Record<number, TextSize> = {
  1: "4xl",
  2: "2xl",
  3: "xl",
  4: "lg",
};

export function Heading({ level = 2, size, ...props }: HeadingProps) {
  const tag = `h${level}` as ElementType;
  return <Text as={tag} size={size || headingSizeMap[level]} {...props} />;
}
