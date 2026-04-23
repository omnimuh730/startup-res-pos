/* Gallery modal showing all promo banners full-width */
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { BANNERS } from "./discoverData";

interface BannerGalleryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (bannerId: string) => void;
}

export function BannerGalleryModal({ open, onClose, onSelect }: BannerGalleryModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md">
            <h2 className="text-white text-[1rem]" style={{ fontWeight: 700 }}>All Promotions</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-4 py-4 space-y-4 max-w-3xl mx-auto">
            {BANNERS.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ aspectRatio: "1.8 / 1" }}
                onClick={(e) => { e.stopPropagation(); onSelect?.(b.id); }}
              >
                <ImageWithFallback src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${b.gradient}`} />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h3 className="text-white text-[1.5rem] whitespace-pre-line leading-tight" style={{ fontWeight: 800 }}>{b.title}</h3>
                  <p className="text-white/90 text-[0.9375rem] mt-0.5 whitespace-pre-line leading-snug" style={{ fontWeight: 500 }}>{b.subtitle}</p>
                  {b.cta && (
                    <p className="text-white/60 text-[0.6875rem] mt-2 uppercase tracking-wider">{b.cta}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
