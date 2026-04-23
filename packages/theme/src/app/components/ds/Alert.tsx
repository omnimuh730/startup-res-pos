import { useState, type ReactNode } from "react";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

type AlertVariant = "filled" | "outlined" | "soft";
type AlertColor = "info" | "success" | "warning" | "destructive" | "default";

export interface AlertProps {
  variant?: AlertVariant;
  color?: AlertColor;
  title?: string;
  children?: ReactNode;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
  className?: string;
}

const defaultIcons: Record<AlertColor, ReactNode> = {
  info: <Info className="w-4.5 h-4.5" />,
  success: <CheckCircle className="w-4.5 h-4.5" />,
  warning: <AlertTriangle className="w-4.5 h-4.5" />,
  destructive: <AlertCircle className="w-4.5 h-4.5" />,
  default: <Info className="w-4.5 h-4.5" />,
};

const styles: Record<AlertColor, Record<AlertVariant, string>> = {
  info: {
    filled: "bg-info text-info-foreground",
    outlined: "border border-info text-info bg-transparent",
    soft: "bg-info/10 text-info border border-info/20",
  },
  success: {
    filled: "bg-success text-success-foreground",
    outlined: "border border-success text-success bg-transparent",
    soft: "bg-success/10 text-success border border-success/20",
  },
  warning: {
    filled: "bg-warning text-warning-foreground",
    outlined: "border border-warning text-warning bg-transparent",
    soft: "bg-warning/10 text-warning border border-warning/20",
  },
  destructive: {
    filled: "bg-destructive text-destructive-foreground",
    outlined: "border border-destructive text-destructive bg-transparent",
    soft: "bg-destructive/10 text-destructive border border-destructive/20",
  },
  default: {
    filled: "bg-foreground text-background",
    outlined: "border border-border text-foreground bg-transparent",
    soft: "bg-muted text-foreground border border-border",
  },
};

export function Alert({
  variant = "soft",
  color = "info",
  title,
  children,
  icon,
  dismissible = false,
  onDismiss,
  action,
  className = "",
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl ${styles[color][variant]} ${className}`}>
      <span className="shrink-0 mt-0.5">{icon || defaultIcons[color]}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-[0.8125rem]">{title}</p>}
        {children && <div className={`text-[0.75rem] ${title ? "mt-0.5" : ""} opacity-90`}>{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="shrink-0 p-0.5 hover:opacity-70 rounded cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ── Banner ─────────────────────────────────────────────────
export interface BannerProps {
  color?: AlertColor;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
  className?: string;
}

export function Banner({
  color = "info",
  children,
  dismissible = false,
  onDismiss,
  action,
  className = "",
}: BannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const bgMap: Record<AlertColor, string> = {
    info: "bg-info text-info-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    default: "bg-foreground text-background",
  };

  return (
    <div className={`flex items-center justify-center gap-3 px-4 py-2.5 text-[0.8125rem] ${bgMap[color]} ${className}`}>
      <div className="flex items-center gap-2 flex-1 justify-center">
        {children}
        {action}
      </div>
      {dismissible && (
        <button
          onClick={() => { setVisible(false); onDismiss?.(); }}
          className="shrink-0 p-0.5 hover:opacity-70 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
