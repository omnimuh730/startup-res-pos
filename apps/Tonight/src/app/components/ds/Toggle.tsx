import { forwardRef, type InputHTMLAttributes } from "react";

type ToggleSize = "sm" | "md" | "lg";
type ToggleColor = "primary" | "success" | "warning" | "destructive";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  size?: ToggleSize;
  color?: ToggleColor;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const sizeMap: Record<ToggleSize, { track: string; thumb: string; translate: string }> = {
  sm: { track: "w-8 h-[18px]", thumb: "w-3.5 h-3.5", translate: "translate-x-[14px]" },
  md: { track: "w-10 h-[22px]", thumb: "w-[18px] h-[18px]", translate: "translate-x-[18px]" },
  lg: { track: "w-12 h-[26px]", thumb: "w-[22px] h-[22px]", translate: "translate-x-[22px]" },
};

const colorMap: Record<ToggleColor, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked = false, onToggle, size = "md", color = "primary", label, description, disabled = false, className = "", ...props }, ref) => {
    const s = sizeMap[size];

    return (
      <label className={`inline-flex items-start gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle?.(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`${s.track} flex shrink-0 items-center rounded-full border p-[2px] transition-colors duration-200 ${
            checked ? `${colorMap[color]} border-transparent` : "bg-muted border-border/70"
          } peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-foreground/30 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
            disabled ? "" : "shadow-[inset_0_1px_1px_rgba(0,0,0,0.08)]"
          }`}
        >
          <div
            className={`${s.thumb} rounded-full border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.65)_inset] transition-transform duration-200 ${
              checked ? s.translate : "translate-x-0"
            }`}
          />
        </div>
        {(label || description) && (
          <div>
            {label && <span className="text-[0.8125rem] leading-tight block">{label}</span>}
            {description && <span className="text-[0.75rem] text-muted-foreground leading-tight block mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";