/* Main Dining Page — orchestrates booking list, detail, modals */
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "../../components/ds/Text";
import { Tabs, TabList, TabTrigger, TabPanel } from "../../components/ds/Tabs";
import { CalendarPlus, CheckCircle, XCircle, MapPin, ChevronRight } from "lucide-react";
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
const springTransition = { type: "spring", stiffness: 300, damping: 28 };

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariant = {
  hidden: { opacity: 0, y: 15, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: springTransition }
};

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
  
  const currentTab = searchParams.get("tab") || "scheduled";
  const setCurrentTab = (tab: string) => {
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

  const scheduled = bookings.filter(b => b.status === "confirmed");
  const visited = bookings.filter(b => b.status === "completed");
  const cancelled = bookings.filter(b => b.status === "cancelled" || b.status === "no-show");

  const openManage = (b: Booking) => { setManageBooking(b); setShowManage(true); };

  const handleModify = () => { setShowManage(false); setModifyBooking(manageBooking); setShowModify(true); };
  const handleCancelIntent = () => { setShowManage(false); setCancelBooking(manageBooking); setShowCancel(true); };
  const handleCancelConfirm = () => {
    if (cancelBooking) setBookings(prev => prev.map(b => b.id === cancelBooking.id ? { ...b, status: "cancelled" as BookingStatus } : b));
    setShowCancel(false); setCancelBooking(null); setSelectedBooking(null);
  };
  const handleSaveModify = (updated: Booking) => { setBookings(prev => prev.map(b => b.id === updated.id ? updated : b)); };

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
        <Tabs defaultValue="scheduled" value={currentTab} onValueChange={setCurrentTab} variant="boxed">
          <TabList className="!flex w-full mb-6 sticky top-2 z-10 bg-background/80 backdrop-blur-md rounded-2xl py-1">
            <TabTrigger value="scheduled" className="flex-1 justify-center" badge={scheduled.length}>Scheduled</TabTrigger>
            <TabTrigger value="visited" className="flex-1 justify-center" badge={visited.length}>Visited</TabTrigger>
            <TabTrigger value="cancel" className="flex-1 justify-center" badge={cancelled.length}>Cancelled</TabTrigger>
          </TabList>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <TabPanel value="scheduled">
                {scheduled.length > 0 ? (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                    {scheduled.map(b => (
                      <motion.div key={b.id} variants={itemVariant}>
                        <BookingCard booking={b} onTap={() => setSelectedBooking(b)} onManage={() => openManage(b)} onScanQR={() => setScanQRBooking(b)} onShowQR={() => setShowQRBooking(b)} onInvite={() => setInviteBooking(b)} onBookAgain={() => handleBookAgain(b)} invitedCount={invitedMap[b.id]?.size ?? 0} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState icon={CalendarPlus} title="No scheduled bookings" description="You have no upcoming reservations. Discover restaurants and make a booking!" />
                )}
              </TabPanel>

              <TabPanel value="visited">
                {visited.length > 0 ? (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                    {visited.map(b => (
                      <motion.div key={b.id} variants={itemVariant}>
                        <BookingCard booking={b} onTap={() => setSelectedBooking(b)} onBookAgain={() => handleBookAgain(b)} onViewReceipt={() => setReceiptBooking(b)} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState icon={CheckCircle} title="No visited places yet" description="Your completed dining experiences will appear here." />
                )}
              </TabPanel>

              <TabPanel value="cancel">
                {cancelled.length > 0 ? (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                    {cancelled.map(b => (
                      <motion.div key={b.id} variants={itemVariant}>
                        <BookingCard booking={b} onTap={() => setSelectedBooking(b)} onBookAgain={() => handleBookAgain(b)} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState icon={XCircle} title="No cancellations" description="You haven't cancelled any bookings. Great dining streak!" />
                )}
              </TabPanel>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>

      {renderModals()}
    </>
  );
}