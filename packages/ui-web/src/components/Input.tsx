import { useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { useWebTheme } from "../theme/provider";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { colors } = useWebTheme();
  return (
    <label style={{ display: "grid", gap: 6 }}>
      {label ? <span style={{ color: colors.foreground, fontSize: 12 }}>{label}</span> : null}
      <input
        style={{
          border: `1px solid ${error ? colors.destructive : colors.border}`,
          borderRadius: 10,
          minHeight: 38,
          padding: "8px 12px",
          color: colors.foreground,
          background: colors.card,
          ...style
        }}
        {...props}
      />
      {error ? <span style={{ color: colors.destructive, fontSize: 11 }}>{error}</span> : null}
    </label>
  );
}

export function Textarea({ label, error, style, ...props }: TextareaProps) {
  const { colors } = useWebTheme();
  return (
    <label style={{ display: "grid", gap: 6 }}>
      {label ? <span style={{ color: colors.foreground, fontSize: 12 }}>{label}</span> : null}
      <textarea
        style={{
          border: `1px solid ${error ? colors.destructive : colors.border}`,
          borderRadius: 10,
          minHeight: 88,
          padding: "8px 12px",
          color: colors.foreground,
          background: colors.card,
          ...style
        }}
        {...props}
      />
      {error ? <span style={{ color: colors.destructive, fontSize: 11 }}>{error}</span> : null}
    </label>
  );
}

export function PasswordInput(props: InputProps) {
  const [show, setShow] = useState(false);
  const { colors } = useWebTheme();
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Input {...props} type={show ? "text" : "password"} />
      <button type="button" onClick={() => setShow((v) => !v)} style={{ color: colors.primary, fontSize: 12, background: "transparent", border: 0, cursor: "pointer", justifySelf: "end" }}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
