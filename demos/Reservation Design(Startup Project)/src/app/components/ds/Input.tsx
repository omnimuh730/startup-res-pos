import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";

type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "filled" | "flushed";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  inputSize?: InputSize;
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-[0.75rem]",
  md: "px-3.5 py-2.5 text-[0.8125rem]",
  lg: "px-4 py-3 text-[0.9375rem]",
};

const variantClasses: Record<InputVariant, { base: string; focus: string }> = {
  default: {
    base: "border border-border rounded-lg bg-background",
    focus: "focus:border-primary focus:ring-2 focus:ring-primary/20",
  },
  filled: {
    base: "border border-transparent rounded-lg bg-secondary",
    focus: "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background",
  },
  flushed: {
    base: "border-b border-border rounded-none bg-transparent px-0",
    focus: "focus:border-primary focus:ring-0",
  },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      inputSize = "md",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`;
    const v = variantClasses[variant];
    const hasError = !!error;

    return (
      <div className={`${fullWidth ? "w-full" : "inline-flex flex-col"}`}>
        {label && (
          <label htmlFor={inputId} className="text-[0.8125rem] mb-1.5 block">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full outline-none transition-all
              ${v.base}
              ${hasError ? "!border-destructive focus:!ring-destructive/20" : v.focus}
              ${sizeClasses[inputSize]}
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${className}
            `.trim()}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-[0.75rem] text-destructive mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-[0.75rem] text-muted-foreground mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ── Textarea ───────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = "default",
      inputSize = "md",
      label,
      helperText,
      error,
      fullWidth = true,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).slice(2, 8)}`;
    const v = variantClasses[variant];
    const hasError = !!error;

    return (
      <div className={`${fullWidth ? "w-full" : "inline-flex flex-col"}`}>
        {label && (
          <label htmlFor={inputId} className="text-[0.8125rem] mb-1.5 block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full outline-none transition-all resize-none
            ${v.base}
            ${hasError ? "!border-destructive focus:!ring-destructive/20" : v.focus}
            ${sizeClasses[inputSize]}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
          `.trim()}
          {...props}
        />
        {error && <p className="text-[0.75rem] text-destructive mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-[0.75rem] text-muted-foreground mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
