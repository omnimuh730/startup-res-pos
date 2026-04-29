/* MenuModal + OrderReceiptModal — supporting modals for EnjoyMealPage and visited bookings */
import { motion } from "motion/react";
import {
  Modal,
  ModalBody,
  ModalFooter,
} from "../../components/ds/Modal";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
  BookOpen,
  Receipt as ReceiptIcon,
  Sparkles,
  Download,
  Share2,
  X,
  CreditCard,
  Star,
} from "lucide-react";
import type { Booking } from "./diningData";
import { getMenuFor } from "./diningData";

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

export function MenuModal({
  open,
  onClose,
  booking,
  variant = "order",
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  variant?: "order" | "preview";
}) {
  if (!booking) return null;
  const menu = getMenuFor(booking);
  const isPreview = variant === "preview";

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalBody>
        <div className="relative -mx-6 -mt-6 mb-4 h-28 overflow-hidden rounded-t-2xl">
          <ImageWithFallback
            src={booking.image}
            alt={booking.restaurant}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(0,0,0,0.8))",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur mb-1">
              <BookOpen className="w-3 h-3" />
              <span
                className="text-[0.625rem]"
                style={{
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {isPreview ? "MENU PREVIEW" : "MENU"}
              </span>
            </div>
            <Text
              className="text-white text-[1.0625rem]"
              style={{ fontWeight: 700 }}
            >
              {booking.restaurant}
            </Text>
          </div>
        </div>

        <Text className="text-muted-foreground text-[0.75rem] text-center mb-2">
          View only · your server will take your order
        </Text>
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {menu.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60"
            >
              <div
                className="w-12 h-12 rounded-xl bg-card flex items-center justify-center shrink-0"
                style={{ fontSize: "1.5rem" }}
              >
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Text
                    className="text-[0.9375rem]"
                    style={{ fontWeight: 600 }}
                  >
                    {item.name}
                  </Text>
                  {item.popular && (
                    <Sparkles
                      className="w-3 h-3"
                      style={{ color: "var(--warning)" }}
                    />
                  )}
                </div>
                <Text className="text-muted-foreground text-[0.75rem]">
                  {item.description}
                </Text>
              </div>
              <Text
                className="text-[0.9375rem] shrink-0"
                style={{
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                {fmt(item.price)}
              </Text>
            </div>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          radius="full"
          fullWidth
          onClick={onClose}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export function OrderReceiptModal({
  open,
  onClose,
  booking,
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
}) {
  if (!booking) return null;
  const r = booking.receipt;

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalBody>
        <div className="text-center pt-1 pb-3">
          <motion.div
            initial={{ scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-2"
            style={{
              background:
                "color-mix(in oklab, var(--success) 14%, transparent)",
            }}
          >
            <ReceiptIcon
              className="w-7 h-7"
              style={{ color: "var(--success)" }}
            />
          </motion.div>
          <Heading level={4}>Order Receipt</Heading>
          <Text className="text-muted-foreground text-[0.8125rem] mt-1">
            {booking.restaurant}
          </Text>
        </div>

        {!r ? (
          <div className="text-center py-8">
            <Text className="text-muted-foreground text-[0.875rem]">
              No receipt available for this visit.
            </Text>
          </div>
        ) : (
          <>
            {/* Punched paper aesthetic */}
            <div className="relative rounded-2xl bg-card border border-border p-5">
              <div className="absolute -top-1.5 left-0 right-0 h-3 flex justify-around overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-3 rounded-full bg-background"
                  />
                ))}
              </div>
              <div className="absolute -bottom-1.5 left-0 right-0 h-3 flex justify-around overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-3 rounded-full bg-background"
                  />
                ))}
              </div>

              <div className="text-center mb-3 pb-3 border-b border-dashed border-border">
                <Text
                  className="text-[0.9375rem]"
                  style={{ fontWeight: 700 }}
                >
                  {booking.restaurant}
                </Text>
                <Text className="text-muted-foreground text-[0.6875rem]">
                  {booking.address}
                </Text>
                <Text className="text-muted-foreground text-[0.6875rem] mt-1">
                  {r.paidAt}
                </Text>
                <Text className="text-muted-foreground text-[0.6875rem]">
                  Confirmation: {booking.confirmationNo}
                </Text>
              </div>

              <div className="space-y-2 mb-3">
                {r.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[0.875rem]"
                  >
                    <span className="text-[1rem]">
                      {item.emoji}
                    </span>
                    <Text className="flex-1 min-w-0">
                      {item.name}
                    </Text>
                    <Text className="text-muted-foreground text-[0.75rem]">
                      ×{item.qty}
                    </Text>
                    <Text style={{ fontWeight: 600 }}>
                      {fmt(item.price * item.qty)}
                    </Text>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-3 border-t border-dashed border-border text-[0.875rem]">
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">
                    Subtotal
                  </Text>
                  <Text>{fmt(r.subtotal)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">
                    Tax
                  </Text>
                  <Text>{fmt(r.tax)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">
                    Tip
                  </Text>
                  <Text>{fmt(r.tip)}</Text>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-border">
                  <Text
                    className="text-[1rem]"
                    style={{ fontWeight: 700 }}
                  >
                    Total
                  </Text>
                  <Text
                    className="text-[1rem]"
                    style={{
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}
                  >
                    {fmt(r.total)}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 p-2.5 rounded-xl bg-secondary/60 text-[0.8125rem]">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <Text className="text-muted-foreground">
                  Paid with
                </Text>
                <Text style={{ fontWeight: 600 }}>
                  {r.paymentMethod}
                </Text>
              </div>

              {booking.rating != null && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <Text
                    className="text-[0.8125rem]"
                    style={{ fontWeight: 600 }}
                  >
                    {booking.rating} · Your rating
                  </Text>
                </div>
              )}
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          radius="full"
          leftIcon={<Download className="w-4 h-4" />}
          className="flex-1"
        >
          Save
        </Button>
        <Button
          variant="primary"
          radius="full"
          leftIcon={<Share2 className="w-4 h-4" />}
          className="flex-1"
        >
          Share
        </Button>
      </ModalFooter>
    </Modal>
  );
}