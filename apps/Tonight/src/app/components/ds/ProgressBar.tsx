import type { ReactNode } from "react";

type ProgressSize = "xs" | "sm" | "md" | "lg";
type ProgressVariant = "default" | "striped" | "gradient" | "segmented";
type ProgressColor = "primary" | "success" | "warning" | "destructive" | "info";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  color?: ProgressColor;
  showLabel?: boolean;
  label?: ReactNode;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

interface StepProgressProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  size?: "sm" | "md";
  className?: string;
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: ProgressColor;
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

const sizeMap: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const colorMap: Record<ProgressColor, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
};

const colorVarMap: Record<ProgressColor, string> = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
  info: "var(--info)",
};

// ── Linear Progress ────────────────────────────────────────
export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  color = "primary",
  showLabel = false,
  label,
  showPercentage = false,
  animated = false,
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const barColor = (() => {
    if (variant === "gradient") {
      return "";
    }
    return colorMap[color];
  })();

  const gradientStyle =
    variant === "gradient"
      ? { background: `linear-gradient(90deg, ${colorVarMap[color]}, color-mix(in srgb, ${colorVarMap[color]} 60%, white))` }
      : {};

  const stripedBg =
    variant === "striped"
      ? {
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)",
          backgroundSize: "1rem 1rem",
        }
      : {};

  return (
    <div className={className}>
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label ? (
            <span className="text-[0.8125rem]">{label}</span>
          ) : showLabel ? (
            <span className="text-[0.8125rem] text-muted-foreground">Progress</span>
          ) : (
            <span />
          )}
          {showPercentage && (
            <span className="text-[0.8125rem] text-muted-foreground tabular-nums">{Math.round(pct)}%</span>
          )}
        </div>
      )}

      {variant === "segmented" ? (
        <div className={`flex gap-1 ${className}`}>
          {Array.from({ length: 10 }, (_, i) => {
            const segPct = (i + 1) * 10;
            return (
              <div
                key={i}
                className={`flex-1 ${sizeMap[size]} rounded-sm transition-colors ${
                  pct >= segPct ? colorMap[color] : "bg-secondary"
                }`}
              />
            );
          })}
        </div>
      ) : (
        <div className={`w-full ${sizeMap[size]} bg-secondary rounded-full overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor} ${
              animated ? "animate-pulse" : ""
            }`}
            style={{ width: `${pct}%`, ...gradientStyle, ...stripedBg }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          >
            {size === "lg" && showPercentage && pct > 10 && (
              <span className="flex items-center justify-center h-full text-[0.625rem] text-white px-2">
                {Math.round(pct)}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step Progress ──────────────────────────────────────────
export function StepProgress({ steps, currentStep, size = "md", className = "" }: StepProgressProps) {
  const dotSize = size === "sm" ? "w-6 h-6 text-[0.625rem]" : "w-8 h-8 text-[0.75rem]";
  const lineH = size === "sm" ? "h-0.5" : "h-0.5";

  return (
    <div className={`flex items-start ${className}`}>
      {steps.map((step, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;

        return (
          <div key={i} className="flex items-start flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`${dotSize} rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isComplete
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "border-2 border-primary text-primary"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {isComplete ? "✓" : i + 1}
              </div>
              <span className={`mt-1.5 text-center text-[0.6875rem] ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
              {step.description && (
                <span className="text-[0.6rem] text-muted-foreground text-center mt-0.5 max-w-[80px]">
                  {step.description}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`${lineH} flex-1 mt-3.5 mx-2 rounded ${isComplete ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Circular Progress ──────────────────────────────────────
export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  color = "primary",
  showPercentage = true,
  label,
  className = "",
}: CircularProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorVarMap[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      {(showPercentage || label) && (
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{ width: size, height: size }}
        >
          {showPercentage && (
            <span className="text-[0.875rem] tabular-nums">{Math.round(pct)}%</span>
          )}
          {label && <span className="text-[0.6rem] text-muted-foreground">{label}</span>}
        </div>
      )}
    </div>
  );
}
