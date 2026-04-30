/* Dining modals: ManageSheet, CancelConfirmModal, ModifyModal, ShowQRModal */
import { useEffect, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Modal, ModalBody, ModalFooter } from "../../components/ds/Modal";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
  AlertTriangle,
  Armchair,
  Calendar,
  Check,
  Clock,
  Download,
  MessageCircle,
  Pencil,
  QrCode,
  Share2,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { Booking } from "./diningData";

function ActionOption({
  icon: Icon,
  label,
  desc,
  tone,
  onClick,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  desc: string;
  tone: "primary" | "danger";
  onClick: () => void;
}) {
  const toneClass = tone === "primary" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.975 }}
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-[1.25rem] border border-border bg-card p-3.5 text-left shadow-[0_6px_20px_rgba(0,0,0,0.045)] transition hover:border-primary/30"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <Text className="text-[0.9375rem]" style={{ fontWeight: 800 }}>
          {label}
        </Text>
        <Text className="mt-0.5 text-[0.75rem] text-muted-foreground">{desc}</Text>
      </span>
    </motion.button>
  );
}

export function ManageSheet({
  open,
  onClose,
  onModify,
  onCancel,
}: {
  open: boolean;
  onClose: () => void;
  onModify: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" className="rounded-[2rem]">
      <ModalBody className="px-5 pb-5 pt-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <Heading level={4}>Manage booking</Heading>
            <Text className="mt-0.5 text-[0.8125rem] text-muted-foreground">Make a change or release the table.</Text>
          </div>
        </div>
        <div className="space-y-2.5">
          <ActionOption icon={Pencil} label="Modify reservation" desc="Adjust guests, seating, time, or notes." tone="primary" onClick={onModify} />
          <ActionOption icon={Trash2} label="Cancel booking" desc="The restaurant will receive the released seat." tone="danger" onClick={onCancel} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-[0.875rem] text-muted-foreground transition hover:bg-secondary"
          style={{ fontWeight: 800 }}
        >
          Close
        </button>
      </ModalBody>
    </Modal>
  );
}

export function CancelConfirmModal({
  open,
  onClose,
  onConfirm,
  restaurantName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  restaurantName: string;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" className="rounded-[2rem]">
      <ModalBody className="px-5 py-5">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: [1.08, 0.96, 1], opacity: 1 }}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive"
          >
            <AlertTriangle className="h-7 w-7" />
          </motion.div>
          <Heading level={4}>Cancel this booking?</Heading>
          <Text className="mx-auto mt-2 max-w-xs text-[0.875rem] leading-relaxed text-muted-foreground">
            We will release your seat at <span className="text-foreground" style={{ fontWeight: 800 }}>{restaurantName}</span>.
          </Text>
          <div className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-warning">
            <Clock className="h-3.5 w-3.5" />
            <Text className="text-[0.75rem] text-warning" style={{ fontWeight: 800 }}>
              This cannot be undone
            </Text>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="px-5">
        <Button variant="outline" onClick={onClose} radius="full" className="flex-1 font-bold">
          Keep it
        </Button>
        <Button variant="destructive" onClick={onConfirm} radius="full" className="flex-1 font-bold">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function ControlLabel({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  children: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <Text className="text-[0.9375rem]" style={{ fontWeight: 800 }}>
        {children}
      </Text>
    </div>
  );
}

