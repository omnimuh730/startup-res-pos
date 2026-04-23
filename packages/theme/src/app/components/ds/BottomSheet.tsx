import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

type BottomSheetSnap = "min" | "half" | "full";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  snap?: BottomSheetSnap;
  showHandle?: boolean;
  className?: string;
}

const snapHeights: Record<BottomSheetSnap, string> = {
  min: "max-h-[35vh]",
  half: "max-h-[55vh]",
  full: "max-h-[92vh]",
};

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  snap = "half",
  showHandle = true,
  className = "",
}: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "translate-y-full"}
          ${snapHeights[snap]}
          flex flex-col
          ${className}
        `}
      >
        {showHandle && (
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted" />
          </div>
        )}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
            <h3 className="text-[0.9375rem]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="border-t border-border px-5 py-4 shrink-0">{footer}</div>
        )}
      </div>
    </>
  );
}
