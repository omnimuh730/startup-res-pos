import type { ReactNode } from "react";

// Deterministic "New" vs "Sale" label from any id/string
export function pickRibbonLabel(seed: string | number): "New" | "Sale" {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 2 === 0 ? "New" : "Sale";
}

type RibbonPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type RibbonVariant = "diagonal" | "flat" | "bookmark";
type RibbonColor = "primary" | "success" | "warning" | "destructive" | "info" | "dark";
type RibbonSize = "sm" | "md" | "lg";

interface RibbonProps {
  children: ReactNode;
  position?: RibbonPosition;
  variant?: RibbonVariant;
  color?: RibbonColor;
  size?: RibbonSize;
  className?: string;
}

const sizeMap: Record<RibbonSize, string> = {
  sm: "px-5 text-[0.5rem] leading-[1.4]",
  md: "px-7 py-[1px] text-[0.625rem] leading-[1.4]",
  lg: "px-10 py-[3px] text-[0.8125rem] leading-[1.3]",
};

const colorMap: Record<RibbonColor, { bg: string; text: string; shadow: string }> = {
  primary: { bg: "bg-primary", text: "text-primary-foreground", shadow: "bg-primary/70" },
  success: { bg: "bg-success", text: "text-success-foreground", shadow: "bg-success/70" },
  warning: { bg: "bg-warning", text: "text-warning-foreground", shadow: "bg-warning/70" },
  destructive: { bg: "bg-destructive", text: "text-destructive-foreground", shadow: "bg-destructive/70" },
  info: { bg: "bg-info", text: "text-info-foreground", shadow: "bg-info/70" },
  dark: { bg: "bg-foreground", text: "text-background", shadow: "bg-foreground/70" },
};

// ── Diagonal Ribbon ────────────────────────────────────────
function DiagonalRibbon({ children, position, color, size }: { children: ReactNode; position: RibbonPosition; color: RibbonColor; size: RibbonSize }) {
  const c = colorMap[color];

  const posStyle: Record<RibbonPosition, string> = {
    "top-left": "top-0 left-0 -translate-x-[32%] translate-y-[55%] -rotate-45",
    "top-right": "top-0 right-0 translate-x-[32%] translate-y-[55%] rotate-45",
    "bottom-left": "bottom-0 left-0 -translate-x-[32%] -translate-y-[55%] rotate-45",
    "bottom-right": "bottom-0 right-0 translate-x-[32%] -translate-y-[55%] -rotate-45",
  };

  return (
    <div className={`absolute ${posStyle[position]} z-10 pointer-events-none`}>
      <div className={`relative overflow-hidden ${c.bg} ${c.text} ${sizeMap[size]} text-center shadow-md`}>
        <span className="relative z-10" style={{ fontWeight: 700, letterSpacing: "0.02em" }}>{children}</span>
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full"
          style={{
            background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
            animation: "ribbonGlide 2.4s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`@keyframes ribbonGlide { 0% { transform: translateX(-120%); } 55% { transform: translateX(120%); } 100% { transform: translateX(120%); } }`}</style>
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
  size = "md",
  className = "",
}: RibbonProps) {
  const props = { children, position, color };

  return (
    <div className={className}>
      {variant === "diagonal" && <DiagonalRibbon {...props} size={size} />}
      {variant === "flat" && <FlatRibbon {...props} />}
      {variant === "bookmark" && <BookmarkRibbon {...props} />}
    </div>
  );
}
