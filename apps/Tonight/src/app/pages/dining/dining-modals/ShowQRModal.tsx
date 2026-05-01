import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../components/ds/Button";
import { Text } from "../../../components/ds/Text";
import { Download, QrCode, Share2, X } from "lucide-react";
import type { Booking } from "../diningData";

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
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[2rem] bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Text className="text-[1.125rem]" style={{ fontWeight: 800 }}>Arrival QR</Text>
                <Text className="mt-0.5 text-[0.8125rem] text-muted-foreground">Show this at the host stand.</Text>
              </div>
              <button type="button" onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-foreground transition active:scale-95" aria-label="Close QR code">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-secondary/50 p-3">
              <div className="rounded-[1.25rem] bg-white p-4 shadow-sm">
                <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full">
                  {Array.from({ length: cells }).map((_, r) =>
                    Array.from({ length: cells }).map((_, c) =>
                      getCell(r, c) ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize - 1} height={cellSize - 1} rx={1} fill="#222222" /> : null,
                    ),
                  )}
                </svg>
              </div>
            </div>

            <div className="mt-4 rounded-[1.25rem] bg-secondary/65 p-3 text-center">
              <Text className="truncate text-[1rem]" style={{ fontWeight: 800 }}>{booking.restaurant}</Text>
              <Text className="mt-0.5 text-[0.8125rem] text-muted-foreground">{booking.date} - {booking.time} - {booking.guests} guest{booking.guests > 1 ? "s" : ""}</Text>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-primary">
                <QrCode className="h-3.5 w-3.5" />
                <Text className="text-[0.8125rem] text-primary" style={{ fontWeight: 800 }}>{booking.confirmationNo}</Text>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" radius="full" className="font-bold" leftIcon={<Download className="h-4 w-4" />}>Save</Button>
              <Button variant="primary" radius="full" className="font-bold" leftIcon={<Share2 className="h-4 w-4" />}>Share</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
