import type { ReactNode } from "react";

type RibbonPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type RibbonVariant = "diagonal" | "flat" | "bookmark";
type RibbonColor = "primary" | "success" | "warning" | "destructive" | "info" | "dark";

interface RibbonProps {
  children: ReactNode;
  position?: RibbonPosition;
  variant?: RibbonVariant;
  color?: RibbonColor;
  className?: string;
}

const colorMap: Record<RibbonColor, { bg: string; text: string; shadow: string }> = {
  primary: { bg: "bg-primary", text: "text-primary-foreground", shadow: "bg-primary/70" },
  success: { bg: "bg-success", text: "text-success-foreground", shadow: "bg-success/70" },
  warning: { bg: "bg-warning", text: "text-warning-foreground", shadow: "bg-warning/70" },
  destructive: { bg: "bg-destructive", text: "text-destructive-foreground", shadow: "bg-destructive/70" },
  info: { bg: "bg-info", text: "text-info-foreground", shadow: "bg-info/70" },
  dark: { bg: "bg-foreground", text: "text-background", shadow: "bg-foreground/70" },
};

// ── Diagonal Ribbon ────────────────────────────────────────
function DiagonalRibbon({ children, position, color }: { children: ReactNode; position: RibbonPosition; color: RibbonColor }) {
  const c = colorMap[color];

  const posStyle: Record<RibbonPosition, string> = {
    "top-left": "top-0 left-0 -translate-x-[29%] translate-y-[40%] -rotate-45",
    "top-right": "top-0 right-0 translate-x-[29%] translate-y-[40%] rotate-45",
    "bottom-left": "bottom-0 left-0 -translate-x-[29%] -translate-y-[40%] rotate-45",
    "bottom-right": "bottom-0 right-0 translate-x-[29%] -translate-y-[40%] -rotate-45",
  };

  return (
    <div className={`absolute ${posStyle[position]} z-10`}>
      <div className={`${c.bg} ${c.text} px-10 py-1 text-[0.6875rem] text-center shadow-sm`}>
        {children}
      </div>
    </div>
  );
}

// ── Flat Ribbon ────────────────────────────────────────────
function FlatRibbon({ children, position, color }: { children: ReactNode; position: RibbonPosition; color: RibbonColor }) {
  const c = colorMap[color];
  const isLeft = position.includes("left");
  const isTop = position.includes("top");

  return (
    <div
      className={`absolute z-10 ${isTop ? "top-3" : "bottom-3"} ${isLeft ? "left-0" : "right-0"}`}
    >
      <div
        className={`${c.bg} ${c.text} px-3 py-1 text-[0.6875rem] shadow-sm ${
          isLeft ? "rounded-r-md" : "rounded-l-md"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// ── Bookmark Ribbon ────────────────────────────────────────
function BookmarkRibbon({ children, position, color }: { children: ReactNode; position: RibbonPosition; color: RibbonColor }) {
  const c = colorMap[color];
  const isLeft = position.includes("left");

  return (
    <div className={`absolute top-0 z-10 ${isLeft ? "left-4" : "right-4"}`}>
      <div className={`${c.bg} ${c.text} px-3 pt-1 pb-4 text-[0.6875rem] text-center relative`}>
        {children}
        <div
          className="absolute bottom-0 left-0 right-0 h-0 border-l-[20px] border-r-[20px] border-b-[10px] border-l-transparent border-r-transparent border-b-card"
          style={{ borderBottomColor: "var(--card)" }}
        />
      </div>
    </div>
  );
}

// ── Container ──────────────────────────────────────────────
interface RibbonContainerProps {
  children: ReactNode;
  className?: string;
}

export function RibbonContainer({ children, className = "" }: RibbonContainerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────
export function Ribbon({
  children,
  position = "top-right",
  variant = "diagonal",
  color = "primary",
  className = "",
}: RibbonProps) {
  const props = { children, position, color };

  return (
    <div className={className}>
      {variant === "diagonal" && <DiagonalRibbon {...props} />}
      {variant === "flat" && <FlatRibbon {...props} />}
      {variant === "bookmark" && <BookmarkRibbon {...props} />}
    </div>
  );
}
