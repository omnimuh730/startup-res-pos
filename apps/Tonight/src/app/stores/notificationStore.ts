/* ── Notification Store (module-level, useSyncExternalStore compatible) ── */

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: "reservation" | "promo" | "reward" | "system" | "review" | "share";
  bookingId?: string;
  tab?: string;
  restaurant?: {
    id: string;
    name: string;
    cuisine: string;
    emoji?: string;
    rating: number;
    reviews: number;
    price: string;
    lng: number;
    lat: number;
    open: boolean;
    distance: string;
    image: string;
  };
}

type NewNotification = Omit<Notification, "id" | "time" | "read"> & Partial<Pick<Notification, "id" | "time" | "read">>;

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Reservation Confirmed", message: "Your table at Sakura Omakase is confirmed for Apr 18 at 7:30 PM.", time: "2m ago", read: false, icon: "reservation", bookingId: "1", tab: "upcoming" },
  { id: "n10", title: "Sarah shared a restaurant", message: "Sarah Kim thought you would like Le Petit Bistro.", time: "6m ago", read: false, icon: "share" },
  { id: "n11", title: "Reservation request pending", message: "Your request at Nami Counter is waiting for restaurant approval.", time: "9m ago", read: false, icon: "reservation", bookingId: "9", tab: "upcoming" },
  { id: "n12", title: "Reservation request rejected", message: "Riverside Tapas could not approve your request. You can request again from the restaurant profile.", time: "12m ago", read: false, icon: "reservation", bookingId: "10" },
  { id: "n2", title: "Flash Deal: 30% Off", message: "Enjoy 30% off at Bella Napoli this weekend only!", time: "15m ago", read: false, icon: "promo" },
  { id: "n3", title: "You Earned 425 pts!", message: "Points from your last visit have been credited.", time: "1h ago", read: false, icon: "reward" },
  { id: "n4", title: "New Review Reply", message: "Chef Tanaka replied to your review at Sakura Omakase.", time: "3h ago", read: false, icon: "review" },
  { id: "n5", title: "Booking Confirmed", message: "Your reservation at Le Jardin has been confirmed.", time: "5h ago", read: false, icon: "reservation", tab: "upcoming" },
  { id: "n6", title: "Weekend Picks", message: "Check out this week's top-rated restaurants near you.", time: "1d ago", read: true, icon: "promo" },
  { id: "n7", title: "Reservation Reminder", message: "Don't forget your dinner at Golden Dragon tomorrow at 8 PM.", time: "1d ago", read: true, icon: "reservation" },
  { id: "n8", title: "Tier Upgrade Progress", message: "Only 2,660 pts to reach Platinum tier!", time: "2d ago", read: true, icon: "reward" },
  { id: "n9", title: "App Update Available", message: "Version 2.4.1 includes performance improvements.", time: "3d ago", read: true, icon: "system" },
];

let _notifications = [...INITIAL_NOTIFICATIONS];
let _listeners = new Set<() => void>();
let _snapshot = 0;

function _notify() { _snapshot++; _listeners.forEach(fn => fn()); }

export function subscribeNotifications(fn: () => void) {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

export function getNotificationSnapshot() { return _snapshot; }

export function getNotifications() { return _notifications; }

export function getUnreadCount() { return _notifications.filter(n => !n.read).length; }

export function addNotification(notification: NewNotification) {
  const id = notification.id ?? `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  _notifications = [{
    ...notification,
    id,
    time: notification.time ?? "Just now",
    read: notification.read ?? false,
  }, ..._notifications];
  _notify();
}

export function markAsRead(id: string) {
  _notifications = _notifications.map(n => n.id === id ? { ...n, read: true } : n);
  _notify();
}

export function markAllAsRead() {
  _notifications = _notifications.map(n => ({ ...n, read: true }));
  _notify();
}

export function deleteNotification(id: string) {
  _notifications = _notifications.filter(n => n.id !== id);
  _notify();
}

export function clearAll() {
  _notifications = [];
  _notify();
}

export function clearRead() {
  _notifications = _notifications.filter(n => !n.read);
  _notify();
}

export function clearUnread() {
  _notifications = _notifications.filter(n => n.read);
  _notify();
}
