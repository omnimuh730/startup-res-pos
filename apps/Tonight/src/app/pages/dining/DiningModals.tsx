/* Dining modals: ManageSheet, CancelConfirmModal, ModifyModal, ShowQRModal */
import { useState } from "react";
import { Modal, ModalBody, ModalFooter } from "../../components/ds/Modal";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Input } from "../../components/ds/Input";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { AlertTriangle, X, Download, Share2, Pencil, Trash2, Sparkles, Users, Clock, Armchair, MessageCircle, Calendar, HeartCrack } from "lucide-react";
import { motion } from "motion/react";
import type { Booking } from "./diningData";

export function ManageSheet({ open, onClose, onModify, onCancel }: {
  open: boolean; onClose: () => void; onModify: () => void; onCancel: () => void;
}) {
  const actions = [
    { id: "modify", icon: Pencil, label: "Modify Booking", desc: "Change time, guests, or seating", color: "var(--primary)", onClick: onModify },
    { id: "cancel", icon: Trash2, label: "Cancel Booking", desc: "Release your reservation", color: "var(--destructive)", onClick: onCancel },
  ];
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalBody>
        <div className="text-center pt-2 pb-3">
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}>
            <Sparkles className="w-6 h-6" style={{ color: "var(--primary)" }} />
          </div>
          <Heading level={4}>Manage Booking</Heading>
          <Text className="text-muted-foreground text-[0.8125rem] mt-1">What would you like to do?</Text>
        </div>
        <div className="space-y-2 py-2">
          {actions.map((a) => (
            <motion.button
              key={a.id}
              whileTap={{ scale: 0.97 }}
              onClick={a.onClick}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-secondary hover:bg-secondary/70 transition text-left"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${a.color} 15%, transparent)` }}>
                <a.icon className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <Text className="text-[0.9375rem]" style={{ fontWeight: 600, color: a.color }}>{a.label}</Text>
                <Text className="text-muted-foreground text-[0.75rem]">{a.desc}</Text>
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={onClose} className="w-full text-center py-3 mt-1 rounded-xl text-muted-foreground hover:bg-secondary/60 transition text-[0.9375rem]">Close</button>
      </ModalBody>
    </Modal>
  );
}

export function CancelConfirmModal({ open, onClose, onConfirm, restaurantName }: {
  open: boolean; onClose: () => void; onConfirm: () => void; restaurantName: string;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalBody>
        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: [0.7, 1.1, 1], rotate: [-10, 8, -4, 0] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 relative"
            style={{ background: "color-mix(in oklab, var(--destructive) 12%, transparent)" }}
          >
            <HeartCrack className="w-8 h-8" style={{ color: "var(--destructive)" }} />
            <motion.div
              animate={{ opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: "var(--destructive)" }}
            />
          </motion.div>
          <Heading level={4}>Cancel this booking?</Heading>
          <Text className="text-muted-foreground text-[0.9375rem] mt-2">We'll release your seat at <span className="text-foreground" style={{ fontWeight: 600 }}>{restaurantName}</span>.</Text>
          <div className="mt-4 mx-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            <Text className="text-[0.75rem] text-warning" style={{ fontWeight: 600 }}>This action cannot be undone</Text>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} radius="full" className="flex-1">Keep it</Button>
        <Button variant="destructive" onClick={onConfirm} radius="full" className="flex-1">Yes, cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

export function ModifyModal({ open, onClose, booking, onSave }: {
  open: boolean; onClose: () => void; booking: Booking | null; onSave: (b: Booking) => void;
}) {
  const [guests, setGuests] = useState(booking?.guests ?? 2);
  const [time, setTime] = useState(booking?.time ?? "");
  const [seating, setSeating] = useState(booking?.seating ?? "Indoor");

  const timeSlots = ["15:00", "15:15", "15:30", "15:45", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
  const seatingOptions = ["Indoor", "Outdoor", "Terrace", "Bar", "Any"];

  if (!booking) return null;

  const sectionLabel = (icon: typeof Users, label: string) => {
    const Icon = icon;
    return (
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
        </div>
        <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{label}</Text>
      </div>
    );
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalBody>
        {/* Hero strip */}
        <div className="relative -mx-6 -mt-6 mb-5 h-32 overflow-hidden rounded-t-2xl">
          <ImageWithFallback src={booking.image} alt={booking.restaurant} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur mb-1.5">
              <Pencil className="w-3 h-3" />
              <span className="text-[0.625rem]" style={{ fontWeight: 700, letterSpacing: "0.06em" }}>EDIT BOOKING</span>
            </div>
            <Text className="text-white text-[1.125rem]" style={{ fontWeight: 700 }}>{booking.restaurant}</Text>
            <Text className="text-white/80 text-[0.8125rem]">{booking.cuisine}</Text>
          </div>
        </div>

        {/* Current info pill */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-secondary/60 mb-5 text-[0.8125rem]">
          <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
          <Text className="text-muted-foreground">Currently:</Text>
          <Text style={{ fontWeight: 600 }}>{booking.guests} · {booking.date.split(",")[1]?.trim() ?? booking.date} · {booking.time}</Text>
        </div>

        <div className="mb-5">
          {sectionLabel(Users, "Guests")}
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <motion.button key={n} whileTap={{ scale: 0.9 }} onClick={() => setGuests(n)}
                className={`w-11 h-11 rounded-2xl text-[0.9375rem] transition ${guests === n ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                style={{ fontWeight: guests === n ? 700 : 500 }}>{n}</motion.button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          {sectionLabel(Clock, "Pick a Time")}
          <div className="flex flex-wrap gap-2">
            {timeSlots.map(t => (
              <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTime(t)}
                className={`px-3.5 py-2 rounded-full text-[0.875rem] transition ${time === t ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                style={{ fontWeight: time === t ? 700 : 500 }}>{t}</motion.button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          {sectionLabel(Armchair, "Seating")}
          <div className="flex flex-wrap gap-2">
            {seatingOptions.map(s => (
              <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setSeating(s)}
                className={`px-3.5 py-2 rounded-full text-[0.875rem] transition ${seating === s ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                style={{ fontWeight: seating === s ? 700 : 500 }}>{s}</motion.button>
            ))}
          </div>
        </div>

        <div>
          {sectionLabel(MessageCircle, "A note for the chef")}
          <Input placeholder="Allergies, occasion, or special request..." defaultValue={booking.specialRequest || ""} fullWidth />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} radius="full">Cancel</Button>
        <Button variant="primary" radius="full" leftIcon={<Sparkles className="w-4 h-4" />} onClick={() => { onSave({ ...booking, guests, time, seating }); onClose(); }}>Save Changes</Button>
      </ModalFooter>
    </Modal>
  );
}

export function ShowQRModal({ booking, onClose }: { booking: Booking | null; onClose: () => void }) {
  if (!booking) return null;

  const code = booking.confirmationNo;
  const size = 200;
  const cellSize = 8;
  const cells = Math.floor(size / cellSize);

  const getCell = (r: number, c: number) => {
    const hash = (code.charCodeAt(r % code.length) * 31 + c * 17 + r * 13) % 100;
    if ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)) {
      if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
          (r === 0 || r === 6 || c === cells - 1 || c === cells - 7) ||
          (r === cells - 1 || r === cells - 7 || c === 0 || c === 6)) {
        return true;
      }
    }
    return hash < 45;
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-3xl w-full max-w-sm p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[1.125rem]" style={{ fontWeight: 700 }}>Your QR Code</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-5">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
            {Array.from({ length: cells }).map((_, r) =>
              Array.from({ length: cells }).map((_, c) =>
                getCell(r, c) ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize - 1} height={cellSize - 1} rx={1} fill="#1a1a1a" /> : null
              )
            )}
          </svg>
        </div>

        <div className="text-center mb-5">
          <p className="text-[1rem]" style={{ fontWeight: 600 }}>{booking.restaurant}</p>
          <p className="text-[0.875rem] text-muted-foreground mt-0.5">{booking.date} · {booking.time}</p>
          <p className="text-[0.875rem] text-muted-foreground">{booking.guests} guest{booking.guests > 1 ? "s" : ""} · {booking.seating}</p>
        </div>

        <div className="p-3 rounded-xl bg-secondary text-center mb-4">
          <p className="text-[0.75rem] text-muted-foreground mb-0.5">Confirmation Code</p>
          <p className="text-[1.125rem] tracking-wider" style={{ fontWeight: 700 }}>{booking.confirmationNo}</p>
        </div>

        <p className="text-[0.8125rem] text-muted-foreground text-center mb-4">Show this QR code to the restaurant staff upon arrival</p>

        <div className="flex gap-3">
          <Button variant="outline" fullWidth radius="full" leftIcon={<Download className="w-4 h-4" />}>Save</Button>
          <Button variant="primary" fullWidth radius="full" leftIcon={<Share2 className="w-4 h-4" />}>Share</Button>
        </div>
      </div>
    </div>
  );
}
