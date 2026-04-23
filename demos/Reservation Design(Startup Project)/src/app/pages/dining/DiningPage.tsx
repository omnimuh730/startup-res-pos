/* Main Dining Page — orchestrates booking list, detail, modals */
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Heading } from "../../components/ds/Text";
import { Card } from "../../components/ds/Card";
import { Text } from "../../components/ds/Text";
import { Tabs, TabList, TabTrigger, TabPanel } from "../../components/ds/Tabs";
import { CalendarPlus, CheckCircle, XCircle } from "lucide-react";
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
          onOpenDirections={() => navigate(`/explorer?directions=${latestBooking.id}`)}
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

  // ── List view ──
  return (
    <>
      <div className="space-y-5 pb-4">
        <Heading level={2}>My Dining</Heading>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Scheduled", value: scheduled.length, color: "text-primary" },
            { label: "Visited", value: visited.length, color: "text-success" },
            { label: "Total Visits", value: "47", color: "text-info" },
          ].map(s => (
            <Card key={s.label} variant="filled" padding="sm" radius="lg" className="text-center">
              <Text className={`${s.color} text-[1.375rem]`} style={{ fontWeight: 700 }}>{s.value}</Text>
              <Text className="text-muted-foreground text-[0.8125rem]">{s.label}</Text>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="scheduled" value={currentTab} onValueChange={setCurrentTab} variant="boxed">
          <TabList className="!flex w-full mb-5">
            <TabTrigger value="scheduled" className="flex-1 justify-center" badge={scheduled.length}>Scheduled</TabTrigger>
            <TabTrigger value="visited" className="flex-1 justify-center" badge={visited.length}>Visited</TabTrigger>
            <TabTrigger value="cancel" className="flex-1 justify-center" badge={cancelled.length}>Cancel</TabTrigger>
          </TabList>

          <TabPanel value="scheduled">
            {scheduled.length > 0 ? (
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                {scheduled.map(b => (
                  <BookingCard key={b.id} booking={b} onTap={() => setSelectedBooking(b)} onManage={() => openManage(b)} onScanQR={() => setScanQRBooking(b)} onShowQR={() => setShowQRBooking(b)} onInvite={() => setInviteBooking(b)} onBookAgain={() => handleBookAgain(b)} invitedCount={invitedMap[b.id]?.size ?? 0} />
                ))}
              </div>
            ) : (
              <EmptyState icon={CalendarPlus} title="No scheduled bookings" description="You have no upcoming reservations. Discover restaurants and make a booking!" />
            )}
          </TabPanel>

          <TabPanel value="visited">
            {visited.length > 0 ? (
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                {visited.map(b => <BookingCard key={b.id} booking={b} onTap={() => setSelectedBooking(b)} onBookAgain={() => handleBookAgain(b)} onViewReceipt={() => setReceiptBooking(b)} />)}
              </div>
            ) : (
              <EmptyState icon={CheckCircle} title="No visited places yet" description="Your completed dining experiences will appear here." />
            )}
          </TabPanel>

          <TabPanel value="cancel">
            {cancelled.length > 0 ? (
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                {cancelled.map(b => <BookingCard key={b.id} booking={b} onTap={() => setSelectedBooking(b)} onBookAgain={() => handleBookAgain(b)} />)}
              </div>
            ) : (
              <EmptyState icon={XCircle} title="No cancellations" description="You haven't cancelled any bookings. Great dining streak!" />
            )}
          </TabPanel>
        </Tabs>
      </div>

      {renderModals()}
    </>
  );
}