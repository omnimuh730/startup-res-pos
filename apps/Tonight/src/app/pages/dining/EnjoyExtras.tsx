/* MenuModal + OrderReceiptModal - supporting modals for EnjoyMealPage and visited bookings */
import { motion } from "motion/react";
import { Modal, ModalBody, ModalFooter } from "../../components/ds/Modal";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
  BookOpen,
  CreditCard,
  Download,
  Receipt as ReceiptIcon,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import type { Booking } from "./diningData";
import { getMenuFor } from "./diningData";

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

function itemMark(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

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
    <Modal open={open} onClose={onClose} size="md" className="rounded-[2rem]">
      <ModalBody className="px-5 pt-5">
        <div className="relative -mx-5 -mt-5 mb-5 h-36 overflow-hidden rounded-t-[2rem]">
          <ImageWithFallback src={booking.image} alt={booking.restaurant} className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/25 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-2.5 py-1 text-[0.6875rem] backdrop-blur" style={{ fontWeight: 800 }}>
              <BookOpen className="h-3.5 w-3.5" />
              {isPreview ? "Preview menu" : "Menu"}
            </span>
            <Text className="truncate text-[1.125rem] text-white" style={{ fontWeight: 800 }}>
              {booking.restaurant}
            </Text>
            <Text className="truncate text-[0.8125rem] text-white/78">View only. Your server will take the order.</Text>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div>
            <Heading level={4}>{isPreview ? "Plan ahead" : "Tonight picks"}</Heading>
            <Text className="mt-0.5 text-[0.8125rem] text-muted-foreground">{menu.length} dishes available</Text>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">
            <Text className="text-[0.75rem] text-primary" style={{ fontWeight: 800 }}>
              {booking.cuisine.split(" ")[0].trim()}
            </Text>
          </div>
        </div>

        <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
          {menu.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.035 }}
              className="flex items-center gap-3 rounded-[1.25rem] border border-border bg-card p-3 shadow-[0_5px_18px_rgba(0,0,0,0.035)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-secondary text-[0.8125rem] text-foreground" style={{ fontWeight: 900 }}>
                {itemMark(item.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <Text className="truncate text-[0.9375rem]" style={{ fontWeight: 800 }}>
                    {item.name}
                  </Text>
                  {item.popular && <Sparkles className="h-3.5 w-3.5 shrink-0 text-warning" />}
                </div>
                <Text className="mt-0.5 line-clamp-2 text-[0.75rem] leading-snug text-muted-foreground">{item.description}</Text>
              </div>
              <Text className="shrink-0 text-[0.9375rem] text-primary" style={{ fontWeight: 900 }}>
                {fmt(item.price)}
              </Text>
            </motion.div>
          ))}
        </div>
      </ModalBody>
      <ModalFooter className="px-5">
        <Button variant="primary" radius="full" fullWidth className="font-bold" onClick={onClose}>
          Done
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
  const receipt = booking.receipt;

  return (
    <Modal open={open} onClose={onClose} size="md" className="rounded-[2rem]">
      <ModalBody className="px-5 py-5">
        <div className="mb-5 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.75, rotate: -10, opacity: 0 }}
            animate={{ scale: [1.08, 0.98, 1], rotate: 0, opacity: 1 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"
          >
            <ReceiptIcon className="h-5 w-5" />
          </motion.div>
          <div className="min-w-0">
            <Heading level={4}>Order receipt</Heading>
            <Text className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">{booking.restaurant}</Text>
          </div>
        </div>

        {!receipt ? (
          <div className="rounded-[1.5rem] border border-border bg-secondary/50 px-5 py-9 text-center">
            <Text className="text-[0.9375rem] text-muted-foreground">No receipt available for this visit.</Text>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.055)]">
            <div className="border-b border-dashed border-border bg-secondary/55 px-4 py-4 text-center">
              <Text className="text-[0.9375rem]" style={{ fontWeight: 900 }}>
                {booking.restaurant}
              </Text>
              <Text className="mx-auto mt-1 max-w-xs text-[0.6875rem] leading-snug text-muted-foreground">{booking.address}</Text>
              <Text className="mt-2 text-[0.75rem] text-muted-foreground">{receipt.paidAt}</Text>
            </div>

            <div className="max-h-[38vh] overflow-y-auto px-4 py-3">
              {receipt.items.map((item, index) => (
                <motion.div
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.025 }}
                  className="flex items-center gap-3 py-2.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.6875rem]" style={{ fontWeight: 900 }}>
                    {itemMark(item.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text className="truncate text-[0.875rem]" style={{ fontWeight: 700 }}>
                      {item.name}
                    </Text>
                    <Text className="text-[0.75rem] text-muted-foreground">Qty {item.qty}</Text>
                  </div>
                  <Text className="text-[0.875rem]" style={{ fontWeight: 800 }}>
                    {fmt(item.price * item.qty)}
                  </Text>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-dashed border-border px-4 py-4">
              <div className="space-y-2 text-[0.875rem]">
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">Subtotal</Text>
                  <Text>{fmt(receipt.subtotal)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">Tax</Text>
                  <Text>{fmt(receipt.tax)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-muted-foreground">Tip</Text>
                  <Text>{fmt(receipt.tip)}</Text>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-[1rem] bg-primary/8 px-3 py-2.5">
                  <Text className="text-[1rem]" style={{ fontWeight: 900 }}>
                    Total
                  </Text>
                  <Text className="text-[1.125rem] text-primary" style={{ fontWeight: 900 }}>
                    {fmt(receipt.total)}
                  </Text>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-[1rem] bg-secondary/70 px-3 py-2">
                <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Text className="text-[0.8125rem] text-muted-foreground">Paid with</Text>
                <Text className="truncate text-[0.8125rem]" style={{ fontWeight: 800 }}>
                  {receipt.paymentMethod}
                </Text>
              </div>

              {booking.rating != null && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <Text className="text-[0.8125rem]" style={{ fontWeight: 800 }}>
                    {booking.rating} - Your rating
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="px-5">
        <Button variant="outline" radius="full" leftIcon={<Download className="h-4 w-4" />} className="flex-1 font-bold">
          Save
        </Button>
        <Button variant="primary" radius="full" leftIcon={<Share2 className="h-4 w-4" />} className="flex-1 font-bold">
          Share
        </Button>
      </ModalFooter>
    </Modal>
  );
}
