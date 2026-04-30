import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type DrawerSide = "left" | "right" | "top" | "bottom";
type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  overlay?: boolean;
  className?: string;
  showCloseButton?: boolean;
}

interface DrawerHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DrawerBodyProps {
  children: ReactNode;
  className?: string;
}

interface DrawerFooterProps {
  children: ReactNode;
  className?: string;
}

const sizeMap: Record<DrawerSide, Record<DrawerSize, string>> = {
  left: { sm: "w-64", md: "w-80", lg: "w-96", xl: "w-[480px]", full: "w-screen" },
  right: { sm: "w-64", md: "w-80", lg: "w-96", xl: "w-[480px]", full: "w-screen" },
  top: { sm: "h-48", md: "h-64", lg: "h-80", xl: "h-[480px]", full: "h-screen" },
  bottom: { sm: "h-48", md: "h-64", lg: "h-80", xl: "h-[480px]", full: "h-screen" },
};

const positionMap: Record<DrawerSide, { base: string; open: string; closed: string }> = {
  left: { base: "top-0 left-0 h-full", open: "translate-x-0", closed: "-translate-x-full" },
  right: { base: "top-0 right-0 h-full", open: "translate-x-0", closed: "translate-x-full" },
  top: { base: "top-0 left-0 w-full", open: "translate-y-0", closed: "-translate-y-full" },
  bottom: { base: "bottom-0 left-0 w-full", open: "translate-y-0", closed: "translate-y-full" },
};

export function Drawer({
  open,
  onClose,
  side = "right",
  size = "md",
  title,
  children,
  footer,
  overlay = true,
  className = "",
  showCloseButton = true,
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const pos = positionMap[side];

  return createPortal(
    <>
      {/* Overlay */}
      {overlay && (
        <div
          className={`fixed inset-0 z-[500] bg-black/40 transition-opacity duration-300 ${
            open ? "opacity-100 animate-in fade-in" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`
          fixed z-[501] ${pos.base} ${sizeMap[side][size]}
          bg-card border-border shadow-2xl
          transition-transform duration-300 ease-out
          ${open ? pos.open : pos.closed}
          ${side === "left" || side === "right" ? "border-x" : "border-y"}
          ${side === "bottom" ? "rounded-t-3xl" : side === "top" ? "rounded-b-3xl" : ""}
          flex flex-col
          ${className}
        `}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
            <h3 className="text-[1.0625rem]" style={{ fontWeight: 600 }}>{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        <div className={`flex-1 flex flex-col min-h-0 ${title ? "overflow-y-auto px-6 py-4" : ""}`}>{children}</div>
        {footer && (
          <div className="border-t border-border px-6 py-4 shrink-0">{footer}</div>
        )}
      </div>
    </>,
    document.body
  );
}

export function DrawerHeader({ children, className = "" }: DrawerHeaderProps) {
  return (
    <div className={`px-6 pt-6 pb-2 pr-12 ${className}`}>
      {typeof children === "string" ? (
        <h3 className="text-[1.0625rem]" style={{ fontWeight: 600 }}>{children}</h3>
      ) : (
        children
      )}
    </div>
  );
}

export function DrawerBody({ children, className = "" }: DrawerBodyProps) {
  return <div className={`flex-1 overflow-y-auto px-6 py-4 ${className}`}>{children}</div>;
}

export function DrawerFooter({ children, className = "" }: DrawerFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-border flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}
