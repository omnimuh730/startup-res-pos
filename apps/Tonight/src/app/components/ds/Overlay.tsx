import { useEffect, useCallback, type ReactNode } from "react";

type OverlayBlur = "none" | "sm" | "md" | "lg";

interface OverlayProps {
  open: boolean;
  onClose?: () => void;
  blur?: OverlayBlur;
  opacity?: number;
  color?: string;
  closeOnClick?: boolean;
  closeOnEsc?: boolean;
  zIndex?: number;
  children?: ReactNode;
  className?: string;
}

const blurMap: Record<OverlayBlur, string> = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
};

export function Overlay({
  open,
  onClose,
  blur = "sm",
  opacity = 0.5,
  color,
  closeOnClick = true,
  closeOnEsc = true,
  zIndex = 50,
  children,
  className = "",
}: OverlayProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc && onClose) onClose();
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

  const bgColor = color ?? `rgba(0, 0, 0, ${opacity})`;

  return (
    <div
      className={`fixed inset-0 ${blurMap[blur]} transition-opacity ${className}`}
      style={{ zIndex, backgroundColor: color ? undefined : bgColor }}
      onClick={closeOnClick ? onClose : undefined}
      aria-hidden="true"
    >
      {color && (
        <div className="absolute inset-0" style={{ backgroundColor: color, opacity }} />
      )}
      {children && (
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
}
