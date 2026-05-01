import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export interface ListItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  rightContent?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface ListGroupProps {
  items: ListItem[];
  variant?: "default" | "bordered" | "separated";
  hoverable?: boolean;
  showChevron?: boolean;
  className?: string;
}

export function ListGroup({
  items,
  variant = "bordered",
  hoverable = true,
  showChevron = false,
  className = "",
}: ListGroupProps) {
  return (
    <div
      className={`
        ${variant === "bordered" ? "border border-border rounded-xl overflow-hidden" : ""}
        ${variant === "separated" ? "space-y-2" : ""}
        ${className}
      `}
    >
      {items.map((item, idx) => (
        <div key={item.id}>
          <div
            onClick={!item.disabled ? item.onClick : undefined}
            className={`
              flex items-center gap-3 px-4 py-3 transition-colors
              ${item.onClick && !item.disabled ? "cursor-pointer" : ""}
              ${hoverable && !item.disabled ? "hover:bg-secondary" : ""}
              ${item.disabled ? "opacity-50" : ""}
              ${variant === "separated" ? "border border-border rounded-xl" : ""}
            `}
          >
            {item.icon && <span className="shrink-0 text-muted-foreground">{item.icon}</span>}
            <div className="flex-1 min-w-0">
              <p className="text-[0.8125rem]">{item.label}</p>
              {item.description && (
                <p className="text-[0.6875rem] text-muted-foreground truncate">{item.description}</p>
              )}
            </div>
            {item.rightContent && <span className="shrink-0">{item.rightContent}</span>}
            {showChevron && item.onClick && (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </div>
          {variant === "bordered" && !item.divider && idx < items.length - 1 && (
            <div className="h-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
