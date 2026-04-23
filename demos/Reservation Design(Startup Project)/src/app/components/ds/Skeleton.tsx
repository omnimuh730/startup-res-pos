import { type HTMLAttributes } from "react";

type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
  className?: string;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "rounded-md h-4 w-full",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-xl",
};

export function Skeleton({
  variant = "text",
  width,
  height,
  lines,
  animate = true,
  className = "",
  ...props
}: SkeletonProps) {
  const base = `bg-muted ${animate ? "animate-pulse" : ""} ${variantClasses[variant]}`;

  if (lines && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={base}
            style={{
              width: i === lines - 1 ? "75%" : width || "100%",
              height: height || undefined,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${base} ${className}`}
      style={{ width: width || undefined, height: height || undefined }}
      {...props}
    />
  );
}

// ── Skeleton presets ───────────────────────────────────────
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 space-y-3 ${className}`}>
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" lines={2} />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={100} />
      </div>
    </div>
  );
}

export function SkeletonListItem({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 ${className}`}>
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = "" }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-4 p-3">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} variant="text" width={`${100 / cols}%`} height={12} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-4 p-3 border-t border-border">
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton key={c} variant="text" width={`${100 / cols}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}
