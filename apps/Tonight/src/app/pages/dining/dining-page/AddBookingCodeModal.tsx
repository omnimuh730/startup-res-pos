import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ShieldCheck, TicketCheck } from "lucide-react";
import { Text } from "../../../components/ds/Text";
import { Button } from "../../../components/ds/Button";
import { BookingCard } from "../BookingCard";
import type { Booking } from "../diningData";

export function AddBookingCodeModal({
  open,
  onClose,
  bookings,
  checkedInIds,
  onAdd,
  onView,
}: {
  open: boolean;
  onClose: () => void;
  bookings: Booking[];
  checkedInIds: Set<string>;
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
                  checkedInIds={checkedInIds}
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
