import { useMemo, useState, useSyncExternalStore, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Check,
  Clock3,
  Gift,
  MessageCircle,
  Sparkles,
  Tag,
  Trash2,
  Utensils,
} from "lucide-react";
import {
  subscribeNotifications,
  getNotificationSnapshot,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll,
  clearRead,
  clearUnread,
  type Notification,
} from "../../../stores/notificationStore";
import { BOOKINGS } from "../../dining/diningData";
import { ALL_SEARCH_DATA, searchResultToRestaurantData } from "../../discover/discoverSearchData";

type NotificationTab = "all" | "unread" | "read";

const tabs: { id: NotificationTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
];

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18, ease: [0.2, 0, 0, 1], staggerChildren: 0.035 },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.2, 0, 0, 1] } },
};

const listVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 28, stiffness: 330 },
  },
  opening: {
    opacity: 1,
    y: -1,
    scale: 0.988,
    backgroundColor: "#FAF9F5",
    transition: { type: "spring", damping: 22, stiffness: 420 },
  },
  marking: {
    opacity: 1,
    y: 0,
    scale: 0.992,
    backgroundColor: "#F0FBF6",
    transition: { type: "spring", damping: 20, stiffness: 380 },
  },
  removing: {
    opacity: 0,
    x: 28,
    scale: 0.96,
    transition: { duration: 0.18, ease: [0.2, 0, 0, 1] },
  },
  exit: { opacity: 0, x: -12, scale: 0.985, transition: { duration: 0.16 } },
};

