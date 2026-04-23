import { type HTMLAttributes } from "react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "ring" | "dots" | "bars" | "pulse";
type SpinnerColor = "primary" | "secondary" | "white" | "current";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: SpinnerColor;
  label?: string;
}

const sizeMap: Record<SpinnerSize, { box: string; border: string; dot: string; bar: string }> = {
  xs: { box: "w-3.5 h-3.5", border: "border", dot: "w-1 h-1", bar: "w-0.5 h-2" },
  sm: { box: "w-5 h-5", border: "border-[1.5px]", dot: "w-1.5 h-1.5", bar: "w-0.5 h-3" },
  md: { box: "w-7 h-7", border: "border-2", dot: "w-2 h-2", bar: "w-1 h-4" },
  lg: { box: "w-10 h-10", border: "border-[2.5px]", dot: "w-2.5 h-2.5", bar: "w-1 h-5" },
  xl: { box: "w-14 h-14", border: "border-[3px]", dot: "w-3 h-3", bar: "w-1.5 h-6" },
};

const colorMap: Record<SpinnerColor, { ring: string; dot: string }> = {
  primary: { ring: "border-primary border-t-transparent", dot: "bg-primary" },
  secondary: { ring: "border-secondary-foreground border-t-transparent", dot: "bg-secondary-foreground" },
  white: { ring: "border-white border-t-transparent", dot: "bg-white" },
  current: { ring: "border-current border-t-transparent", dot: "bg-current" },
};

export function Spinner({
  size = "md",
  variant = "ring",
  color = "primary",
  label,
  className = "",
  ...props
}: SpinnerProps) {
  const s = sizeMap[size];
  const c = colorMap[color];

  if (variant === "ring") {
    return (
      <div className={`inline-flex flex-col items-center gap-2 ${className}`} role="status" {...props}>
        <div className={`${s.box} ${s.border} ${c.ring} rounded-full animate-spin`} />
        {label && <span className="text-[0.75rem] text-muted-foreground">{label}</span>}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`inline-flex flex-col items-center gap-2 ${className}`} role="status" {...props}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${s.dot} ${c.dot} rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {label && <span className="text-[0.75rem] text-muted-foreground">{label}</span>}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={`inline-flex flex-col items-center gap-2 ${className}`} role="status" {...props}>
        <div className="flex items-end gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${s.bar} ${c.dot} rounded-sm animate-pulse`}
              style={{
                animationDelay: `${i * 0.12}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
        {label && <span className="text-[0.75rem] text-muted-foreground">{label}</span>}
      </div>
    );
  }

  // pulse
  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`} role="status" {...props}>
      <div className={`${s.box} ${c.dot} rounded-full animate-ping opacity-75`} />
      {label && <span className="text-[0.75rem] text-muted-foreground">{label}</span>}
    </div>
  );
}
