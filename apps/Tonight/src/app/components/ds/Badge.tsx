import { type ReactNode } from "react";

type BadgeVariant = "solid" | "soft" | "outline" | "dot";
type BadgeColor = "primary" | "secondary" | "success" | "warning" | "destructive" | "info" | "default";
type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
  className?: string;
}

const colorStyles: Record<BadgeColor, Record<BadgeVariant, string>> = {
  primary: {
    solid: "bg-primary text-primary-foreground",
    soft: "bg-primary/15 text-primary",
    outline: "border border-primary text-primary",
    dot: "bg-transparent text-foreground",
  },
  secondary: {
    solid: "bg-secondary text-secondary-foreground",
    soft: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
    dot: "bg-transparent text-foreground",
  },
  success: {
    solid: "bg-success text-success-foreground",
    soft: "bg-success/15 text-success",
    outline: "border border-success text-success",
    dot: "bg-transparent text-foreground",
  },
  warning: {
    solid: "bg-warning text-warning-foreground",
    soft: "bg-warning/15 text-warning",
    outline: "border border-warning text-warning",
    dot: "bg-transparent text-foreground",
  },
  destructive: {
    solid: "bg-destructive text-destructive-foreground",
    soft: "bg-destructive/15 text-destructive",
    outline: "border border-destructive text-destructive",
    dot: "bg-transparent text-foreground",
  },
  info: {
    solid: "bg-info text-info-foreground",
    soft: "bg-info/15 text-info",
    outline: "border border-info text-info",
    dot: "bg-transparent text-foreground",
  },
  default: {
    solid: "bg-foreground text-background",
    soft: "bg-muted text-muted-foreground",
    outline: "border border-border text-muted-foreground",
    dot: "bg-transparent text-muted-foreground",
  },
};

const dotColors: Record<BadgeColor, string> = {
  primary: "bg-primary",
  secondary: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  default: "bg-muted-foreground",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[0.625rem]",
  md: "px-2 py-0.5 text-[0.6875rem]",
  lg: "px-2.5 py-1 text-[0.75rem]",
};

export function DSBadge({
  children,
  variant = "soft",
  color = "primary",
  size = "md",
  removable = false,
  onRemove,
  icon,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full whitespace-nowrap
        ${colorStyles[color][variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
    >
      {variant === "dot" && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]}`} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 cursor-pointer shrink-0"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