type DeepLinkTarget = {
  to: string;
  state?: unknown;
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getNotificationHaystack(notification: Notification) {
  return normalizeText(`${notification.title} ${notification.message}`);
}

function findRestaurantTarget(notification: Notification) {
  const haystack = getNotificationHaystack(notification);
  const restaurant = ALL_SEARCH_DATA.restaurants.find((item) => haystack.includes(normalizeText(item.name)));

  if (!restaurant) return null;
  return searchResultToRestaurantData(restaurant);
}

function findBookingTarget(notification: Notification) {
  const haystack = getNotificationHaystack(notification);
  return BOOKINGS.find((booking) => haystack.includes(normalizeText(booking.restaurant))) ?? null;
}

function getNotificationDeepLink(notification: Notification): DeepLinkTarget {
  const haystack = getNotificationHaystack(notification);

  if (notification.icon === "reservation") {
    const booking = findBookingTarget(notification);
    if (booking) {
      return {
        to: booking.status === "confirmed" ? `/dining/${booking.id}/upcoming` : `/dining/${booking.id}`,
      };
    }
    return { to: "/dining" };
  }

  if (notification.icon === "review") {
    const restaurant = findRestaurantTarget(notification);
    if (restaurant) {
      return { to: `/discover/restaurant/${restaurant.id}`, state: { restaurant } };
    }
    return { to: "/discover/search?q=review" };
  }

  if (notification.icon === "promo") {
    if (haystack.includes("weekend") || haystack.includes("top rated")) {
      return { to: "/discover/section/monthly-best" };
    }
    if (haystack.includes("bella napoli")) {
      return { to: "/discover/search?q=Bella%20Napoli" };
    }
    return { to: "/discover/search?q=deals" };
  }

  if (notification.icon === "reward") {
    if (haystack.includes("tier") || haystack.includes("platinum")) {
      return { to: "/profile/edit" };
    }
    return { to: "/profile/history" };
  }

  if (notification.icon === "system") {
    return { to: "/profile/settings" };
  }

  return { to: "/discover" };
}

const iconMap: Record<
  Notification["icon"],
  {
    Icon: typeof Utensils;
    ring: string;
    surface: string;
    tint: string;
    label: string;
  }
> = {
  reservation: {
    Icon: Utensils,
    ring: "ring-[#E31C5F]/15",
    surface: "bg-[#FFF1F5]",
    tint: "text-[#E31C5F]",
    label: "Reservation",
  },
  promo: {
    Icon: Tag,
    ring: "ring-[#FFB400]/15",
    surface: "bg-[#FFF7DF]",
    tint: "text-[#A16207]",
    label: "Offer",
  },
  reward: {
    Icon: Gift,
    ring: "ring-[#008A5B]/15",
    surface: "bg-[#EAF8F1]",
    tint: "text-[#008A5B]",
    label: "Reward",
  },
  system: {
    Icon: Sparkles,
    ring: "ring-black/10",
    surface: "bg-[#F7F7F7]",
    tint: "text-[#222222]",
    label: "Update",
  },
  review: {
    Icon: MessageCircle,
    ring: "ring-[#5B5FC7]/15",
    surface: "bg-[#F1F2FF]",
    tint: "text-[#4B4FB8]",
    label: "Review",
  },
};

function InboxDigest({ unreadCount, readCount }: { unreadCount: number; readCount: number }) {
  return (
    <motion.section
      variants={sectionVariants}
      className="mt-3 flex items-center gap-3 rounded-2xl border border-[#EBEBEB] bg-[#FAF9F5] px-3.5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#E31C5F] shadow-[0_5px_16px_rgba(0,0,0,0.08)]">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E31C5F] px-1 text-[0.625rem] font-bold text-white ring-2 ring-[#FAF9F5]">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9375rem] font-semibold leading-tight text-[#222222]">
          {unreadCount > 0 ? `${unreadCount} new updates waiting` : "All caught up"}
        </p>
        <p className="mt-0.5 truncate text-[0.75rem] text-[#717171]">Reservations, rewards, and replies</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-l border-[#DDDDDD] pl-3">
        <div className="text-center">
          <p className="text-[1rem] font-semibold leading-none text-[#222222]">{readCount}</p>
          <p className="mt-1 text-[0.625rem] font-medium text-[#717171]">Read</p>
        </div>
      </div>
    </motion.section>
  );
}

function EmptyNotifications({ tab }: { tab: NotificationTab }) {
  const copy =
    tab === "all"
      ? "Reservation updates, rewards, and restaurant replies will appear here."
      : tab === "unread"
        ? "You are all caught up. New table updates will show here first."
        : "Read notifications stay here after you open them.";

  return (
    <motion.div
      variants={sectionVariants}
      className="flex min-h-[300px] flex-col items-center justify-center px-4 py-10 text-center"
    >
      <div className="relative mb-5 h-32 w-40">
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-8 h-20 w-28 -translate-x-1/2 rounded-2xl bg-[#E31C5F]/10 blur-2xl"
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: [0, 0.62, 0.34], scale: [0.72, 1.12, 0.94] }}
          transition={{ duration: 0.9, ease: [0.2, 0, 0, 1] }}
        />
        <motion.div
          initial={{ x: -60, y: 24, rotate: -42, scale: 0.78, opacity: 0 }}
          animate={{
            x: [-60, -22, -7],
            y: [24, 10, 16],
            rotate: [-42, 18, -7],
            scale: [0.78, 1.03, 0.98],
            opacity: [0, 0.95, 0.72],
          }}
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], times: [0, 0.58, 1] }}
          className="absolute left-6 top-8 h-20 w-28 rounded-2xl border border-[#DDDDDD] bg-[#F7F7F7] shadow-[0_6px_18px_rgba(0,0,0,0.05)]"
        />
        <motion.div
          initial={{ x: 60, y: 20, rotate: 42, scale: 0.78, opacity: 0 }}
          animate={{
            x: [60, 22, 7],
            y: [20, 8, 14],
            rotate: [42, -18, 7],
            scale: [0.78, 1.03, 0.98],
            opacity: [0, 0.98, 0.78],
          }}
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], times: [0, 0.58, 1], delay: 0.04 }}
          className="absolute right-6 top-6 h-20 w-28 rounded-2xl border border-[#DDDDDD] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
        />
        <motion.div
          initial={{ scale: 0.72, y: 18, rotate: -16, opacity: 0 }}
          animate={{
            scale: [0.72, 1.13, 0.98, 1],
            y: [18, -5, 1, 0],
            rotate: [-16, 10, -3, 0],
            opacity: [0, 1, 1, 1],
          }}
          transition={{
            duration: 0.86,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.58, 0.82, 1],
            delay: 0.12,
          }}
          className="absolute left-1/2 top-1 flex h-[5.5rem] w-[5.5rem] -translate-x-1/2 items-center justify-center rounded-[1.35rem] border border-[#DDDDDD] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.1)]"
        >
          <motion.span
            className="absolute inset-2 rounded-[1rem] border border-[#E31C5F]/15"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.18, 1], opacity: [0, 0.72, 0] }}
            transition={{ duration: 0.82, ease: [0.2, 0, 0, 1], delay: 0.28 }}
          />
          <motion.span
            initial={{ rotate: -18, scale: 0.9 }}
            animate={{ rotate: [-18, 16, -9, 5, 0], scale: [0.9, 1.08, 1] }}
            transition={{ duration: 0.82, ease: [0.2, 0, 0, 1], delay: 0.18 }}
            className="relative"
          >
            <Bell className="h-8 w-8 text-[#E31C5F]" />
            <motion.span
              className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#E31C5F]"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.8, 1], opacity: [0, 1, 0.75] }}
              transition={{ duration: 0.58, ease: [0.2, 0, 0, 1], delay: 0.54 }}
            />
          </motion.span>
        </motion.div>
      </div>
      <h2 className="text-[1.125rem] font-semibold leading-tight text-[#222222]">
        No {tab === "all" ? "" : `${tab} `}notifications
      </h2>
      <p className="mt-2 max-w-[260px] text-[0.875rem] leading-relaxed text-[#717171]">{copy}</p>
    </motion.div>
  );
}

