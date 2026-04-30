import { useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Utensils } from "lucide-react";
import {
  subscribeNotifications,
  getNotificationSnapshot,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  clearAll,
  clearRead,
  clearUnread,
} from "../../../../stores/notificationStore";
import { EmptyNotifications } from "./EmptyNotifications";
import { InboxDigest } from "./InboxDigest";
import { NotificationCard } from "./NotificationCard";
import { pageVariants, sectionVariants } from "./variants";
import { tabs, type NotificationTab } from "./types";

export function NotificationsView({ onBack }: { onBack: () => void }) {
  useSyncExternalStore(subscribeNotifications, getNotificationSnapshot);
  const notifications = getNotifications();
  const unreadCount = getUnreadCount();
  const readCount = notifications.length - unreadCount;
  const [tab, setTab] = useState<NotificationTab>("all");

  const filtered = useMemo(() => {
    if (tab === "unread") return notifications.filter((notification) => !notification.read);
    if (tab === "read") return notifications.filter((notification) => notification.read);
    return notifications;
  }, [notifications, tab]);

  const nextReservation = notifications.find((notification) => notification.icon === "reservation");

  const clearCurrentTab = () => {
    if (tab === "all") clearAll();
    if (tab === "unread") clearUnread();
    if (tab === "read") clearRead();
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="relative min-h-full overflow-x-hidden bg-white pb-4 text-[#222222]">
      <header className="sticky top-0 z-20 border-b border-transparent bg-white/95 px-4 pb-2.5 pt-4 backdrop-blur-xl">
        <motion.div variants={sectionVariants} className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#F7F7F7]" aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1"><h1 className="mt-0.5 truncate text-[1.625rem] font-semibold leading-none tracking-tight text-[#222222]">Notifications</h1></div>
          {unreadCount > 0 && (
            <button type="button" onClick={markAllAsRead} className="shrink-0 rounded-full border border-[#DDDDDD] px-3 py-1.5 text-[0.75rem] font-semibold text-[#222222] transition-colors hover:border-[#222222]">
              Mark read
            </button>
          )}
        </motion.div>
      </header>

      <main className="px-4">
        <motion.section variants={sectionVariants} className="mt-2 rounded-[1.35rem] bg-[#F7F7F7] p-1">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((item) => {
              const count = item.id === "all" ? notifications.length : item.id === "unread" ? unreadCount : readCount;
              const active = tab === item.id;
              return (
                <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`relative rounded-full px-2 py-2.5 text-[0.8125rem] font-semibold transition-colors ${active ? "text-[#222222]" : "text-[#717171] hover:text-[#222222]"}`}>
                  {active && <motion.span layoutId="notification-tab-pill" className="absolute inset-0 rounded-full bg-white shadow-[0_3px_12px_rgba(0,0,0,0.075)]" transition={{ type: "spring", damping: 30, stiffness: 360 }} />}
                  <span className="relative z-10">{item.label}</span>
                  {count > 0 && <span className="relative z-10 ml-1 text-[0.6875rem] text-[#717171]">{count}</span>}
                </button>
              );
            })}
          </div>
        </motion.section>

        <InboxDigest unreadCount={unreadCount} readCount={readCount} />

        {nextReservation && (
          <motion.section variants={sectionVariants} className="mt-3 overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white px-3.5 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-[#FFF1F5] text-[#E31C5F]"><Utensils className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#717171]">Featured update</p>
                <h2 className="mt-1 truncate text-[0.9375rem] font-semibold text-[#222222]">{nextReservation.title}</h2>
                <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-[#717171]">{nextReservation.message}</p>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section variants={sectionVariants} className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[1.25rem] font-semibold tracking-tight text-[#222222]">{tab === "all" ? "Latest" : tab === "unread" ? "Unread" : "Read"}</h2>
            {filtered.length > 0 && (
              <button type="button" onClick={clearCurrentTab} className="text-[0.75rem] font-semibold text-[#717171] underline decoration-[#DDDDDD] underline-offset-4 transition-colors hover:text-[#222222] hover:decoration-[#222222]">
                Clear {tab === "all" ? "all" : tab}
              </button>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyNotifications key={`empty-${tab}`} tab={tab} />
            ) : (
              <motion.div key={`list-${tab}`} layout className="space-y-2.5">
                {filtered.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </motion.div>
  );
}
