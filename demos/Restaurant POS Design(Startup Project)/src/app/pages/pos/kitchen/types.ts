export type OrderStatus = "received" | "in-progress" | "completed";

export interface KitchenOrderItem {
  id: string;
  name: string;
  qty: number;
  done: boolean;
  modifier?: string;
  /** Items from a previous order round — shown grayed out */
  previouslyCompleted?: boolean;
}

export interface KitchenOrder {
  id: string;
  table: string;
  status: OrderStatus;
  orderedAt: number; // timestamp ms
  completedAt?: number;
  items: KitchenOrderItem[];
  isPriority?: boolean;
}

export type ViewTab = "received" | "in-progress" | "completed";
export type SortMode = "oldest" | "newest";
export type ViewMode = "by-table" | "by-item";
