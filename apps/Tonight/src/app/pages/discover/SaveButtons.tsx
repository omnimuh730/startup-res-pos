/* Self-contained save/bookmark buttons that subscribe independently to savedStore */
import { memo, useSyncExternalStore } from "react";
import { Heart, Bell, ChevronRight } from "lucide-react";
import { useSavedVersion, _savedRIds, _savedFNames } from "./savedStore";
import {
  subscribeNotifications, getNotificationSnapshot, getUnreadCount,
} from "../../stores/notificationStore";
import type { RestaurantData } from "../detail/RestaurantDetailView";
import type { SearchResultFood } from "./discoverTypes";

/** Self-contained save button for restaurant cards (overlay style on images) */
export const CardSaveBtn = memo(function CardSaveBtn({ id, restaurant, onToggle, variant = "overlay" }: {
  id: string;
  restaurant: RestaurantData;
  onToggle: (r: RestaurantData) => void;
  variant?: "overlay" | "inline";
}) {
  useSavedVersion();
  const saved = _savedRIds.has(id);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(restaurant);
  };
  if (variant === "inline") {
    return (
      <button onClick={handleClick} className="shrink-0 p-1.5 rounded-full hover:bg-secondary transition cursor-pointer">
        <Heart className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
      </button>
    );
  }
  return (
    <button onClick={handleClick} className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition">
      <Heart className={`w-3.5 h-3.5 ${saved ? "fill-red-500 text-red-500" : "text-white"}`} />
    </button>
  );
});

/** Reactive saved count badge */
export const SavedCountBadge = memo(function SavedCountBadge({ restaurantsRef, foodsRef }: { restaurantsRef: React.RefObject<RestaurantData[]>; foodsRef: React.RefObject<SearchResultFood[]> }) {
  useSavedVersion();
  const count = (restaurantsRef.current?.length || 0) + (foodsRef.current?.length || 0);
  if (count === 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[1.125rem] rounded-full bg-primary text-primary-foreground text-[0.625rem] flex items-center justify-center" style={{ fontWeight: 700 }}>
      {count}
    </span>
  );
});

/** Notification bell with unread badge */
export const NotificationBellBtn = memo(function NotificationBellBtn({ onClick }: { onClick: () => void }) {
  useSyncExternalStore(subscribeNotifications, getNotificationSnapshot);
  const count = getUnreadCount();
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition cursor-pointer"
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[1.125rem] rounded-full bg-primary text-primary-foreground text-[0.625rem] flex items-center justify-center" style={{ fontWeight: 700 }}>
          {count}
        </span>
      )}
    </button>
  );
});

/** Self-contained save button for food names */
export const FoodNameSaveBtn = memo(function FoodNameSaveBtn({ name, onToggle }: {
  name: string;
  onToggle: (name: string) => void;
}) {
  useSavedVersion();
  const saved = _savedFNames.has(name);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(name);
  };
  return (
    <button onClick={handleClick} className="shrink-0 p-1.5 rounded-full hover:bg-secondary transition cursor-pointer">
      <Heart className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
    </button>
  );
});

/** Section Header */
export function SectionHeader({ title, action = "More", onAction, hideAction }: { title: string; action?: string; onAction?: () => void; hideAction?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[1rem]" style={{ fontWeight: 700 }}>{title}</h3>
      {!hideAction && (onAction ? (
        <button onClick={onAction} className="flex items-center gap-0.5 text-[0.8125rem] text-muted-foreground hover:text-primary transition cursor-pointer">
          {action} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      ) : (
        <span className="flex items-center gap-0.5 text-[0.8125rem] text-muted-foreground">
          {action} <ChevronRight className="w-3.5 h-3.5" />
        </span>
      ))}
    </div>
  );
}

/** Highlight matched text */
export function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary" style={{ fontWeight: 700 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}
