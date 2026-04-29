import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type CardVariant = "default" | "outlined" | "elevated" | "filled" | "ghost";
type CardPadding = "none" | "sm" | "md" | "lg" | "xl";
type CardRadius = "none" | "sm" | "md" | "lg" | "xl";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  hoverable?: boolean;
  clickable?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-card border border-border",
  outlined: "bg-transparent border border-border",
  elevated: "bg-card shadow-lg border border-border/50",
  filled: "bg-secondary border-0",
  ghost: "bg-transparent border-0",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
  xl: "p-8",
};

const radiusClasses: Record<CardRadius, string> = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      radius = "md",
      hoverable = false,
      clickable = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          ${variantClasses[variant]}
          ${paddingClasses[padding]}
          ${radiusClasses[radius]}
          ${hoverable ? "transition-shadow hover:shadow-lg" : ""}
          ${clickable ? "cursor-pointer transition-transform active:scale-[0.98]" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// ── Card Sub-components ────────────────────────────────────
export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-[1.0625rem] ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[0.8125rem] text-muted-foreground mt-1 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mt-4 pt-4 border-t border-border flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}
