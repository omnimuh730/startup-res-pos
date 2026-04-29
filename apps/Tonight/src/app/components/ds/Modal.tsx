import { useEffect, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  children: ReactNode;
  className?: string;
}

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

export function Modal({
  open,
  onClose,
  size = "md",
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  className = "",
}: ModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) onClose();
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, handleEsc]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${sizeMap[size]} max-h-[85vh] bg-card rounded-2xl shadow-2xl overflow-y-auto
          animate-in fade-in zoom-in-95 ${className}`}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ModalHeader({ children, className = "" }: ModalHeaderProps) {
  return (
    <div className={`px-6 pt-6 pb-2 pr-12 ${className}`}>
      {typeof children === "string" ? (
        <h3 className="text-[1.0625rem]">{children}</h3>
      ) : (
        children
      )}
    </div>
  );
}

export function ModalBody({ children, className = "" }: ModalBodyProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-border flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}