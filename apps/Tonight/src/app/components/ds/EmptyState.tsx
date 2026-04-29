import { type ReactNode } from "react";
import { Inbox, Search, ShoppingCart, FileText, Heart, MapPin } from "lucide-react";

type EmptyStatePreset = "generic" | "search" | "cart" | "documents" | "favorites" | "location";

export interface EmptyStateProps {
  preset?: EmptyStatePreset;
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}

const presets: Record<EmptyStatePreset, { icon: ReactNode; title: string; description: string }> = {
  generic: {
    icon: <Inbox className="w-10 h-10" />,
    title: "Nothing here yet",
    description: "When you add items, they'll appear here.",
  },
  search: {
    icon: <Search className="w-10 h-10" />,
    title: "No results found",
    description: "Try adjusting your search or filters to find what you're looking for.",
  },
  cart: {
    icon: <ShoppingCart className="w-10 h-10" />,
    title: "Your cart is empty",
    description: "Add items to your cart to get started with your order.",
  },
  documents: {
    icon: <FileText className="w-10 h-10" />,
    title: "No documents",
    description: "Upload or create a document to see it here.",
  },
  favorites: {
    icon: <Heart className="w-10 h-10" />,
    title: "No favorites yet",
    description: "Save items you love and they'll appear here for easy access.",
  },
  location: {
    icon: <MapPin className="w-10 h-10" />,
    title: "No locations found",
    description: "Try expanding your search area or adjusting filters.",
  },
};

export function EmptyState({
  preset = "generic",
  icon,
  title,
  description,
  action,
  compact = false,
  className = "",
}: EmptyStateProps) {
  const p = presets[preset];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-8 px-4" : "py-16 px-6"} ${className}`}>
      <div className={`${compact ? "mb-3" : "mb-5"} text-muted-foreground/50`}>
        {icon || p.icon}
      </div>
      <h3 className={`${compact ? "text-[0.9375rem]" : "text-[1.125rem]"} mb-1`}>
        {title || p.title}
      </h3>
      <p className={`${compact ? "text-[0.75rem]" : "text-[0.8125rem]"} text-muted-foreground max-w-sm`}>
        {description || p.description}
      </p>
      {action && <div className={`${compact ? "mt-3" : "mt-5"}`}>{action}</div>}
    </div>
  );
}
