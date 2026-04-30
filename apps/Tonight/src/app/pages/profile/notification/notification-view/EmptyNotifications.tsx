import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import type { NotificationTab } from "./types";
import { sectionVariants } from "./variants";

export function EmptyNotifications({ tab }: { tab: NotificationTab }) {
  const copy =
    tab === "all"
      ? "Reservation updates, rewards, and restaurant replies will appear here."
      : tab === "unread"
        ? "You are all caught up. New table updates will show here first."
        : "Read notifications stay here after you open them.";

  return (
    <motion.div variants={sectionVariants} className="flex min-h-[300px] flex-col items-center justify-center px-4 py-10 text-center">
      <div className="relative mb-5 h-32 w-40">
        <motion.div aria-hidden className="absolute left-1/2 top-8 h-20 w-28 -translate-x-1/2 rounded-2xl bg-[#E31C5F]/10 blur-2xl" initial={{ opacity: 0, scale: 0.72 }} animate={{ opacity: [0, 0.62, 0.34], scale: [0.72, 1.12, 0.94] }} transition={{ duration: 0.9, ease: [0.2, 0, 0, 1] }} />
        <motion.div initial={{ x: -60, y: 24, rotate: -42, scale: 0.78, opacity: 0 }} animate={{ x: [-60, -22, -7], y: [24, 10, 16], rotate: [-42, 18, -7], scale: [0.78, 1.03, 0.98], opacity: [0, 0.95, 0.72] }} transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], times: [0, 0.58, 1] }} className="absolute left-6 top-8 h-20 w-28 rounded-2xl border border-[#DDDDDD] bg-[#F7F7F7] shadow-[0_6px_18px_rgba(0,0,0,0.05)]" />
        <motion.div initial={{ x: 60, y: 20, rotate: 42, scale: 0.78, opacity: 0 }} animate={{ x: [60, 22, 7], y: [20, 8, 14], rotate: [42, -18, 7], scale: [0.78, 1.03, 0.98], opacity: [0, 0.98, 0.78] }} transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], times: [0, 0.58, 1], delay: 0.04 }} className="absolute right-6 top-6 h-20 w-28 rounded-2xl border border-[#DDDDDD] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)]" />
        <motion.div initial={{ scale: 0.72, y: 18, rotate: -16, opacity: 0 }} animate={{ scale: [0.72, 1.13, 0.98, 1], y: [18, -5, 1, 0], rotate: [-16, 10, -3, 0], opacity: [0, 1, 1, 1] }} transition={{ duration: 0.86, ease: [0.16, 1, 0.3, 1], times: [0, 0.58, 0.82, 1], delay: 0.12 }} className="absolute left-1/2 top-1 flex h-[5.5rem] w-[5.5rem] -translate-x-1/2 items-center justify-center rounded-[1.35rem] border border-[#DDDDDD] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.1)]">
          <motion.span className="absolute inset-2 rounded-[1rem] border border-[#E31C5F]/15" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: [0.7, 1.18, 1], opacity: [0, 0.72, 0] }} transition={{ duration: 0.82, ease: [0.2, 0, 0, 1], delay: 0.28 }} />
          <motion.span initial={{ rotate: -18, scale: 0.9 }} animate={{ rotate: [-18, 16, -9, 5, 0], scale: [0.9, 1.08, 1] }} transition={{ duration: 0.82, ease: [0.2, 0, 0, 1], delay: 0.18 }} className="relative">
            <Bell className="h-8 w-8 text-[#E31C5F]" />
            <motion.span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#E31C5F]" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [0.4, 1.8, 1], opacity: [0, 1, 0.75] }} transition={{ duration: 0.58, ease: [0.2, 0, 0, 1], delay: 0.54 }} />
          </motion.span>
        </motion.div>
      </div>
      <h2 className="text-[1.125rem] font-semibold leading-tight text-[#222222]">No {tab === "all" ? "" : `${tab} `}notifications</h2>
      <p className="mt-2 max-w-[260px] text-[0.875rem] leading-relaxed text-[#717171]">{copy}</p>
    </motion.div>
  );
}
