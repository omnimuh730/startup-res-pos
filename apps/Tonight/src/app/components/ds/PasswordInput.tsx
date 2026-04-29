import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputSize = "sm" | "md" | "lg";

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  inputSize?: PasswordInputSize;
  label?: string;
  helperText?: string;
  error?: string;
  showStrength?: boolean;
  className?: string;
}

const sizeClasses: Record<PasswordInputSize, string> = {
  sm: "px-3 py-1.5 text-[0.75rem]",
  md: "px-3.5 py-2.5 text-[0.8125rem]",
  lg: "px-4 py-3 text-[0.9375rem]",
};

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 2) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 3) return { score, label: "Good", color: "bg-info" };
  return { score, label: "Strong", color: "bg-success" };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ inputSize = "md", label, helperText, error, showStrength = false, className = "", value, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const strength = showStrength ? getStrength(String(value || "")) : null;

    return (
      <div className={`w-full ${className}`}>
        {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            value={value}
            className={`
              w-full border rounded-lg bg-background outline-none transition-all pr-10
              ${error ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"}
              ${sizeClasses[inputSize]}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {showStrength && String(value || "").length > 0 && strength && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i < strength.score ? strength.color : "bg-muted"}`}
                />
              ))}
            </div>
            <p className="text-[0.6875rem] text-muted-foreground mt-1">{strength.label}</p>
          </div>
        )}
        {error && <p className="text-[0.75rem] text-destructive mt-1">{error}</p>}
        {!error && helperText && <p className="text-[0.75rem] text-muted-foreground mt-1">{helperText}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
