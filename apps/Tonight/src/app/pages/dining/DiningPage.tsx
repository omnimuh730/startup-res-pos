/* Main Dining Page — orchestrates booking list, detail, modals */
import { useState } from "react";
import type { ComponentType } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { CalendarPlus, CheckCircle, XCircle, MapPin, ChevronRight, Plus, ShieldCheck, TicketCheck } from "lucide-react";
import type { RestaurantData } from "../detail/restaurantDetailData";
import { ScanQRFlow } from "./ScanQRFlow";
import { InviteFriends } from "../shared/InviteFriends";
import { BookTableFlow } from "../booking/BookTableFlow";
import { BookingDetailPage } from "./BookingDetailPage";
import { BookingCard, EmptyState } from "./BookingCard";
import { ManageSheet, CancelConfirmModal, ModifyModal, ShowQRModal } from "./DiningModals";
import { EnjoyMealPage } from "./EnjoyMealPage";
import { OrderReceiptModal } from "./EnjoyExtras";
import { type Booking, type BookingStatus, BOOKINGS, bookingToRestaurant, isCurrentlyDining } from "./diningData";

// Premium Apple/Airbnb style spring animations
const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: springTransition }
};

type DiningTabId = "scheduled" | "visited" | "cancel";

type DiningTabOption = {
  id: DiningTabId;
  label: string;
  shortLabel: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

const DINING_TABS: DiningTabOption[] = [
  { id: "scheduled", label: "Scheduled", shortLabel: "Next", icon: CalendarPlus },
  { id: "visited", label: "Visited", shortLabel: "Past", icon: CheckCircle },
  { id: "cancel", label: "Cancelled", shortLabel: "Off", icon: XCircle },
];

const TAB_COPY: Record<DiningTabId, { title: string; description: string }> = {
  scheduled: {
    title: "Upcoming reservations",
    description: "Everything you need before you arrive: party, seating, QR, and confirmation.",
  },
  visited: {
    title: "Visited places",
    description: "Your completed meals with receipts, ratings, and quick rebooking.",
  },
  cancel: {
    title: "Cancelled bookings",
    description: "Past cancellations and no-shows, kept here for reference.",
  },
};

function isDiningTab(value: string | null): value is DiningTabId {
  return value === "scheduled" || value === "visited" || value === "cancel";
}

function DiningTabBar({
  value,
  counts,
  onChange,
}: {
  value: DiningTabId;
  counts: Record<DiningTabId, number>;
  onChange: (value: DiningTabId) => void;
}) {
  return (
    <div role="tablist" aria-label="Dining booking status" className="sticky top-2 z-10 -mx-1 rounded-[1.5rem] bg-background/90 px-1 py-2 backdrop-blur-md">
      <div className="grid w-full grid-cols-3 gap-2">
        {DINING_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = value === tab.id;
          const visualLabel = tab.id === "cancel" ? "Cancelled" : tab.shortLabel;

          return (
            <motion.button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`${tab.label}: ${counts[tab.id]} booking${counts[tab.id] === 1 ? "" : "s"}`}
              onClick={() => onChange(tab.id)}
              className={`flex h-10 min-w-0 cursor-pointer items-center justify-center gap-1 rounded-full px-1.5 transition active:scale-95 ${
                active
                  ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)]"
                  : "bg-secondary/75 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              style={{ fontWeight: 800 }}
              transition={{ type: "spring", stiffness: 520, damping: 38 }}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.4 : 2} />
              <span className="min-w-0 truncate text-[0.75rem]">{visualLabel}</span>
              <span
                className={`flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[0.625rem] ${
                  active ? "bg-white/20 text-white" : "bg-card text-muted-foreground"
                }`}
              >
                {counts[tab.id]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function DiningListHeader({
  tab,
  onAddByCode,
}: {
  tab: DiningTabId;
  onAddByCode: () => void;
}) {
  const copy = TAB_COPY[tab];

  return (
    <div className="mb-4 px-1">
      <div className="min-w-0">
        <Text className="text-[1.125rem] leading-tight text-foreground" style={{ fontWeight: 800 }}>
          {copy.title}
        </Text>
        <Text className="mt-1 max-w-[28rem] text-[0.8125rem] leading-snug text-muted-foreground">
          {copy.description}
        </Text>
        {tab === "scheduled" && (
          <button
            type="button"
            onClick={onAddByCode}
            className="mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 text-[0.8125rem] text-primary transition hover:bg-primary/12 active:scale-95"
            style={{ fontWeight: 800 }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add by booking code
          </button>
        )}
      </div>
    </div>
  );
}

function AddBookingCodeModal({
  open,
  onClose,
  bookings,
  onAdd,
  onView,
}: {
  open: boolean;
  onClose: () => void;
  bookings: Booking[];
  onAdd: (booking: Booking) => void;
  onView: (booking: Booking) => void;
}) {
  const [code, setCode] = useState("");
  const [candidate, setCandidate] = useState<Booking | null>(null);
  const [addedBooking, setAddedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const reset = () => {
    setCode("");
    setCandidate(null);
    setAddedBooking(null);
    setError("");
    setDone(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const verifyCode = () => {
    const normalized = code.trim().toUpperCase();
    const match = bookings.find((booking) => booking.confirmationNo.toUpperCase() === normalized);

    if (!match) {
      setError("We couldn't find that booking code. Check the letters and numbers.");
      setCandidate(null);
      setAddedBooking(null);
      return;
    }

    if (match.status !== "confirmed") {
      setError("Only active confirmed reservations can be joined by code.");
      setCandidate(null);
      setAddedBooking(null);
      return;
    }

    const existingInvite = bookings.find((booking) => booking.confirmationNo.toUpperCase() === `${match.confirmationNo}-G`.toUpperCase());
    const verifiedBooking = match.confirmationNo.endsWith("-G")
      ? match
      : existingInvite ?? {
          ...match,
          id: `invite-${match.id}-${Date.now()}`,
          confirmationNo: `${match.confirmationNo}-G`,
          specialRequest: `Shared invitation from ${match.confirmationNo}`,
        };

    setError("");
    setCandidate(match);
    setAddedBooking(verifiedBooking);
    if (!existingInvite && !match.confirmationNo.endsWith("-G")) onAdd(verifiedBooking);
    setDone(true);
  };

  const viewAddedBooking = (booking: Booking) => {
    reset();
    onView(booking);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={close}>
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.97 }}
            transition={{ type: "spring", damping: 30, stiffness: 420 }}
            className="w-full max-w-md overflow-hidden rounded-t-[2rem] bg-card shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-border px-5 py-4">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border sm:hidden" />
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {done ? <CheckCircle className="h-5 w-5" /> : <TicketCheck className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <Text className="text-[1.125rem]" style={{ fontWeight: 800 }}>
                    {done ? "Verified reservation" : "Add booking code"}
                  </Text>
                  <Text className="mt-0.5 text-[0.8125rem] leading-snug text-muted-foreground">
                    {done ? "This upcoming card was added to your Dining schedule." : "Use a shared confirmation code to join a reservation."}
                  </Text>
                </div>
              </div>
            </div>

            {done && addedBooking ? (
              <div className="space-y-4 px-4 py-5">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex items-center gap-2 rounded-[1.25rem] border border-primary/20 bg-primary/6 px-3.5 py-3"
                >
                  <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <Text className="text-[0.8125rem] text-primary" style={{ fontWeight: 800 }}>
                      Booking code verified
                    </Text>
                    <Text className="truncate text-[0.75rem] text-muted-foreground">
                      {candidate?.confirmationNo} is now a scheduled invitation.
                    </Text>
                  </div>
                </motion.div>
                <BookingCard
                  booking={addedBooking}
                  onTap={() => viewAddedBooking(addedBooking)}
                  onManage={() => viewAddedBooking(addedBooking)}
                  onScanQR={() => viewAddedBooking(addedBooking)}
                  onShowQR={() => viewAddedBooking(addedBooking)}
                  onInvite={() => viewAddedBooking(addedBooking)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" radius="full" fullWidth className="font-bold" onClick={close}>
                    Done
                  </Button>
                  <Button variant="primary" radius="full" fullWidth className="font-bold" onClick={() => viewAddedBooking(addedBooking)}>
                    View
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 px-5 py-5">
                <div>
                  <label className="text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground" style={{ fontWeight: 800 }}>
                    Booking code
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value);
                        setError("");
                        setCandidate(null);
                        setAddedBooking(null);
                      }}
                      placeholder="CT-2026-0418A"
                      className="h-12 min-w-0 flex-1 rounded-2xl border border-border bg-secondary/50 px-4 text-[0.9375rem] outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/15"
                    />
                    <Button variant="primary" radius="full" className="h-12 px-4 font-bold" onClick={verifyCode}>
                      Verify
                    </Button>
                  </div>
                  {error && (
                    <Text className="mt-2 text-[0.8125rem] text-destructive" style={{ fontWeight: 600 }}>
                      {error}
                    </Text>
                  )}
                </div>

                {candidate && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="rounded-[1.25rem] border border-primary/20 bg-primary/6 p-3.5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <Text className="text-[0.8125rem] text-primary" style={{ fontWeight: 800 }}>
                          Code verified
                        </Text>
                      </div>
                      <Text className="mt-2 text-[1rem]" style={{ fontWeight: 800 }}>
                        {candidate.restaurant}
                      </Text>
                      <Text className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                        {candidate.date} · {candidate.time} · {candidate.seating}
                      </Text>
                    </div>

                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DiningPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState(BOOKINGS);
  
  const urlSegments = params["*"]?.split("/") ?? [];
  const bookingIdFromUrl = urlSegments[0] || null;
  const subSegment = urlSegments[1] || null;
  
  const selectedBooking = bookingIdFromUrl ? bookings.find((b) => b.id === bookingIdFromUrl) ?? null : null;
  const isEnjoyView = subSegment === "enjoy" && selectedBooking;
  const isUpcomingView = subSegment === "upcoming" && selectedBooking;
  
  const setSelectedBooking = (b: Booking | null) => {
    if (b) {
      if (b.status === "confirmed" && isCurrentlyDining(b)) navigate(`/dining/${b.id}/enjoy`);
      else if (b.status === "confirmed") navigate(`/dining/${b.id}/upcoming`);
      else navigate(`/dining/${b.id}`);
    } else navigate("/dining");
  };
  
  const tabParam = searchParams.get("tab");
  const currentTab: DiningTabId = isDiningTab(tabParam) ? tabParam : "scheduled";
  const setCurrentTab = (tab: DiningTabId) => {
    const next = new URLSearchParams(searchParams);
    if (tab === "scheduled") next.delete("tab"); else next.set("tab", tab);
    setSearchParams(next);
  };
  
  const [manageBooking, setManageBooking] = useState<Booking | null>(null);
  const [modifyBooking, setModifyBooking] = useState<Booking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [showManage, setShowManage] = useState(false);
  const [showModify, setShowModify] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [scanQRBooking, setScanQRBooking] = useState<Booking | null>(null);
  const [scanQRInitialStep, setScanQRInitialStep] = useState<"scan" | "bill">("scan");
  const [showQRBooking, setShowQRBooking] = useState<Booking | null>(null);
  const [inviteBooking, setInviteBooking] = useState<Booking | null>(null);
  const [bookAgainRestaurant, setBookAgainRestaurant] = useState<RestaurantData | null>(null);
  const [invitedMap, setInvitedMap] = useState<Record<string, Set<string>>>({});
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [addCodeOpen, setAddCodeOpen] = useState(false);

  const scheduled = bookings.filter(b => b.status === "confirmed");
  const visited = bookings.filter(b => b.status === "completed");
  const cancelled = bookings.filter(b => b.status === "cancelled" || b.status === "no-show");
  const tabCounts: Record<DiningTabId, number> = {
    scheduled: scheduled.length,
    visited: visited.length,
    cancel: cancelled.length,
  };

  const openManage = (b: Booking) => { setManageBooking(b); setShowManage(true); };

  const handleModify = () => { setShowManage(false); setModifyBooking(manageBooking); setShowModify(true); };
  const handleCancelIntent = () => { setShowManage(false); setCancelBooking(manageBooking); setShowCancel(true); };
  const handleCancelConfirm = () => {
    if (cancelBooking) setBookings(prev => prev.map(b => b.id === cancelBooking.id ? { ...b, status: "cancelled" as BookingStatus } : b));
    setShowCancel(false); setCancelBooking(null); setSelectedBooking(null);
  };
  const handleSaveModify = (updated: Booking) => { setBookings(prev => prev.map(b => b.id === updated.id ? updated : b)); };

  const handleAddCodeBooking = (booking: Booking) => {
    setBookings(prev => prev.some((item) => item.id === booking.id || item.confirmationNo === booking.confirmationNo) ? prev : [booking, ...prev]);
    setCurrentTab("scheduled");
  };

  const handleBookAgain = (b: Booking) => {
    const restaurantData = bookingToRestaurant(b);
    setSelectedBooking(null); setInviteBooking(null); setScanQRBooking(null); setShowQRBooking(null);
    setManageBooking(null); setModifyBooking(null); setCancelBooking(null);
    setShowManage(false); setShowModify(false); setShowCancel(false);
    setBookAgainRestaurant(restaurantData);
  };

  // Shared modals renderer
  const renderModals = () => (
    <>
      <ManageSheet open={showManage} onClose={() => setShowManage(false)} onModify={handleModify} onCancel={handleCancelIntent} />
      <ModifyModal open={showModify} onClose={() => setShowModify(false)} booking={modifyBooking} onSave={handleSaveModify} />
      <CancelConfirmModal open={showCancel} onClose={() => setShowCancel(false)} onConfirm={handleCancelConfirm} restaurantName={cancelBooking?.restaurant ?? ""} />
      {scanQRBooking && <ScanQRFlow booking={scanQRBooking} initialStep={scanQRInitialStep} onClose={() => { setScanQRBooking(null); setScanQRInitialStep("scan"); }} />}
      <ShowQRModal booking={showQRBooking} onClose={() => setShowQRBooking(null)} />
      <InviteFriends
        open={!!inviteBooking}
        onClose={() => setInviteBooking(null)}
        restaurantName={inviteBooking?.restaurant ?? ""}
        date={inviteBooking?.date ?? ""}
        time={inviteBooking?.time ?? ""}
        alreadyInvited={inviteBooking ? invitedMap[inviteBooking.id] : undefined}
        onInvited={(ids) => { if (inviteBooking) setInvitedMap(prev => ({ ...prev, [inviteBooking.id]: ids })); }}
      />
      {bookAgainRestaurant && <BookTableFlow restaurant={bookAgainRestaurant} onBack={() => setBookAgainRestaurant(null)} onComplete={() => setBookAgainRestaurant(null)} />}
      <OrderReceiptModal open={!!receiptBooking} onClose={() => setReceiptBooking(null)} booking={receiptBooking} />
      <AddBookingCodeModal
        open={addCodeOpen}
        onClose={() => setAddCodeOpen(false)}
        bookings={bookings}
        onAdd={handleAddCodeBooking}
        onView={(booking) => {
          setAddCodeOpen(false);
          setSelectedBooking(booking);
        }}
      />
    </>
  );

  // ── Enjoy Meal / Upcoming intermediate view ──
  if ((isEnjoyView || isUpcomingView) && selectedBooking) {
    const latestBooking = bookings.find(b => b.id === selectedBooking.id) || selectedBooking;
    return (
      <>
        <EnjoyMealPage
          booking={latestBooking}
          mode={isEnjoyView ? "live" : "upcoming"}
          onBack={() => setSelectedBooking(null)}
          onShowQR={() => setShowQRBooking(latestBooking)}
          onScanQR={() => { setScanQRInitialStep("scan"); setScanQRBooking(latestBooking); }}
          onScanPay={() => { setScanQRInitialStep("bill"); setScanQRBooking(latestBooking); }}
          onInvite={() => setInviteBooking(latestBooking)}
          onOpenRestaurantProfile={() => navigate(`/discover/restaurant/${latestBooking.id}`, { state: { restaurant: bookingToRestaurant(latestBooking) } })}
          onOpenDirections={() => navigate(`/discover/search?q=${encodeURIComponent(latestBooking.restaurant)}`)}
        />
        {renderModals()}
      </>
    );
  }

  // ── Full-page detail view ──
  if (selectedBooking) {
    const latestBooking = bookings.find(b => b.id === selectedBooking.id) || selectedBooking;
    return (
      <>
        <BookingDetailPage
          booking={latestBooking}
          onBack={() => setSelectedBooking(null)}
          onManage={() => openManage(latestBooking)}
          onScanQR={() => setScanQRBooking(latestBooking)}
          onShowQR={() => setShowQRBooking(latestBooking)}
          onInvite={() => setInviteBooking(latestBooking)}
          onBookAgain={() => handleBookAgain(latestBooking)}
          onViewReceipt={() => setReceiptBooking(latestBooking)}
        />
        {renderModals()}
      </>
    );
  }

  // Next booking for the hero card
  const nextBooking = scheduled.length > 0 ? scheduled[0] : null;

  // ── List view ──
  return (
    <>
      <div className="px-5 pt-8 pb-12 min-h-screen bg-background">
        
        {/* Massive Confident Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <Text className="text-[36px] font-extrabold text-foreground tracking-tight leading-none">
            My Dining
          </Text>
        </motion.div>

        {/* Dynamic Asymmetrical Journey Dashboard */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mb-8 space-y-3"
        >
          {/* Hero Insight Card */}
          {nextBooking ? (
            <motion.div 
              variants={itemVariant}
              onClick={() => setSelectedBooking(nextBooking)}
              whileTap={{ scale: 0.97 }}
              className="bg-primary/5 border border-primary/20 rounded-[28px] p-5 flex flex-col relative overflow-hidden shadow-sm active:bg-primary/10 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-8 z-10">
                <div className="bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                  <CalendarPlus className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                  <Text className="text-[12px] font-bold text-primary uppercase tracking-wider">Next Up</Text>
                </div>
                <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="z-10">
                <Text className="text-[22px] font-bold text-foreground leading-tight">{nextBooking.restaurant}</Text>
                <div className="flex items-center gap-2 mt-1.5">
                  <Text className="text-[14px] font-semibold text-foreground">{nextBooking.date}</Text>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <Text className="text-[14px] font-semibold text-foreground">{nextBooking.time}</Text>
                </div>
              </div>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-8 -right-8 opacity-[0.03] pointer-events-none">
                <MapPin className="w-48 h-48" />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariant}
              className="bg-secondary/40 border border-border/50 rounded-[28px] p-5 flex flex-col shadow-sm"
            >
               <div className="flex items-center gap-2 mb-3">
                 <CalendarPlus className="w-4 h-4 text-muted-foreground" />
                 <Text className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">No Upcoming Plans</Text>
               </div>
               <Text className="text-[22px] font-bold text-foreground leading-tight">0 Scheduled</Text>
               <Text className="text-[14px] text-muted-foreground mt-1">Time to discover a new favorite spot.</Text>
            </motion.div>
          )}

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div variants={itemVariant} className="bg-card border border-border/60 rounded-[24px] p-5 shadow-sm">
              <Text className="text-[28px] font-bold text-foreground leading-none">{visited.length}</Text>
              <Text className="text-[13px] text-muted-foreground font-semibold mt-1">Places Visited</Text>
            </motion.div>
            <motion.div variants={itemVariant} className="bg-card border border-border/60 rounded-[24px] p-5 shadow-sm">
              <Text className="text-[28px] font-bold text-foreground leading-none">47</Text>
              <Text className="text-[13px] text-muted-foreground font-semibold mt-1">Total Bookings</Text>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs & Content */}
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
              {currentTab === "scheduled" && (
                scheduled.length > 0 ? (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                    {scheduled.map(b => (
                      <motion.div key={b.id} variants={itemVariant}>
                        <BookingCard booking={b} onTap={() => setSelectedBooking(b)} onManage={() => openManage(b)} onScanQR={() => setScanQRBooking(b)} onShowQR={() => setShowQRBooking(b)} onInvite={() => setInviteBooking(b)} onBookAgain={() => handleBookAgain(b)} invitedCount={invitedMap[b.id]?.size ?? 0} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState icon={CalendarPlus} title="No scheduled bookings" description="You have no upcoming reservations. Discover restaurants and make a booking!" />
                )
              )}

              {currentTab === "visited" && (
                visited.length > 0 ? (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                    {visited.map(b => (
                      <motion.div key={b.id} variants={itemVariant}>
                        <BookingCard booking={b} onTap={() => setSelectedBooking(b)} onBookAgain={() => handleBookAgain(b)} onViewReceipt={() => setReceiptBooking(b)} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState icon={CheckCircle} title="No visited places yet" description="Your completed dining experiences will appear here." />
                )
              )}

              {currentTab === "cancel" && (
                cancelled.length > 0 ? (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                    {cancelled.map(b => (
                      <motion.div key={b.id} variants={itemVariant}>
                        <BookingCard booking={b} onTap={() => setSelectedBooking(b)} onBookAgain={() => handleBookAgain(b)} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState icon={XCircle} title="No cancellations" description="You haven't cancelled any bookings. Great dining streak!" />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {renderModals()}
    </>
  );
}
