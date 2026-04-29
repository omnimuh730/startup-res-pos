import { ChevronRight, Home } from "lucide-react";
import { type ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHome?: boolean;
  onNavigate?: (href: string) => void;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator,
  showHome = true,
  onNavigate,
  className = "",
}: BreadcrumbsProps) {
  const sep = separator || <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-1.5 ${className}`}>
      {showHome && (
        <>
          <button
            onClick={() => onNavigate?.("/")}
            className="p-1 hover:bg-secondary rounded cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          {items.length > 0 && sep}
        </>
      )}
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            {isLast ? (
              <span className="text-[0.8125rem] text-foreground flex items-center gap-1.5">
                {item.icon}
                {item.label}
              </span>
            ) : (
              <>
                <button
                  onClick={() => item.href && onNavigate?.(item.href)}
                  className="text-[0.8125rem] text-muted-foreground hover:text-foreground cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  {item.icon}
                  {item.label}
                </button>
                {sep}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
