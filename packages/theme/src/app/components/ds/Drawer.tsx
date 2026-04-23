import { useEffect, type ReactNode } from "react";
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

  const pos = positionMap[side];

  return (
    <>
      {/* Overlay */}
      {overlay && (
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`
          fixed z-50 ${pos.base} ${sizeMap[side][size]}
          bg-background border-border shadow-2xl
          transition-transform duration-300 ease-out
          ${open ? pos.open : pos.closed}
          ${side === "left" || side === "right" ? "border-x" : "border-y"}
          flex flex-col
          ${className}
        `}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <h3 className="text-[0.9375rem]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="border-t border-border px-5 py-4 shrink-0">{footer}</div>
        )}
      </div>
    </>
  );
}
