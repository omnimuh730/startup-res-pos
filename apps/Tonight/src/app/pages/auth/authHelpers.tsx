/* Auth shared components: logo, inputs, banners, progress, mock data */
import { useState, type ElementType, type ReactNode } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  const size = compact ? 42 : 52;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        initial={{ rotate: -12, scale: 0.88, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="absolute inset-0 rounded-[1.25rem] bg-primary shadow-[0_12px_28px_rgba(255,56,92,0.24)]"
      />
      <div className="relative h-[46%] w-[46%] rounded-full border-[5px] border-white">
        <span className="absolute -left-[48%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white" />
        <span className="absolute -right-[48%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white" />
        <span className="absolute left-1/2 -top-[48%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white" />
      </div>
    </div>
  );
}

export function AuthSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`min-h-screen bg-background ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-5">
        {children}
      </div>
    </motion.div>
  );
}

export function AuthHero({
  icon,
  title,
  subtitle,
}: {
  icon?: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 text-center">
      <div className="mb-4 flex justify-center">{icon ?? <Logo />}</div>
      <h1 className="text-[1.75rem] leading-tight text-foreground" style={{ fontWeight: 900 }}>
        {title}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-[0.875rem] leading-snug text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function IconBadge({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "success" | "warning";
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  }[tone];

  return <div className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] ${toneClass}`}>{children}</div>;
}

export function InputField({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  disabled,
}: {
  icon: ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === "password";

  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" strokeWidth={1.9} />
        <input
          type={isPw && showPw ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className={`h-12 w-full rounded-full border bg-secondary/55 pl-11 pr-12 text-[0.9375rem] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:bg-card focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-destructive focus:ring-destructive/15" : "border-transparent focus:border-primary focus:ring-primary/15"
          }`}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition hover:text-foreground"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 px-1 text-[0.75rem] text-destructive">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function FeedbackBanner({
  type,
  message,
  onDismiss,
}: {
  type: "success" | "error" | "warning";
  message: string;
  onDismiss?: () => void;
}) {
  const styles = {
    success: "border-success/25 bg-success/8 text-success",
    error: "border-destructive/25 bg-destructive/8 text-destructive",
    warning: "border-warning/25 bg-warning/10 text-warning",
  };
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0" />,
    error: <XCircle className="h-4 w-4 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      className={`flex items-start gap-2.5 rounded-[1.25rem] border px-4 py-3 text-[0.8125rem] ${styles[type]}`}
    >
      <span className="mt-0.5">{icons[type]}</span>
      <span className="min-w-0 flex-1 leading-snug">{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="mt-0.5 cursor-pointer opacity-65 transition hover:opacity-100" aria-label="Dismiss">
          <XCircle className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}

export function AuthProgress({
  labels,
  activeIndex,
}: {
  labels: string[];
  activeIndex: number;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[0.75rem] text-muted-foreground" style={{ fontWeight: 800 }}>
          Progress
        </span>
        <span className="text-[0.75rem] text-primary" style={{ fontWeight: 900 }}>
          {labels[Math.min(activeIndex, labels.length - 1)]}
        </span>
      </div>
      <div className="flex gap-1.5">
        {labels.map((label, index) => {
          const complete = index < activeIndex;
          const active = index === activeIndex;
          return (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full ${complete ? "bg-success" : active ? "bg-primary" : "bg-border"}`} />
              <div className={`mt-1 truncate text-center text-[0.625rem] ${complete ? "text-success" : active ? "text-foreground" : "text-muted-foreground/55"}`} style={{ fontWeight: active || complete ? 800 : 500 }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const MOCK_USERS: Record<string, { password: string; name: string; active: boolean; securityQA: { q: string; a: string }[] }> = {
  catchtable: {
    password: "Pass1234",
    name: "Demo User",
    active: true,
    securityQA: [
      { q: "What is your pet's name?", a: "fluffy" },
      { q: "What city were you born in?", a: "seoul" },
      { q: "What is your favorite food?", a: "pizza" },
    ],
  },
  admin: {
    password: "Admin123",
    name: "Admin",
    active: false,
    securityQA: [
      { q: "What city were you born in?", a: "seoul" },
      { q: "What was the name of your first school?", a: "greenfield" },
      { q: "What is your mother's maiden name?", a: "kim" },
    ],
  },
  foodie99: {
    password: "Yummy123",
    name: "Food Lover",
    active: true,
    securityQA: [
      { q: "What is your favorite food?", a: "pizza" },
      { q: "What is your pet's name?", a: "buddy" },
      { q: "What was your childhood nickname?", a: "foodster" },
    ],
  },
};

export const SECURITY_QUESTIONS = [
  "What is your pet's name?",
  "What city were you born in?",
  "What is your favorite food?",
  "What was the name of your first school?",
  "What is your mother's maiden name?",
  "What was your childhood nickname?",
  "What is your favorite movie?",
  "What street did you grow up on?",
  "What is your favorite sports team?",
];
