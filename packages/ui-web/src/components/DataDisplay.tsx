import { useWebTheme } from "../theme/provider";
import type { CSSProperties, ReactNode } from "react";

export function Pagination({ page = 1, totalPages = 1, onChangePage }: { page?: number; totalPages?: number; onChangePage?: (page: number) => void }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button onClick={() => onChangePage?.(Math.max(1, page - 1))} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>Prev</button>
      <span style={{ color: colors.foreground }}>{page} / {totalPages}</span>
      <button onClick={() => onChangePage?.(Math.min(totalPages, page + 1))} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>Next</button>
    </div>
  );
}

export function ProgressBar({ value = 0 }: { value?: number }) {
  const { colors } = useWebTheme();
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ width: "100%", height: 10, borderRadius: 999, overflow: "hidden", background: colors.muted }}>
      <div style={{ width: `${v}%`, height: "100%", background: colors.primary }} />
    </div>
  );
}

export const StepProgress = ProgressBar;

export function CircularProgress({ value = 0 }: { value?: number }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ width: 64, height: 64, borderRadius: "999px", border: `4px solid ${colors.primary}`, display: "grid", placeItems: "center", color: colors.foreground }}>
      {Math.round(value)}%
    </div>
  );
}

export function Rating({ value = 0, onChange }: { value?: number; onChange?: (value: number) => void }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange?.(n)} style={{ border: 0, background: "transparent", color: n <= value ? colors.primary : colors.mutedForeground, fontSize: 20, cursor: "pointer" }}>★</button>
      ))}
    </div>
  );
}

export function Drawer({ open = false, children, style }: { open?: boolean; children?: ReactNode; style?: CSSProperties }) {
  const { colors } = useWebTheme();
  if (!open) return null;
  return <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "320px", borderRight: `1px solid ${colors.border}`, background: colors.card, padding: 12, zIndex: 40, ...style }}>{children}</div>;
}

export function BottomSheet({ open = false, children, style }: { open?: boolean; children?: ReactNode; style?: CSSProperties }) {
  const { colors } = useWebTheme();
  if (!open) return null;
  return <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, borderTop: `1px solid ${colors.border}`, borderTopLeftRadius: 16, borderTopRightRadius: 16, background: colors.card, padding: 12, zIndex: 40, ...style }}>{children}</div>;
}
