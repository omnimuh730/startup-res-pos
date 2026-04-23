import { forwardRef, type InputHTMLAttributes } from "react";
import { Minus, Plus } from "lucide-react";

type NumberInputSize = "sm" | "md" | "lg";

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  inputSize?: NumberInputSize;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const sizeMap: Record<NumberInputSize, { input: string; btn: string; icon: string }> = {
  sm: { input: "px-2 py-1 text-[0.75rem] w-12", btn: "w-7 h-7", icon: "w-3 h-3" },
  md: { input: "px-3 py-2 text-[0.8125rem] w-14", btn: "w-9 h-9", icon: "w-3.5 h-3.5" },
  lg: { input: "px-3 py-2.5 text-[0.9375rem] w-16", btn: "w-10 h-10", icon: "w-4 h-4" },
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value = 0, onChange, min = 0, max = Infinity, step = 1, inputSize = "md", label, error, disabled = false, className = "", ...props }, ref) => {
    const s = sizeMap[inputSize];
    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    return (
      <div className={className}>
        {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
        <div className={`inline-flex items-center border rounded-lg ${error ? "border-destructive" : "border-border"} ${disabled ? "opacity-50" : ""}`}>
          <button
            type="button"
            disabled={disabled || value <= min}
            onClick={() => onChange?.(clamp(value - step))}
            className={`${s.btn} flex items-center justify-center hover:bg-secondary transition-colors rounded-l-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <Minus className={s.icon} />
          </button>
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!isNaN(n)) onChange?.(clamp(n));
            }}
            disabled={disabled}
            className={`${s.input} text-center border-x border-border bg-transparent outline-none`}
            {...props}
          />
          <button
            type="button"
            disabled={disabled || value >= max}
            onClick={() => onChange?.(clamp(value + step))}
            className={`${s.btn} flex items-center justify-center hover:bg-secondary transition-colors rounded-r-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <Plus className={s.icon} />
          </button>
        </div>
        {error && <p className="text-[0.75rem] text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

// ── Stepper / Counter (compact variant) ────────────────────
export interface StepperCounterProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: NumberInputSize;
  className?: string;
}

export function StepperCounter({ value = 0, onChange, min = 0, max = 99, label, size = "md", className = "" }: StepperCounterProps) {
  const s = sizeMap[size];
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {label && <span className="text-[0.8125rem]">{label}</span>}
      <div className="inline-flex items-center gap-3">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange?.(clamp(value - 1))}
          className={`${s.btn} flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <Minus className={s.icon} />
        </button>
        <span className="text-[0.9375rem] w-8 text-center">{value}</span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange?.(clamp(value + 1))}
          className={`${s.btn} flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <Plus className={s.icon} />
        </button>
      </div>
    </div>
  );
}
