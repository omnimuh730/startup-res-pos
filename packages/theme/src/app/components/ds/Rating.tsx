import { useState, useCallback, type ReactNode } from "react";
import { Star } from "lucide-react";

type RatingSize = "sm" | "md" | "lg" | "xl";

interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  disabled?: boolean;
  size?: RatingSize;
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
  allowHalf?: boolean;
  icon?: (props: { filled: boolean; half: boolean; size: number }) => ReactNode;
  color?: string;
  emptyColor?: string;
  label?: string;
  className?: string;
}

const sizePixels: Record<RatingSize, number> = {
  sm: 14,
  md: 20,
  lg: 26,
  xl: 34,
};

const gapMap: Record<RatingSize, string> = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1.5",
  xl: "gap-2",
};

export function Rating({
  value,
  defaultValue = 0,
  max = 5,
  onChange,
  readonly = false,
  disabled = false,
  size = "md",
  showValue = false,
  showCount = false,
  count,
  allowHalf = false,
  icon,
  color,
  emptyColor,
  label,
  className = "",
}: RatingProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [hovered, setHovered] = useState<number | null>(null);

  const current = value ?? internal;
  const display = hovered ?? current;
  const px = sizePixels[size];
  const fillColor = color ?? "var(--primary)";
  const emptyFill = emptyColor ?? "var(--border)";

  const handleClick = useCallback(
    (starValue: number) => {
      if (readonly || disabled) return;
      const newValue = current === starValue ? 0 : starValue;
      if (value === undefined) setInternal(newValue);
      onChange?.(newValue);
    },
    [current, readonly, disabled, value, onChange]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, starIndex: number) => {
      if (readonly || disabled) return;
      if (allowHalf) {
        const rect = e.currentTarget.getBoundingClientRect();
        const isHalf = e.clientX - rect.left < rect.width / 2;
        setHovered(isHalf ? starIndex - 0.5 : starIndex);
      } else {
        setHovered(starIndex);
      }
    },
    [readonly, disabled, allowHalf]
  );

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = display >= starValue;
    const half = !filled && display >= starValue - 0.5;

    if (icon) {
      return icon({ filled, half, size: px });
    }

    return (
      <Star
        size={px}
        fill={filled ? fillColor : half ? fillColor : emptyFill}
        stroke={filled || half ? fillColor : emptyFill}
        strokeWidth={1.5}
        style={
          half
            ? {
                clipPath: "inset(0 50% 0 0)",
                position: "absolute",
                fill: fillColor,
                stroke: fillColor,
              }
            : undefined
        }
      />
    );
  };

  return (
    <div
      className={`inline-flex items-center ${gapMap[size]} ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
      aria-label={label ?? `Rating: ${current} out of ${max}`}
      role="group"
    >
      {label && (
        <span className="text-[0.8125rem] text-muted-foreground mr-1">{label}</span>
      )}
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = display >= starValue;
        const half = !filled && display >= starValue - 0.5;

        return (
          <button
            key={i}
            type="button"
            className={`relative inline-flex shrink-0 ${
              readonly || disabled ? "cursor-default" : "cursor-pointer"
            } transition-transform ${
              !readonly && !disabled ? "hover:scale-110 active:scale-95" : ""
            }`}
            onClick={() => handleClick(allowHalf && hovered ? hovered : starValue)}
            onMouseMove={(e) => handleMouseMove(e, starValue)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            tabIndex={readonly || disabled ? -1 : 0}
          >
            {/* Background star */}
            <Star size={px} fill={emptyFill} stroke={emptyFill} strokeWidth={1.5} />
            {/* Filled overlay */}
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? "50%" : "100%" }}
              >
                <Star size={px} fill={fillColor} stroke={fillColor} strokeWidth={1.5} />
              </span>
            )}
          </button>
        );
      })}
      {showValue && (
        <span className="text-[0.875rem] ml-0.5 tabular-nums">{current.toFixed(allowHalf ? 1 : 0)}</span>
      )}
      {showCount && count !== undefined && (
        <span className="text-[0.8125rem] text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
