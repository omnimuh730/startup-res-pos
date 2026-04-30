import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info, Sparkles } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "default";
type ToastPosition = "top-center" | "bottom-center";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: (_t: Omit<ToastItem, "id">) => {
        console.warn("useToast: wrap your app with <ToastProvider>");
      },
      success: (_title: string, _description?: string) => {},
      error: (_title: string, _description?: string) => {},
      warning: (_title: string, _description?: string) => {},
      info: (_title: string, _description?: string) => {},
    };
  }
  return {
    toast: ctx.addToast,
    success: (title: string, description?: string) => ctx.addToast({ type: "success", title, description }),
    error: (title: string, description?: string) => ctx.addToast({ type: "error", title, description }),
    warning: (title: string, description?: string) => ctx.addToast({ type: "warning", title, description }),
    info: (title: string, description?: string) => ctx.addToast({ type: "info", title, description }),
  };
}

const typeConfig: Record<ToastType, { icon: ReactNode; tone: string; glow: string; bar: string }> = {
  success: {
    icon: <CheckCircle className="h-5 w-5" strokeWidth={2.5} />,
    tone: "bg-primary text-primary-foreground",
    glow: "bg-primary/20",
    bar: "from-primary via-primary to-rose-400",
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" strokeWidth={2.5} />,
    tone: "bg-destructive text-destructive-foreground",
    glow: "bg-destructive/20",
    bar: "from-destructive via-destructive to-red-400",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />,
    tone: "bg-warning text-warning-foreground",
    glow: "bg-warning/20",
    bar: "from-warning via-warning to-amber-300",
  },
  info: {
    icon: <Info className="h-5 w-5" strokeWidth={2.5} />,
    tone: "bg-foreground text-background",
    glow: "bg-foreground/10",
    bar: "from-foreground via-foreground to-muted-foreground",
  },
  default: {
    icon: <Sparkles className="h-5 w-5" strokeWidth={2.5} />,
    tone: "bg-foreground text-background",
    glow: "bg-foreground/10",
    bar: "from-foreground via-foreground to-muted-foreground",
  },
};

function ToastComponent({ toast, index, onRemove }: { toast: ToastItem; index: number; onRemove: () => void }) {
  const config = typeConfig[toast.type];

  useEffect(() => {
    const timer = setTimeout(onRemove, toast.duration || 4200);
    return () => clearTimeout(timer);
  }, [onRemove, toast.duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -22, scale: 0.94, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, scale: 0.96, filter: "blur(8px)" }}
      transition={{ type: "spring", stiffness: 520, damping: 36, mass: 0.8 }}
      className="pointer-events-auto relative w-full max-w-[25rem] overflow-hidden rounded-[1.35rem] border border-black/10 bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl"
      style={{ zIndex: 760 - index }}
      role="status"
      aria-live="polite"
    >
      <motion.div
        className={`absolute -left-10 -top-12 h-28 w-28 rounded-full blur-2xl ${config.glow}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.35 }}
      />
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${config.bar}`} />
      <div className="relative flex items-start gap-3 p-3.5 pr-3">
        <motion.div
          initial={{ rotate: -18, scale: 0.6 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 650, damping: 24 }}
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${config.tone}`}
        >
          {config.icon}
        </motion.div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="truncate text-[0.92rem] font-bold leading-tight text-foreground">{toast.title}</p>
          {toast.description && (
            <p className="mt-1 line-clamp-2 text-[0.78rem] leading-relaxed text-muted-foreground">{toast.description}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-[0.78rem] font-bold text-primary underline underline-offset-2 transition hover:text-primary/80"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={onRemove}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:bg-border hover:text-foreground active:scale-95"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastProvider({
  children,
  position = "top-center",
  maxToasts = 3,
}: {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [{ ...toast, id }, ...prev].slice(0, maxToasts));
    },
    [maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const viewport = (
    <div
      className={`pointer-events-none fixed inset-x-0 z-[750] flex justify-center px-4 ${
        position === "top-center"
          ? "top-[calc(var(--safe-area-inset-top,0px)+0.85rem)]"
          : "bottom-[calc(var(--safe-area-inset-bottom,0px)+0.85rem)]"
      }`}
    >
      <div className="flex w-full max-w-[25rem] flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {toasts.map((t, index) => (
            <ToastComponent key={t.id} toast={t} index={index} onRemove={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {typeof document !== "undefined" ? createPortal(viewport, document.body) : null}
    </ToastContext.Provider>
  );
}
