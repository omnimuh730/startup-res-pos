import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { sectionVariants } from "./variants";

export function InboxDigest({ unreadCount, readCount }: { unreadCount: number; readCount: number }) {
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
