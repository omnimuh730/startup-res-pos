import { type InputHTMLAttributes } from "react";
import { useWebTheme } from "../theme/provider";
import type { SelectOption } from "@rn/ui-core";

export function Select({
  options,
  value,
  onValueChange
}: {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const { colors } = useWebTheme();
  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      style={{ minHeight: 38, borderRadius: 10, border: `1px solid ${colors.border}`, padding: "8px 10px", background: colors.card, color: colors.foreground }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function MultiSelect({
  options,
  value = [],
  onValueChange
}: {
  options: SelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}) {
  const { colors } = useWebTheme();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => onValueChange?.(active ? value.filter((v) => v !== opt.value) : [...value, opt.value])}
            style={{
              borderRadius: 999,
              border: `1px solid ${active ? colors.primary : colors.border}`,
              padding: "4px 8px",
              background: active ? colors.primary : "transparent",
              color: active ? colors.primaryForeground : colors.foreground,
              cursor: "pointer"
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function NumberInput({
  value = 0,
  onChangeValue,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & { value?: number; onChangeValue?: (value: number) => void }) {
  const { colors } = useWebTheme();
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChangeValue?.(Number(e.target.value) || 0)}
      style={{ minHeight: 38, borderRadius: 10, border: `1px solid ${colors.border}`, padding: "8px 10px", background: colors.card, color: colors.foreground }}
      {...props}
    />
  );
}

export function StepperCounter({ value = 0, onChangeValue }: { value?: number; onChangeValue?: (value: number) => void }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button onClick={() => onChangeValue?.(value - 1)} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: "6px 10px", background: "transparent", cursor: "pointer" }}>-</button>
      <span style={{ color: colors.foreground, minWidth: 24, textAlign: "center" }}>{value}</span>
      <button onClick={() => onChangeValue?.(value + 1)} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: "6px 10px", background: "transparent", cursor: "pointer" }}>+</button>
    </div>
  );
}

export function SearchBar({ value, onChangeText, placeholder = "Search..." }: { value?: string; onChangeText?: (value: string) => void; placeholder?: string }) {
  const { colors } = useWebTheme();
  return (
    <input
      value={value}
      onChange={(e) => onChangeText?.(e.target.value)}
      placeholder={placeholder}
      style={{ minHeight: 38, borderRadius: 10, border: `1px solid ${colors.border}`, padding: "8px 10px", background: colors.card, color: colors.foreground }}
    />
  );
}

export function FileUploader({ onPick }: { onPick?: () => void }) {
  const { colors } = useWebTheme();
  return (
    <button onClick={onPick} style={{ minHeight: 38, borderRadius: 10, border: `1px solid ${colors.border}`, padding: "8px 10px", background: colors.card, color: colors.foreground, cursor: "pointer" }}>
      Upload File
    </button>
  );
}
