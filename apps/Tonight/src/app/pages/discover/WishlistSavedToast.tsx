import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import type { RestaurantData } from "../detail/RestaurantDetailView";

export type WishlistSavedToastState = {
  id: number;
  restaurant: RestaurantData;
  collectionTitle: string;
};

export function WishlistSavedToast({
  toast,
  onChange,
}: {
  toast: WishlistSavedToastState | null;
  onChange: (restaurant: RestaurantData) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[470] flex justify-center px-4 sm:bottom-8"
      style={{ bottom: "calc(var(--app-bottom-chrome-height, 0px) + 1rem)" }}
    >
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 24, stiffness: 360 }}
            className="pointer-events-auto flex w-full max-w-[29rem] items-center gap-3 rounded-xl bg-white px-3 py-3 text-[#222222] shadow-[0_8px_30px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F7F7F7]">
              {toast.restaurant.image ? (
                <ImageWithFallback
                  src={toast.restaurant.image}
                  alt={toast.restaurant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Heart className="h-5 w-5 text-[#B0B0B0]" />
                </div>
              )}
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E31C5F] text-white shadow-sm">
                <Heart className="h-3 w-3 fill-current" strokeWidth={2.4} />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] leading-snug text-[#222222]">
                Saved to <span style={{ fontWeight: 700 }}>{toast.collectionTitle}</span>
              </p>
              <p className="mt-0.5 truncate text-[0.8125rem] text-[#717171]">
                {toast.restaurant.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onChange(toast.restaurant)}
              className="shrink-0 rounded-md px-2 py-1 text-[0.875rem] text-[#222222] underline decoration-2 underline-offset-2 transition hover:bg-[#F7F7F7] cursor-pointer"
              style={{ fontWeight: 700 }}
            >
              Change
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
