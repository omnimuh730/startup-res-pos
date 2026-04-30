/* Main Dining Page — orchestrates booking list, detail, modals */
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import type { RestaurantData } from "../detail/restaurantDetailData";
import { BookingDetailPage } from "./BookingDetailPage";
import { EnjoyMealPage } from "./EnjoyMealPage";
import {
  type Booking,
  type BookingStatus,
  BOOKINGS,
  bookingToRestaurant,
  isCurrentlyDining,
  persistCheckedInBookingId,
  readCheckedInBookingIds,
  removeCheckedInBookingId,
} from "./diningData";
import { DiningModalLayer } from "./dining-page/DiningModalLayer";
import { DiningListView } from "./dining-page/DiningListView";
import { isDiningTab, type DiningTabId } from "./dining-page/diningTabs";

export function DiningPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState(BOOKINGS);
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(readCheckedInBookingIds);

  const urlSegments = params["*"]?.split("/") ?? [];
  const bookingIdFromUrl = urlSegments[0] || null;
  const subSegment = urlSegments[1] || null;

  const selectedBooking = bookingIdFromUrl ? (bookings.find((b) => b.id === bookingIdFromUrl) ?? null) : null;
  const isEnjoyView = subSegment === "enjoy" && selectedBooking;
  const isUpcomingView = subSegment === "upcoming" && selectedBooking;

  const setSelectedBooking = (b: Booking | null) => {
    if (b) {
      if (b.status === "confirmed" && isCurrentlyDining(b, new Date(), checkedInIds)) navigate(`/dining/${b.id}/enjoy`);
      else if (b.status === "confirmed") navigate(`/dining/${b.id}/upcoming`);
      else navigate(`/dining/${b.id}`);
    } else navigate("/dining");
  };

  const tabParam = searchParams.get("tab");
  const currentTab: DiningTabId = isDiningTab(tabParam) ? tabParam : "scheduled";
  const setCurrentTab = (tab: DiningTabId) => {
    const next = new URLSearchParams(searchParams);
    if (tab === "scheduled") next.delete("tab");
    else next.set("tab", tab);
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

  const scheduled = bookings.filter((b) => b.status === "confirmed");
  const visited = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled" || b.status === "no-show");
  const tabCounts: Record<DiningTabId, number> = {
    scheduled: scheduled.length,
    visited: visited.length,
    cancel: cancelled.length,
  };

  const openManage = (b: Booking) => {
    setManageBooking(b);
    setShowManage(true);
  };

  const handleModify = () => {
    setShowManage(false);
    setModifyBooking(manageBooking);
    setShowModify(true);
  };
  const handleCancelIntent = () => {
    setShowManage(false);
    setCancelBooking(manageBooking);
    setShowCancel(true);
  };
  const handleCancelConfirm = () => {
    if (cancelBooking) {
      removeCheckedInBookingId(cancelBooking.id);
      setCheckedInIds((prev) => {
        const next = new Set(prev);
        next.delete(cancelBooking!.id);
        return next;
      });
      setBookings((prev) => prev.map((b) => (b.id === cancelBooking.id ? { ...b, status: "cancelled" as BookingStatus } : b)));
    }
    setShowCancel(false);
    setCancelBooking(null);
    setSelectedBooking(null);
  };
  const handleSaveModify = (updated: Booking) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleAddCodeBooking = (booking: Booking) => {
    setBookings((prev) =>
      prev.some((item) => item.id === booking.id || item.confirmationNo === booking.confirmationNo) ? prev : [booking, ...prev],
    );
    setCurrentTab("scheduled");
  };

  const handleBookAgain = (b: Booking) => {
    const restaurantData = bookingToRestaurant(b);
    setSelectedBooking(null);
    setInviteBooking(null);
    setScanQRBooking(null);
    setShowQRBooking(null);
    setManageBooking(null);
    setModifyBooking(null);
    setCancelBooking(null);
    setShowManage(false);
    setShowModify(false);
    setShowCancel(false);
    setBookAgainRestaurant(restaurantData);
  };

  const modals = (
    <DiningModalLayer
      showManage={showManage}
      setShowManage={setShowManage}
      handleModify={handleModify}
      handleCancelIntent={handleCancelIntent}
      showModify={showModify}
      setShowModify={setShowModify}
      modifyBooking={modifyBooking}
      handleSaveModify={handleSaveModify}
      showCancel={showCancel}
      setShowCancel={setShowCancel}
      handleCancelConfirm={handleCancelConfirm}
      cancelRestaurantName={cancelBooking?.restaurant ?? ""}
      scanQRBooking={scanQRBooking}
      scanQRInitialStep={scanQRInitialStep}
      onScanQRCheckedIn={() => {
        const id = scanQRBooking!.id;
        persistCheckedInBookingId(id);
        setCheckedInIds((prev) => new Set(prev).add(id));
      }}
      onScanQRClose={() => {
        setScanQRBooking(null);
        setScanQRInitialStep("scan");
      }}
      showQRBooking={showQRBooking}
      setShowQRBooking={setShowQRBooking}
      inviteBooking={inviteBooking}
      setInviteBooking={setInviteBooking}
      invitedMap={invitedMap}
      setInvitedMap={setInvitedMap}
      bookAgainRestaurant={bookAgainRestaurant}
      setBookAgainRestaurant={setBookAgainRestaurant}
      receiptBooking={receiptBooking}
      setReceiptBooking={setReceiptBooking}
      addCodeOpen={addCodeOpen}
      setAddCodeOpen={setAddCodeOpen}
      bookings={bookings}
      checkedInIds={checkedInIds}
      handleAddCodeBooking={handleAddCodeBooking}
      setSelectedBooking={setSelectedBooking}
    />
  );

  if ((isEnjoyView || isUpcomingView) && selectedBooking) {
    const latestBooking = bookings.find((b) => b.id === selectedBooking.id) || selectedBooking;
    return (
      <>
        <EnjoyMealPage
          booking={latestBooking}
          mode={isEnjoyView && isCurrentlyDining(latestBooking, new Date(), checkedInIds) ? "live" : "upcoming"}
          onBack={() => setSelectedBooking(null)}
          onShowQR={() => setShowQRBooking(latestBooking)}
          onScanQR={() => {
            setScanQRInitialStep("scan");
            setScanQRBooking(latestBooking);
          }}
          onScanPay={() => {
            setScanQRInitialStep("bill");
            setScanQRBooking(latestBooking);
          }}
          onInvite={() => setInviteBooking(latestBooking)}
          onOpenRestaurantProfile={() =>
            navigate(`/discover/restaurant/${latestBooking.id}`, { state: { restaurant: bookingToRestaurant(latestBooking) } })
          }
          onOpenDirections={() => navigate(`/discover/search?q=${encodeURIComponent(latestBooking.restaurant)}`)}
        />
        {modals}
      </>
    );
  }

  if (selectedBooking) {
    const latestBooking = bookings.find((b) => b.id === selectedBooking.id) || selectedBooking;
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
        {modals}
      </>
    );
  }

  const nextBooking = scheduled.length > 0 ? scheduled[0] : null;

  return (
    <>
      <DiningListView
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        tabCounts={tabCounts}
        scheduled={scheduled}
        visited={visited}
        cancelled={cancelled}
        nextBooking={nextBooking}
        setSelectedBooking={setSelectedBooking}
        openManage={openManage}
        setScanQRBooking={setScanQRBooking}
        setShowQRBooking={setShowQRBooking}
        setInviteBooking={setInviteBooking}
        handleBookAgain={handleBookAgain}
        setReceiptBooking={setReceiptBooking}
        checkedInIds={checkedInIds}
        invitedMap={invitedMap}
        setAddCodeOpen={setAddCodeOpen}
      />
      {modals}
    </>
  );
}