function NotificationCard({ notification }: { notification: Notification }) {
  const navigate = useNavigate();
  const meta = iconMap[notification.icon];
  const Icon = meta.Icon;
  const [action, setAction] = useState<"open" | "mark" | "delete" | null>(null);

  const openNotification = () => {
    if (action) return;
    const target = getNotificationDeepLink(notification);
    setAction("open");
    window.setTimeout(() => {
      if (!notification.read) markAsRead(notification.id);
      if (target.state) navigate(target.to, { state: target.state });
      else navigate(target.to);
    }, 155);
  };

  const markNotificationRead = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (action) return;
    setAction("mark");
    window.setTimeout(() => {
      markAsRead(notification.id);
      setAction(null);
    }, 520);
  };

  const removeNotification = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (action) return;
    setAction("delete");
    window.setTimeout(() => deleteNotification(notification.id), 165);
  };

  return (
    <motion.article
      layout
      variants={listVariants}
      initial="hidden"
      animate={action === "delete" ? "removing" : action === "open" ? "opening" : action === "mark" ? "marking" : "visible"}
      exit="exit"
      whileHover={action ? undefined : { y: -1, transition: { duration: 0.16 } }}
      whileTap={{ scale: 0.993 }}
      onClick={openNotification}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openNotification();
        }
      }}
      role="button"
      tabIndex={0}
      className={`relative overflow-hidden rounded-2xl border bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_7px_18px_rgba(0,0,0,0.075)] ${
        notification.read ? "border-[#EBEBEB]" : "border-[#E31C5F]/20"
      } cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31C5F]/35`}
    >
      <AnimatePresence>
        {(action === "open" || action === "mark") && (
          <motion.div
            className={`pointer-events-none absolute inset-0 ${action === "mark" ? "bg-[#008A5B]/[0.055]" : "bg-[#E31C5F]/[0.045]"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.2, 0, 0, 1] }}
          />
        )}
      </AnimatePresence>
      {!notification.read && <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#E31C5F]" />}

      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] ${meta.surface} ${meta.tint} ring-4 ${meta.ring}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="truncate text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-[#717171]">
                  {meta.label}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[0.6875rem] text-[#717171]">
                  <Clock3 className="h-3 w-3" />
                  {notification.time}
                </span>
              </div>
              <h3
                className="truncate text-[0.9375rem] leading-snug text-[#222222]"
                style={{ fontWeight: notification.read ? 500 : 700 }}
              >
                {notification.title}
              </h3>
            </div>

            <div className="-mr-1 -mt-1 flex shrink-0 items-center gap-0.5">
              {!notification.read && (
                <>
                  <span className="mr-0.5 h-2 w-2 rounded-full bg-[#E31C5F] shadow-[0_0_0_4px_rgba(227,28,95,0.1)]" />
                  <button
                    type="button"
                    onClick={markNotificationRead}
                    disabled={!!action}
                    className={`relative flex h-7 w-7 items-center justify-center overflow-visible rounded-full transition-colors ${
                      action === "mark"
                        ? "bg-[#EAF8F1] text-[#008A5B]"
                        : "text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]"
                    }`}
                    aria-label="Mark all as read"
                    title="Mark all as read"
                  >
                    <AnimatePresence>
                      {action === "mark" && (
                        <>
                          <motion.span
                            className="absolute inset-0 rounded-full border border-[#008A5B]/45"
                            initial={{ scale: 0.75, opacity: 0.9 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.48, ease: [0.2, 0, 0, 1] }}
                          />
                          {[0, 1, 2, 3, 4, 5].map((index) => {
                            const angle = (index / 6) * Math.PI * 2;
                            const x = Math.cos(angle) * 17;
                            const y = Math.sin(angle) * 17;
                            return (
                              <motion.span
                                key={index}
                                className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[#008A5B]"
                                style={{ marginLeft: -2, marginTop: -2 }}
                                initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }}
                                animate={{ x, y, scale: [0.4, 1, 0], opacity: [0, 1, 0] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                              />
                            );
                          })}
                        </>
                      )}
                    </AnimatePresence>
                    <motion.span
                      animate={
                        action === "mark"
                          ? {
                              scale: [1, 0.55, 1.42, 1],
                              rotate: [0, -16, 12, 0],
                            }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                      className="relative z-10"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </motion.span>
                  </button>
                </>
              )}
              <motion.button
                type="button"
                onClick={removeNotification}
                disabled={!!action}
                whileTap={{ scale: 0.82, rotate: -8 }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#FFF1F5] hover:text-[#E31C5F]"
                aria-label="Delete notification"
                title="Delete"
              >
                <motion.span
                  animate={action === "delete" ? { scale: [1, 1.16, 0.82], rotate: [0, -10, 8], opacity: [1, 1, 0] } : { scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </motion.span>
              </motion.button>
            </div>
          </div>

          <p
            className="mt-1 text-[0.8125rem] leading-relaxed text-[#717171]"
            title={notification.message}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {notification.message}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-[calc(100vh-120px)] overflow-x-hidden bg-white pb-24 text-[#222222]"
    >
      <header className="sticky top-0 z-20 border-b border-transparent bg-white/95 px-4 pb-2.5 pt-4 backdrop-blur-xl">
        <motion.div variants={sectionVariants} className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#F7F7F7]"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="mt-0.5 truncate text-[1.625rem] font-semibold leading-none tracking-tight text-[#222222]">
              Notifications
            </h1>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="shrink-0 rounded-full border border-[#DDDDDD] px-3 py-1.5 text-[0.75rem] font-semibold text-[#222222] transition-colors hover:border-[#222222]"
            >
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
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`relative rounded-full px-2 py-2.5 text-[0.8125rem] font-semibold transition-colors ${
                    active ? "text-[#222222]" : "text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="notification-tab-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_3px_12px_rgba(0,0,0,0.075)]"
                      transition={{ type: "spring", damping: 30, stiffness: 360 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {count > 0 && <span className="relative z-10 ml-1 text-[0.6875rem] text-[#717171]">{count}</span>}
                </button>
              );
            })}
          </div>
        </motion.section>

        <InboxDigest unreadCount={unreadCount} readCount={readCount} />

        {nextReservation && (
          <motion.section
            variants={sectionVariants}
            className="mt-3 overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white px-3.5 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-[#FFF1F5] text-[#E31C5F]">
                <Utensils className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#717171]">
                  Featured update
                </p>
                <h2 className="mt-1 truncate text-[0.9375rem] font-semibold text-[#222222]">{nextReservation.title}</h2>
                <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-[#717171]">
                  {nextReservation.message}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section variants={sectionVariants} className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[1.25rem] font-semibold tracking-tight text-[#222222]">
              {tab === "all" ? "Latest" : tab === "unread" ? "Unread" : "Read"}
            </h2>
            {filtered.length > 0 && (
              <button
                type="button"
                onClick={clearCurrentTab}
                className="text-[0.75rem] font-semibold text-[#717171] underline decoration-[#DDDDDD] underline-offset-4 transition-colors hover:text-[#222222] hover:decoration-[#222222]"
              >
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
