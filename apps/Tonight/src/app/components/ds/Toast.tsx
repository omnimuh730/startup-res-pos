import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "default";
type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

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
    // Fallback for standalone usage
    return {
      toast: (_t: Omit<ToastItem, "id">) => {
        console.warn("useToast: wrap your app with <ToastProvider>");
      },
      success: (title: string, description?: string) => {},
      error: (title: string, description?: string) => {},
      warning: (title: string, description?: string) => {},
      info: (title: string, description?: string) => {},
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

const typeConfig: Record<ToastType, { icon: ReactNode; borderClass: string }> = {
  success: { icon: <CheckCircle className="w-5 h-5 text-success" />, borderClass: "border-l-success" },
  error: { icon: <AlertCircle className="w-5 h-5 text-destructive" />, borderClass: "border-l-destructive" },
  warning: { icon: <AlertTriangle className="w-5 h-5 text-warning" />, borderClass: "border-l-warning" },
  info: { icon: <Info className="w-5 h-5 text-info" />, borderClass: "border-l-info" },
  default: { icon: null, borderClass: "border-l-border" },
};

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

function ToastComponent({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  const config = typeConfig[toast.type];

  useEffect(() => {
    const timer = setTimeout(onRemove, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [onRemove, toast.duration]);

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 bg-background border border-border rounded-xl shadow-lg
        border-l-4 ${config.borderClass}
        animate-[slideIn_0.3s_ease-out] min-w-[280px] max-w-[380px]
      `}
    >
      {config.icon && <span className="shrink-0 mt-0.5">{config.icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-[0.8125rem]">{toast.title}</p>
        {toast.description && (
          <p className="text-[0.75rem] text-muted-foreground mt-0.5">{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="text-[0.75rem] text-primary hover:underline mt-1 cursor-pointer"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button onClick={onRemove} className="shrink-0 p-0.5 hover:bg-secondary rounded cursor-pointer">
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}

export function ToastProvider({
  children,
  position = "top-right",
  maxToasts = 5,
}: {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-(maxToasts - 1)), { ...toast, id }]);
    },
    [maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className={`fixed z-[100] ${positionClasses[position]} flex flex-col gap-2`}>
        {toasts.map((t) => (
          <ToastComponent key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
