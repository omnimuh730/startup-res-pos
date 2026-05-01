import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, CalendarPlus, CheckCircle, ChevronRight, Clock3, MapPin, XCircle } from "lucide-react";
import { Text } from "../../../components/ds/Text";
import { BookingCard, EmptyState } from "../BookingCard";
import type { Booking } from "../diningData";
import { DiningTabBar } from "./DiningTabBar";
import { DiningListHeader } from "./DiningListHeader";
import { itemVariant, staggerContainer } from "./diningMotion";
import type { DiningTabId } from "./diningTabs";

export function DiningListView({
  currentTab,
  setCurrentTab,
  tabCounts,
  pending,
  approved,
  rejected,
  visited,
  cancelled,
  nextBooking,
  setSelectedBooking,
  openManage,
  setScanQRBooking,
  setShowQRBooking,
  setInviteBooking,
  handleBookAgain,
  handleDeleteRequest,
  setReceiptBooking,
  checkedInIds,
  invitedMap,
  setAddCodeOpen,
}: {
  currentTab: DiningTabId;
  setCurrentTab: (tab: DiningTabId) => void;
  tabCounts: Record<DiningTabId, number>;
  pending: Booking[];
  approved: Booking[];
  rejected: Booking[];
  visited: Booking[];
  cancelled: Booking[];
  nextBooking: Booking | null;
  setSelectedBooking: (b: Booking | null) => void;
  openManage: (b: Booking) => void;
  setScanQRBooking: (b: Booking | null) => void;
  setShowQRBooking: (b: Booking | null) => void;
  setInviteBooking: (b: Booking | null) => void;
  handleBookAgain: (b: Booking) => void;
  handleDeleteRequest: (b: Booking) => void;
  setReceiptBooking: (b: Booking | null) => void;
  checkedInIds: Set<string>;
  invitedMap: Record<string, Set<string>>;
  setAddCodeOpen: (v: boolean) => void;
}) {
  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="mb-8">
        <Text className="text-[36px] leading-none font-extrabold tracking-tight text-foreground">My Dining</Text>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mb-8 space-y-3">
        {nextBooking ? (
          <motion.div
            variants={itemVariant}
            onClick={() => setSelectedBooking(nextBooking)}
            whileTap={{ scale: 0.97 }}
            className="relative flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-primary/20 bg-primary/5 p-5 shadow-sm transition-colors active:bg-primary/10"
          >
            <div className="z-10 mb-8 flex items-start justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
                <CalendarPlus className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                <Text className="text-[12px] font-bold tracking-wider text-primary uppercase">Next Up</Text>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/50">
                <ChevronRight className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="z-10">
              <Text className="text-[22px] leading-tight font-bold text-foreground">{nextBooking.restaurant}</Text>
              <div className="mt-1.5 flex items-center gap-2">
                <Text className="text-[14px] font-semibold text-foreground">{nextBooking.date}</Text>
                <span className="h-1 w-1 rounded-full bg-primary" />
                <Text className="text-[14px] font-semibold text-foreground">{nextBooking.time}</Text>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-[0.03]">
              <MapPin className="h-48 w-48" />
            </div>
          </motion.div>
        ) : (
          <motion.div variants={itemVariant} className="flex flex-col rounded-[28px] border border-border/50 bg-secondary/40 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <CalendarPlus className="h-4 w-4 text-muted-foreground" />
              <Text className="text-[12px] font-bold tracking-wider text-muted-foreground uppercase">No Upcoming Plans</Text>
            </div>
              <Text className="text-[22px] leading-tight font-bold text-foreground">0 Approved</Text>
              <Text className="mt-1 text-[14px] text-muted-foreground">Time to discover a new favorite spot.</Text>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <motion.div variants={itemVariant} className="rounded-[24px] border border-border/60 bg-card p-5 shadow-sm">
            <Text className="text-[28px] leading-none font-bold text-foreground">{visited.length}</Text>
            <Text className="mt-1 text-[13px] font-semibold text-muted-foreground">Places Visited</Text>
          </motion.div>
          <motion.div variants={itemVariant} className="rounded-[24px] border border-border/60 bg-card p-5 shadow-sm">
            <Text className="text-[28px] leading-none font-bold text-foreground">{pending.length + approved.length + rejected.length + visited.length + cancelled.length}</Text>
            <Text className="mt-1 text-[13px] font-semibold text-muted-foreground">Total Bookings</Text>
          </motion.div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <DiningTabBar value={currentTab} counts={tabCounts} onChange={setCurrentTab} />
        <DiningListHeader tab={currentTab} onAddByCode={() => setAddCodeOpen(true)} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {currentTab === "pending" &&
              (pending.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                  {pending.map((b) => (
                    <motion.div key={b.id} variants={itemVariant}>
                      <BookingCard
                        booking={b}
                        onTap={() => setSelectedBooking(b)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={Clock3}
                  title="No pending requests"
                  description="New reservation requests will stay here until the restaurant approves them."
                />
              ))}

            {currentTab === "approved" &&
              (approved.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                  {approved.map((b) => (
                    <motion.div key={b.id} variants={itemVariant}>
                      <BookingCard
                        booking={b}
                        checkedInIds={checkedInIds}
                        onTap={() => setSelectedBooking(b)}
                        onManage={() => openManage(b)}
                        onScanQR={() => setScanQRBooking(b)}
                        onShowQR={() => setShowQRBooking(b)}
                        onInvite={() => setInviteBooking(b)}
                        onBookAgain={() => handleBookAgain(b)}
                        invitedCount={invitedMap[b.id]?.size ?? 0}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={CalendarCheck}
                  title="No approved reservations"
                  description="Approved requests will appear here with arrival QR and confirmation actions."
                />
              ))}

            {currentTab === "rejected" &&
              (rejected.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                  {rejected.map((b) => (
                    <motion.div key={b.id} variants={itemVariant}>
                      <BookingCard
                        booking={b}
                        onTap={() => setSelectedBooking(b)}
                        onBookAgain={() => handleBookAgain(b)}
                        onDeleteRequest={() => handleDeleteRequest(b)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState icon={XCircle} title="No rejected requests" description="Rejected requests can be requested again or removed from this list." />
              ))}

            {currentTab === "visited" &&
              (visited.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                  {visited.map((b) => (
                    <motion.div key={b.id} variants={itemVariant}>
                      <BookingCard
                        booking={b}
                        onTap={() => setSelectedBooking(b)}
                        onBookAgain={() => handleBookAgain(b)}
                        onViewReceipt={() => setReceiptBooking(b)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState icon={CheckCircle} title="No visited places yet" description="Your completed dining experiences will appear here." />
              ))}

            {currentTab === "cancel" &&
              (cancelled.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                  {cancelled.map((b) => (
                    <motion.div key={b.id} variants={itemVariant}>
                      <BookingCard booking={b} onTap={() => setSelectedBooking(b)} onBookAgain={() => handleBookAgain(b)} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState icon={XCircle} title="No cancellations" description="You haven't cancelled any bookings. Great dining streak!" />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
