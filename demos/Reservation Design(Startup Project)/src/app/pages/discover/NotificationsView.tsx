/* Notifications View with All/Unread/Read tabs */
import { useState, useSyncExternalStore } from "react";
import { ArrowLeft, Bell, Check, Trash2 } from "lucide-react";
import { Heading } from "../../components/ds/Text";
import { Text } from "../../components/ds/Text";
import {
  subscribeNotifications, getNotificationSnapshot, getNotifications,
  getUnreadCount, markAsRead, markAllAsRead, deleteNotification,
  clearAll, clearRead, clearUnread,
  type Notification,
} from "../../stores/notificationStore";

export function NotificationsView({ onBack }: { onBack: () => void }) {
  useSyncExternalStore(subscribeNotifications, getNotificationSnapshot);
  const notifications = getNotifications();
  const [tab, setTab] = useState<"all" | "unread" | "read">("all");

  const filtered = tab === "all" ? notifications : tab === "unread" ? notifications.filter(n => !n.read) : notifications.filter(n => n.read);

  const iconMap: Record<Notification["icon"], { emoji: string; bg: string }> = {
    reservation: { emoji: "R", bg: "bg-primary/10" },
    promo: { emoji: "P", bg: "bg-warning/10" },
    reward: { emoji: "W", bg: "bg-success/10" },
    system: { emoji: "S", bg: "bg-secondary" },
    review: { emoji: "V", bg: "bg-info/10" },
  };

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-secondary rounded-full transition cursor-pointer shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Heading level={3}>Notifications</Heading>
        </div>
        {getUnreadCount() > 0 && (
          <button onClick={markAllAsRead} className="text-primary text-[0.8125rem] cursor-pointer hover:underline" style={{ fontWeight: 500 }}>
            Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "unread", "read"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-[0.8125rem] transition cursor-pointer capitalize ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
            style={{ fontWeight: tab === t ? 600 : 400 }}>
            {t}{t === "unread" && getUnreadCount() > 0 ? ` (${getUnreadCount()})` : ""}
          </button>
        ))}
      </div>

      {filtered.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            onClick={() => { if (tab === "all") clearAll(); else if (tab === "unread") clearUnread(); else clearRead(); }}
            className="flex items-center gap-1.5 text-destructive text-[0.75rem] cursor-pointer hover:underline"
            style={{ fontWeight: 500 }}>
            <Trash2 className="w-3.5 h-3.5" />
            Remove all {tab !== "all" ? tab : ""}
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <Text className="text-muted-foreground text-[0.875rem]">No {tab === "all" ? "" : tab + " "}notifications</Text>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const ic = iconMap[n.icon];
            return (
              <div key={n.id} className={`flex items-start gap-3 p-3.5 rounded-xl border transition ${n.read ? "border-border bg-card/50" : "border-primary/20 bg-primary/5"}`}>
                <div className={`w-10 h-10 rounded-full ${ic.bg} flex items-center justify-center shrink-0 text-[1.125rem]`}>{ic.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Text className="text-[0.875rem] leading-snug" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</Text>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                  <Text className="text-muted-foreground text-[0.8125rem] mt-0.5 line-clamp-2">{n.message}</Text>
                  <Text className="text-muted-foreground/70 text-[0.6875rem] mt-1">{n.time}</Text>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="p-1.5 rounded-full hover:bg-secondary transition cursor-pointer" title="Mark as read">
                      <Check className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(n.id)} className="p-1.5 rounded-full hover:bg-secondary transition cursor-pointer" title="Delete">
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}