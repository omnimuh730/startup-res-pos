import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock3, Trash2 } from "lucide-react";
import { deleteNotification, markAsRead, type Notification } from "../../../../stores/notificationStore";
import { getNotificationDeepLink } from "./deepLink";
import { iconMap } from "./iconMeta";
import { listVariants } from "./variants";

export function NotificationCard({ notification }: { notification: Notification }) {
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
      className={`relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_7px_18px_rgba(0,0,0,0.075)] ${notification.read ? "border-[#EBEBEB]" : "border-[#E31C5F]/20"} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31C5F]/35`}
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
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] ${meta.surface} ${meta.tint} ring-4 ${meta.ring}`}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="truncate text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-[#717171]">{meta.label}</span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[0.6875rem] text-[#717171]"><Clock3 className="h-3 w-3" />{notification.time}</span>
              </div>
              <h3 className="truncate text-[0.9375rem] leading-snug text-[#222222]" style={{ fontWeight: notification.read ? 500 : 700 }}>{notification.title}</h3>
            </div>

            <div className="-mr-1 -mt-1 flex shrink-0 items-center gap-0.5">
              {!notification.read && (
                <>
                  <span className="mr-0.5 h-2 w-2 rounded-full bg-[#E31C5F] shadow-[0_0_0_4px_rgba(227,28,95,0.1)]" />
                  <button type="button" onClick={markNotificationRead} disabled={!!action} className={`relative flex h-7 w-7 items-center justify-center overflow-visible rounded-full transition-colors ${action === "mark" ? "bg-[#EAF8F1] text-[#008A5B]" : "text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]"}`} aria-label="Mark all as read" title="Mark all as read">
                    <AnimatePresence>
                      {action === "mark" && (
                        <>
                          <motion.span className="absolute inset-0 rounded-full border border-[#008A5B]/45" initial={{ scale: 0.75, opacity: 0.9 }} animate={{ scale: 2.2, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.48, ease: [0.2, 0, 0, 1] }} />
                          {[0, 1, 2, 3, 4, 5].map((index) => {
                            const angle = (index / 6) * Math.PI * 2;
                            const x = Math.cos(angle) * 17;
                            const y = Math.sin(angle) * 17;
                            return (
                              <motion.span key={index} className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[#008A5B]" style={{ marginLeft: -2, marginTop: -2 }} initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }} animate={{ x, y, scale: [0.4, 1, 0], opacity: [0, 1, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }} />
                            );
                          })}
                        </>
                      )}
                    </AnimatePresence>
                    <motion.span animate={action === "mark" ? { scale: [1, 0.55, 1.42, 1], rotate: [0, -16, 12, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }} className="relative z-10"><Check className="h-3.5 w-3.5" /></motion.span>
                  </button>
                </>
              )}
              <motion.button type="button" onClick={removeNotification} disabled={!!action} whileTap={{ scale: 0.82, rotate: -8 }} className="flex h-7 w-7 items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#FFF1F5] hover:text-[#E31C5F]" aria-label="Delete notification" title="Delete">
                <motion.span animate={action === "delete" ? { scale: [1, 1.16, 0.82], rotate: [0, -10, 8], opacity: [1, 1, 0] } : { scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}><Trash2 className="h-3.5 w-3.5" /></motion.span>
              </motion.button>
            </div>
          </div>

          <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#717171]" title={notification.message} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {notification.message}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
