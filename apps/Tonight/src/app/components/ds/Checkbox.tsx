import { forwardRef, type InputHTMLAttributes } from "react";
import { Check, Minus } from "lucide-react";

type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheck?: (checked: boolean) => void;
  size?: CheckboxSize;
  label?: string;
  description?: string;
  error?: string;
}

const sizeMap: Record<CheckboxSize, { box: string; icon: string }> = {
  sm: { box: "w-4 h-4", icon: "w-2.5 h-2.5" },
  md: { box: "w-5 h-5", icon: "w-3 h-3" },
  lg: { box: "w-6 h-6", icon: "w-3.5 h-3.5" },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, indeterminate = false, onCheck, size = "md", label, description, error, disabled = false, className = "", ...props }, ref) => {
    const s = sizeMap[size];
    const isChecked = checked || indeterminate;

    return (
      <label className={`inline-flex items-center gap-2.5 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`${s.box} shrink-0 rounded-[4px] border-2 transition-colors flex items-center justify-center ${
            isChecked
              ? "bg-primary border-primary text-primary-foreground"
              : error
              ? "border-destructive"
              : "border-border hover:border-primary/60"
          }`}
        >
          {indeterminate ? (
            <Minus className={s.icon} strokeWidth={3} />
          ) : (
            <Check className={`${s.icon} transition-opacity ${checked ? "opacity-100" : "opacity-0"}`} strokeWidth={3} />
          )}
        </div>
        {(label || description || error) && (
          <div className="min-w-0">
            {label && <span className="text-[0.8125rem] leading-tight block">{label}</span>}
            {description && <span className="text-[0.75rem] text-muted-foreground block mt-0.5">{description}</span>}
            {error && <span className="text-[0.75rem] text-destructive block mt-0.5">{error}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

// ── Radio ──────────────────────────────────────────────────
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  checked?: boolean;
  onSelect?: (value: string) => void;
  size?: CheckboxSize;
  label?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ checked = false, onSelect, size = "md", label, description, disabled = false, value = "", className = "", ...props }, ref) => {
    const s = sizeMap[size];

    return (
      <label className={`inline-flex items-center gap-2.5 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
        <input
          ref={ref}
          type="radio"
          checked={checked}
          value={value}
          onChange={() => onSelect?.(String(value))}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`${s.box} shrink-0 rounded-full border-2 transition-colors relative ${
            checked ? "border-primary" : "border-border hover:border-primary/60"
          }`}
        >
          <div
            className={`absolute inset-0 m-auto w-[50%] h-[50%] rounded-full bg-primary transition-transform ${
              checked ? "scale-100" : "scale-0"
            }`}
          />
        </div>
        {(label || description) && (
          <div className="min-w-0">
            {label && <span className="text-[0.8125rem] leading-tight block">{label}</span>}
            {description && <span className="text-[0.75rem] text-muted-foreground block mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";

// ── RadioGroup ─────────────────────────────────────────────
export interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string; description?: string; disabled?: boolean }[];
  size?: CheckboxSize;
  direction?: "row" | "column";
  name?: string;
  className?: string;
}

export function RadioGroup({ value, onChange, options, size = "md", direction = "column", name, className = "" }: RadioGroupProps) {
  return (
    <div className={`flex ${direction === "column" ? "flex-col gap-2.5" : "flex-row flex-wrap gap-4"} ${className}`}>
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onSelect={onChange}
          size={size}
          label={opt.label}
          description={opt.description}
          disabled={opt.disabled}
        />
      ))}
    </div>
  );
}
