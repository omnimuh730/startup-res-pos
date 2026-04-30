import { useEffect, useState, type ComponentType } from "react";
import { motion } from "motion/react";
import { Modal, ModalBody, ModalFooter } from "../../../components/ds/Modal";
import { Text } from "../../../components/ds/Text";
import { Button } from "../../../components/ds/Button";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { Armchair, Check, Clock, MessageCircle, Pencil, Users } from "lucide-react";
import type { Booking } from "../diningData";

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
            <Text className="truncate text-[1.125rem] text-white" style={{ fontWeight: 800 }}>{booking.restaurant}</Text>
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
                  className={`h-10 rounded-full text-[0.875rem] transition ${guests === value ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.22)]" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
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
                  className={`h-10 rounded-full text-[0.8125rem] transition ${time === slot ? "bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.2)]" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
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
                  className={`rounded-full px-3.5 py-2 text-[0.8125rem] transition ${seating === option ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
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
        <Button variant="outline" onClick={onClose} radius="full" className="flex-1 font-bold">Cancel</Button>
        <Button variant="primary" radius="full" className="flex-1 font-bold" leftIcon={<Check className="h-4 w-4" />} onClick={handleSave}>Save</Button>
      </ModalFooter>
    </Modal>
  );
}