export function ModifyModal({
  open,
  onClose,
  booking,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSave: (b: Booking) => void;
}) {
  const [guests, setGuests] = useState(booking?.guests ?? 2);
  const [time, setTime] = useState(booking?.time ?? "");
  const [seating, setSeating] = useState(booking?.seating ?? "Indoor");
  const [note, setNote] = useState(booking?.specialRequest ?? "");

  useEffect(() => {
    if (!booking || !open) return;
    setGuests(booking.guests);
    setTime(booking.time);
    setSeating(booking.seating);
    setNote(booking.specialRequest ?? "");
  }, [booking, open]);

  if (!booking) return null;

  const timeSlots = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
  const seatingOptions = ["Indoor", "Outdoor", "Terrace", "Bar", "Any"];

  const handleSave = () => {
    onSave({ ...booking, guests, time, seating, specialRequest: note.trim() || undefined });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="md" className="rounded-[2rem]">
      <ModalBody className="px-5 pt-5">
        <div className="relative -mx-5 -mt-5 mb-5 h-36 overflow-hidden rounded-t-[2rem]">
          <ImageWithFallback src={booking.image} alt={booking.restaurant} className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-2.5 py-1 text-[0.6875rem] backdrop-blur" style={{ fontWeight: 800 }}>
              <Pencil className="h-3.5 w-3.5" />
              Edit booking
            </span>
            <Text className="truncate text-[1.125rem] text-white" style={{ fontWeight: 800 }}>
              {booking.restaurant}
            </Text>
            <Text className="truncate text-[0.8125rem] text-white/78">{booking.date} - {booking.time}</Text>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <ControlLabel icon={Users}>Guests</ControlLabel>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <motion.button
                  key={value}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setGuests(value)}
                  className={`h-10 rounded-full text-[0.875rem] transition ${
                    guests === value ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)]" : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  style={{ fontWeight: 800 }}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <ControlLabel icon={Clock}>Time</ControlLabel>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <motion.button
                  key={slot}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTime(slot)}
                  className={`h-10 rounded-full text-[0.8125rem] transition ${
                    time === slot ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.2)]" : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  style={{ fontWeight: 800 }}
                >
                  {slot}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <ControlLabel icon={Armchair}>Seating</ControlLabel>
            <div className="flex flex-wrap gap-2">
              {seatingOptions.map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSeating(option)}
                  className={`rounded-full px-3.5 py-2 text-[0.8125rem] transition ${
                    seating === option ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  style={{ fontWeight: 800 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <ControlLabel icon={MessageCircle}>Note</ControlLabel>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Allergies, occasion, or special request..."
              className="h-24 w-full resize-none rounded-[1.25rem] border border-border bg-secondary/45 px-4 py-3 text-[0.9375rem] outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="px-5">
        <Button variant="outline" onClick={onClose} radius="full" className="flex-1 font-bold">
          Cancel
        </Button>
        <Button variant="primary" radius="full" className="flex-1 font-bold" leftIcon={<Check className="h-4 w-4" />} onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export function ShowQRModal({ booking, onClose }: { booking: Booking | null; onClose: () => void }) {
  const size = 200;
  const cellSize = 8;
  const cells = Math.floor(size / cellSize);
  const code = booking?.confirmationNo ?? "";

  const getCell = (r: number, c: number) => {
    if (!code) return false;
    const hash = (code.charCodeAt(r % code.length) * 31 + c * 17 + r * 13) % 100;
    if ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)) {
      return r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
    return hash < 45;
  };

  return (
    <AnimatePresence>
      {booking && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 70, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="w-full max-w-sm rounded-t-[2rem] bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Text className="text-[1.125rem]" style={{ fontWeight: 800 }}>
                  Arrival QR
                </Text>
                <Text className="mt-0.5 text-[0.8125rem] text-muted-foreground">Show this at the host stand.</Text>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-foreground transition active:scale-95"
                aria-label="Close QR code"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-secondary/50 p-3">
              <div className="rounded-[1.25rem] bg-white p-4 shadow-sm">
                <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full">
                  {Array.from({ length: cells }).map((_, r) =>
                    Array.from({ length: cells }).map((_, c) =>
                      getCell(r, c) ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize - 1} height={cellSize - 1} rx={1} fill="#222222" /> : null
                    )
                  )}
                </svg>
              </div>
            </div>

            <div className="mt-4 rounded-[1.25rem] bg-secondary/65 p-3 text-center">
              <Text className="truncate text-[1rem]" style={{ fontWeight: 800 }}>
                {booking.restaurant}
              </Text>
              <Text className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                {booking.date} - {booking.time} - {booking.guests} guest{booking.guests > 1 ? "s" : ""}
              </Text>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-primary">
                <QrCode className="h-3.5 w-3.5" />
                <Text className="text-[0.8125rem] text-primary" style={{ fontWeight: 800 }}>
                  {booking.confirmationNo}
                </Text>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" radius="full" className="font-bold" leftIcon={<Download className="h-4 w-4" />}>
                Save
              </Button>
              <Button variant="primary" radius="full" className="font-bold" leftIcon={<Share2 className="h-4 w-4" />}>
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
