import { useState, type ReactNode } from "react";
import { useWebTheme } from "../theme/provider";
import type { BreadcrumbItem, ListItem } from "@rn/ui-core";

export function ListGroup({ items = [] }: { items?: ListItem[] }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, background: colors.card }}>
      {items.map((item, idx) => (
        <div key={item.id} style={{ padding: 10, borderTop: idx > 0 ? `1px solid ${colors.border}` : undefined }}>
          <div style={{ color: colors.foreground, fontWeight: 600 }}>{item.label}</div>
          {item.description ? <div style={{ color: colors.mutedForeground, fontSize: 12 }}>{item.description}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title = "No data", description = "Nothing to show yet." }: { title?: string; description?: string }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, background: colors.card, padding: 16, textAlign: "center" }}>
      <div style={{ color: colors.foreground, fontWeight: 700 }}>{title}</div>
      <div style={{ color: colors.mutedForeground, fontSize: 12 }}>{description}</div>
    </div>
  );
}

export function Breadcrumbs({ items = [], onSelect }: { items?: BreadcrumbItem[]; onSelect?: (value: string) => void }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {items.map((item, idx) => (
        <div key={item.value} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => onSelect?.(item.value)} style={{ border: 0, background: "transparent", color: colors.primary, cursor: "pointer" }}>{item.label}</button>
          {idx < items.length - 1 ? <span style={{ color: colors.mutedForeground }}>/</span> : null}
        </div>
      ))}
    </div>
  );
}

export function Navbar({ title = "Navbar", left, right }: { title?: string; left?: ReactNode; right?: ReactNode }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ minHeight: 48, border: `1px solid ${colors.border}`, borderRadius: 10, background: colors.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
      <div style={{ minWidth: 48 }}>{left}</div>
      <div style={{ color: colors.foreground, fontWeight: 700 }}>{title}</div>
      <div style={{ minWidth: 48, textAlign: "right" }}>{right}</div>
    </div>
  );
}

export function Carousel({ children }: { children?: ReactNode }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 10, padding: 10 }}>{children}</div>
    </div>
  );
}

export function Overlay({ open = false, children }: { open?: boolean; children?: ReactNode }) {
  if (!open) return null;
  return <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 20 }}>{children}</div>;
}

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  const [show, setShow] = useState(false);
  const { colors } = useWebTheme();
  return (
    <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} style={{ display: "inline-block" }}>
      {children}
      {show ? <div style={{ marginTop: 6, borderRadius: 8, padding: "4px 8px", background: colors.foreground, color: colors.background, fontSize: 11 }}>{content}</div> : null}
    </div>
  );
}

export function Popover({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { colors } = useWebTheme();
  return (
    <div>
      <button onClick={() => setOpen((v) => !v)} style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}>{trigger}</button>
      {open ? <div style={{ marginTop: 8, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 10, background: colors.card }}>{children}</div> : null}
    </div>
  );
}
