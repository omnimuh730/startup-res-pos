import type { Dispatch, SetStateAction } from "react";
import type { RestaurantData } from "../../detail/restaurantDetailData";
import { ScanQRFlow } from "../ScanQRFlow";
import { InviteFriends } from "../../shared/InviteFriends";
import { BookTableFlow } from "../../booking/BookTableFlow";
import { ManageSheet, CancelConfirmModal, ModifyModal, ShowQRModal } from "../DiningModals";
import { OrderReceiptModal } from "../EnjoyExtras";
import { AddBookingCodeModal } from "./AddBookingCodeModal";
import type { Booking } from "../diningData";

export function DiningModalLayer({
  showManage,
  setShowManage,
  handleModify,
  handleCancelIntent,
  showModify,
  setShowModify,
  modifyBooking,
  handleSaveModify,
  showCancel,
  setShowCancel,
  handleCancelConfirm,
  cancelRestaurantName,
  scanQRBooking,
  scanQRInitialStep,
  onScanQRCheckedIn,
  onScanQRClose,
  showQRBooking,
  setShowQRBooking,
  inviteBooking,
  setInviteBooking,
  invitedMap,
  setInvitedMap,
  bookAgainRestaurant,
  setBookAgainRestaurant,
  receiptBooking,
  setReceiptBooking,
  addCodeOpen,
  setAddCodeOpen,
  bookings,
  checkedInIds,
  handleAddCodeBooking,
  setSelectedBooking,
}: {
  showManage: boolean;
  setShowManage: (v: boolean) => void;
  handleModify: () => void;
  handleCancelIntent: () => void;
  showModify: boolean;
  setShowModify: (v: boolean) => void;
  modifyBooking: Booking | null;
  handleSaveModify: (updated: Booking) => void;
  showCancel: boolean;
  setShowCancel: (v: boolean) => void;
  handleCancelConfirm: () => void;
  cancelRestaurantName: string;
  scanQRBooking: Booking | null;
  scanQRInitialStep: "scan" | "bill";
  onScanQRCheckedIn: () => void;
  onScanQRClose: () => void;
  showQRBooking: Booking | null;
  setShowQRBooking: (b: Booking | null) => void;
  inviteBooking: Booking | null;
  setInviteBooking: (b: Booking | null) => void;
  invitedMap: Record<string, Set<string>>;
  setInvitedMap: Dispatch<SetStateAction<Record<string, Set<string>>>>;
  bookAgainRestaurant: RestaurantData | null;
  setBookAgainRestaurant: (r: RestaurantData | null) => void;
  receiptBooking: Booking | null;
  setReceiptBooking: (b: Booking | null) => void;
  addCodeOpen: boolean;
  setAddCodeOpen: (v: boolean) => void;
  bookings: Booking[];
  checkedInIds: Set<string>;
  handleAddCodeBooking: (booking: Booking) => void;
  setSelectedBooking: (b: Booking | null) => void;
}) {
  return (
    <>
      <ManageSheet open={showManage} onClose={() => setShowManage(false)} onModify={handleModify} onCancel={handleCancelIntent} />
      <ModifyModal open={showModify} onClose={() => setShowModify(false)} booking={modifyBooking} onSave={handleSaveModify} />
      <CancelConfirmModal open={showCancel} onClose={() => setShowCancel(false)} onConfirm={handleCancelConfirm} restaurantName={cancelRestaurantName} />
      {scanQRBooking && (
        <ScanQRFlow
          booking={scanQRBooking}
          initialStep={scanQRInitialStep}
          onCheckedIn={onScanQRCheckedIn}
          onClose={onScanQRClose}
        />
      )}
      <ShowQRModal booking={showQRBooking} onClose={() => setShowQRBooking(null)} />
      <InviteFriends
        open={!!inviteBooking}
        onClose={() => setInviteBooking(null)}
        restaurantName={inviteBooking?.restaurant ?? ""}
        date={inviteBooking?.date ?? ""}
        time={inviteBooking?.time ?? ""}
        alreadyInvited={inviteBooking ? invitedMap[inviteBooking.id] : undefined}
        onInvited={(ids) => {
          if (inviteBooking) setInvitedMap((prev) => ({ ...prev, [inviteBooking.id]: ids }));
        }}
      />
      {bookAgainRestaurant && (
        <BookTableFlow restaurant={bookAgainRestaurant} onBack={() => setBookAgainRestaurant(null)} onComplete={() => setBookAgainRestaurant(null)} />
      )}
      <OrderReceiptModal open={!!receiptBooking} onClose={() => setReceiptBooking(null)} booking={receiptBooking} />
      <AddBookingCodeModal
        open={addCodeOpen}
        onClose={() => setAddCodeOpen(false)}
        bookings={bookings}
        checkedInIds={checkedInIds}
        onAdd={handleAddCodeBooking}
        onView={(booking) => {
          setAddCodeOpen(false);
          setSelectedBooking(booking);
        }}
      />
    </>
  );
}
