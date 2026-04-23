import type { HTMLAttributes } from "react";
import { useWebTheme } from "../theme/provider";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({ open = false, onOpenChange, children, style, ...props }: ModalProps) {
  const { colors } = useWebTheme();
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center" }}>
      <button onClick={() => onOpenChange?.(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", border: 0 }} />
      <div {...props} style={{ position: "relative", width: "min(560px, 90vw)", border: `1px solid ${colors.border}`, borderRadius: 12, background: colors.card, padding: 12, ...style }}>
        {children}
      </div>
    </div>
  );
}

export const ModalHeader = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />;
export const ModalBody = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />;
export const ModalFooter = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />;
