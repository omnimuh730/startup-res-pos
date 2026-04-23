import { useState, createContext, useContext, type ReactNode } from "react";

type TabVariant = "underline" | "pill" | "boxed";
type TabSize = "sm" | "md" | "lg";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: TabVariant;
  size: TabSize;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used within <Tabs>");
  return ctx;
}

// ── Tabs Root ──────────────────────────────────────────────
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = "underline",
  size = "md",
  children,
  className = "",
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const activeTab = value ?? internal;

  const setActiveTab = (id: string) => {
    if (!value) setInternal(id);
    onValueChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, size }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// ── Tab List ───────────────────────────────────────────────
interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className = "" }: TabListProps) {
  const { variant } = useTabsContext();

  const base =
    variant === "underline"
      ? "flex border-b border-border"
      : variant === "pill"
      ? "inline-flex bg-secondary rounded-xl p-1 gap-1"
      : "inline-flex border border-border rounded-lg p-1 gap-1";

  return (
    <div role="tablist" className={`${base} ${className}`}>
      {children}
    </div>
  );
}

// ── Tab Trigger ────────────────────────────────────────────
interface TabTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: string | number;
  className?: string;
}

const sizeMap: Record<TabSize, string> = {
  sm: "px-3 py-1.5 text-[0.75rem]",
  md: "px-4 py-2 text-[0.8125rem]",
  lg: "px-5 py-2.5 text-[0.9375rem]",
};

export function TabTrigger({
  value,
  children,
  disabled = false,
  icon,
  badge,
  className = "",
}: TabTriggerProps) {
  const { activeTab, setActiveTab, variant, size } = useTabsContext();
  const isActive = activeTab === value;

  const variantClasses = (() => {
    if (variant === "underline") {
      return isActive
        ? "border-b-2 border-primary text-primary -mb-px"
        : "border-b-2 border-transparent text-muted-foreground hover:text-foreground -mb-px";
    }
    if (variant === "pill") {
      return isActive
        ? "bg-card shadow-sm text-foreground rounded-lg"
        : "text-muted-foreground hover:text-foreground rounded-lg";
    }
    // boxed
    return isActive
      ? "bg-primary text-primary-foreground rounded-md"
      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-md";
  })();

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={`inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap
        ${sizeMap[size]} ${variantClasses}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        ${className}`}
    >
      {icon}
      {children}
      {badge !== undefined && (
        <span
          className={`ml-1 min-w-[18px] h-[18px] px-1 rounded-full text-[0.625rem] inline-flex items-center justify-center ${
            isActive
              ? variant === "boxed"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Tab Panel ──────────────────────────────────────────────
interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className = "" }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}
