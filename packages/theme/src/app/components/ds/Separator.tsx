import type { ReactNode } from "react";

type SeparatorOrientation = "horizontal" | "vertical";
type SeparatorVariant = "solid" | "dashed" | "dotted" | "gradient";

interface SeparatorProps {
  orientation?: SeparatorOrientation;
  variant?: SeparatorVariant;
  label?: ReactNode;
  color?: string;
  spacing?: "sm" | "md" | "lg" | "xl";
  thickness?: number;
  className?: string;
}

const spacingMap = {
  sm: { h: "my-2", v: "mx-2" },
  md: { h: "my-4", v: "mx-4" },
  lg: { h: "my-6", v: "mx-6" },
  xl: { h: "my-8", v: "mx-8" },
};

export function Separator({
  orientation = "horizontal",
  variant = "solid",
  label,
  color,
  spacing = "md",
  thickness = 1,
  className = "",
}: SeparatorProps) {
  const isH = orientation === "horizontal";
  const space = isH ? spacingMap[spacing].h : spacingMap[spacing].v;
  const colorVal = color ?? "var(--border)";

  // Gradient variant
  if (variant === "gradient") {
    const gradientStyle = isH
      ? {
          height: `${thickness}px`,
          background: `linear-gradient(to right, transparent, ${colorVal}, transparent)`,
        }
      : {
          width: `${thickness}px`,
          background: `linear-gradient(to bottom, transparent, ${colorVal}, transparent)`,
        };

    if (label && isH) {
      return (
        <div className={`flex items-center gap-3 ${space} ${className}`} role="separator">
          <div className="flex-1" style={gradientStyle} />
          <span className="text-[0.75rem] text-muted-foreground shrink-0">{label}</span>
          <div className="flex-1" style={gradientStyle} />
        </div>
      );
    }

    return (
      <div
        role="separator"
        aria-orientation={orientation}
        className={`${isH ? "w-full" : "h-full self-stretch"} ${space} ${className}`}
        style={gradientStyle}
      />
    );
  }

  // Standard variants
  const borderStyle =
    variant === "dashed" ? "dashed" : variant === "dotted" ? "dotted" : "solid";

  // With label (horizontal only)
  if (label && isH) {
    return (
      <div className={`flex items-center gap-3 ${space} ${className}`} role="separator">
        <div
          className="flex-1"
          style={{ borderTopWidth: `${thickness}px`, borderTopStyle: borderStyle, borderTopColor: colorVal }}
        />
        <span className="text-[0.75rem] text-muted-foreground shrink-0">{label}</span>
        <div
          className="flex-1"
          style={{ borderTopWidth: `${thickness}px`, borderTopStyle: borderStyle, borderTopColor: colorVal }}
        />
      </div>
    );
  }

  // Plain separator
  const style = isH
    ? { borderTopWidth: `${thickness}px`, borderTopStyle: borderStyle, borderTopColor: colorVal }
    : { borderLeftWidth: `${thickness}px`, borderLeftStyle: borderStyle, borderLeftColor: colorVal };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`${isH ? "w-full" : "h-full self-stretch"} ${space} ${className}`}
      style={style as React.CSSProperties}
    />
  );
}
