import { useState, useRef, useEffect, type ReactNode } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 200,
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  const show = () => {
    timerRef.current = window.setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    setVisible(false);
  };

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  const positionClasses: Record<TooltipPlacement, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={`relative inline-flex ${className}`} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          className={`
            absolute z-50 ${positionClasses[placement]}
            px-2.5 py-1.5 bg-foreground text-background text-[0.6875rem] rounded-lg
            whitespace-nowrap pointer-events-none shadow-lg
            animate-[tooltipIn_0.15s_ease-out]
          `}
        >
          {content}
        </div>
      )}
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(2px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ── Popover ────────────────────────────────────────────────
export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  className?: string;
}

export function Popover({ trigger, children, placement = "bottom", className = "" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const positionClasses: Record<TooltipPlacement, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-0 mt-2",
    left: "right-full top-0 mr-2",
    right: "left-full top-0 ml-2",
  };

  return (
    <div className={`relative inline-flex ${className}`} ref={ref}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={`
            absolute z-50 ${positionClasses[placement]}
            bg-background border border-border rounded-xl shadow-xl p-4 min-w-[220px]
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}
