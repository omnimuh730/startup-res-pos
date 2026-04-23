import type { HTMLAttributes } from "react";
import { useWebTheme } from "../theme/provider";

export interface CheckboxProps extends HTMLAttributes<HTMLLabelElement> {
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked = false, onCheck, label, ...props }: CheckboxProps) {
  const { colors } = useWebTheme();
  return (
    <label {...props} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onCheck?.(e.target.checked)} />
      <span style={{ color: colors.foreground }}>{label}</span>
    </label>
  );
}

export function Radio({ checked = false, onCheck, label, ...props }: CheckboxProps) {
  const { colors } = useWebTheme();
  return (
    <label {...props} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <input type="radio" checked={checked} onChange={(e) => onCheck?.(e.target.checked)} />
      <span style={{ color: colors.foreground }}>{label}</span>
    </label>
  );
}

export function RadioGroup(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} style={{ display: "grid", gap: 8, ...props.style }} />;
}

export function Toggle({ checked = false, onCheck, label, ...props }: CheckboxProps) {
  const { colors } = useWebTheme();
  return (
    <label {...props} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onCheck?.(e.target.checked)} />
      <span style={{ color: colors.foreground }}>{label}</span>
    </label>
  );
}
