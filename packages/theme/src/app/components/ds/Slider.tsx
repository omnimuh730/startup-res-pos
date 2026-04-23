import { useState, useRef, useCallback, useEffect } from "react";

type SliderSize = "sm" | "md" | "lg";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  size?: SliderSize;
  label?: string;
  showValue?: boolean;
  formatValue?: (v: number) => string;
  disabled?: boolean;
  marks?: { value: number; label?: string }[];
  className?: string;
}

const trackHeightMap: Record<SliderSize, string> = { sm: "h-1", md: "h-1.5", lg: "h-2" };
const thumbSizeMap: Record<SliderSize, string> = { sm: "w-3.5 h-3.5", md: "w-4.5 h-4.5", lg: "w-5.5 h-5.5" };

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  onChange,
  size = "md",
  label,
  showValue = true,
  formatValue = (v) => String(v),
  disabled = false,
  marks,
  className = "",
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? min);
  const value = controlledValue ?? internalValue;

  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setInternalValue(v);
    onChange?.(v);
  };

  return (
    <div className={`${disabled ? "opacity-50" : ""} ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-[0.8125rem]">{label}</span>}
          {showValue && <span className="text-[0.8125rem] text-primary">{formatValue(value)}</span>}
        </div>
      )}
      <div className="relative">
        <div className={`w-full ${trackHeightMap[size]} rounded-full bg-muted relative`}>
          <div
            className={`${trackHeightMap[size]} rounded-full bg-primary`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: "100%" }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 ${thumbSizeMap[size]} rounded-full bg-primary border-2 border-background shadow-md pointer-events-none`}
          style={{ left: `${pct}%` }}
        />
      </div>
      {marks && (
        <div className="relative mt-1.5">
          {marks.map((m) => {
            const mPct = ((m.value - min) / (max - min)) * 100;
            return (
              <span
                key={m.value}
                className="absolute text-[0.625rem] text-muted-foreground -translate-x-1/2"
                style={{ left: `${mPct}%` }}
              >
                {m.label ?? m.value}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Range Slider ───────────────────────────────────────────
export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  size?: SliderSize;
  label?: string;
  showValue?: boolean;
  formatValue?: (v: number) => string;
  disabled?: boolean;
  className?: string;
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  onChange,
  size = "md",
  label,
  showValue = true,
  formatValue = (v) => String(v),
  disabled = false,
  className = "",
}: RangeSliderProps) {
  const [internal, setInternal] = useState<[number, number]>(controlledValue ?? [min, max]);
  const vals = controlledValue ?? internal;

  const pctLow = ((vals[0] - min) / (max - min)) * 100;
  const pctHigh = ((vals[1] - min) / (max - min)) * 100;

  const update = (idx: 0 | 1, v: number) => {
    const next: [number, number] = [...vals] as [number, number];
    next[idx] = v;
    if (idx === 0 && v > vals[1]) next[1] = v;
    if (idx === 1 && v < vals[0]) next[0] = v;
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className={`${disabled ? "opacity-50" : ""} ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-[0.8125rem]">{label}</span>}
          {showValue && (
            <span className="text-[0.8125rem] text-primary">
              {formatValue(vals[0])} – {formatValue(vals[1])}
            </span>
          )}
        </div>
      )}
      <div className="relative h-5">
        <div className={`absolute top-1/2 -translate-y-1/2 w-full ${trackHeightMap[size]} rounded-full bg-muted`} />
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${trackHeightMap[size]} rounded-full bg-primary`}
          style={{ left: `${pctLow}%`, width: `${pctHigh - pctLow}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={vals[0]}
          onChange={(e) => update(0, Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          style={{ height: "100%" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={vals[1]}
          onChange={(e) => update(1, Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
          style={{ height: "100%" }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 ${thumbSizeMap[size]} rounded-full bg-primary border-2 border-background shadow-md pointer-events-none z-30`}
          style={{ left: `${pctLow}%` }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 ${thumbSizeMap[size]} rounded-full bg-primary border-2 border-background shadow-md pointer-events-none z-30`}
          style={{ left: `${pctHigh}%` }}
        />
      </div>
    </div>
  );
}
