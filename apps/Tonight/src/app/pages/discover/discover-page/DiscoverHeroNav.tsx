import type { RefObject } from "react";
import { Map as MapIcon, Search } from "lucide-react";
import { BannerCarousel } from "../BannerCarousel";
import { BannerGalleryModal } from "../BannerGalleryModal";
import { cn } from "../../../components/ui/utils";
import { motion } from "motion/react";
import type { SearchPlan } from "../DiscoverSearchModal";
import { formatSearchPlanSummary } from "./discoverFormatters";

type Glide = (duration: number, delay?: number) => {
  type: "tween";
  duration: number;
  ease: readonly [number, number, number, number];
  delay: number;
};

export function DiscoverHeroNav({
  discoverHeroSectionRef,
  discoverNavCompact,
  reduceMotion,
  glide,
  showBannerGallery,
  setShowBannerGallery,
  searchPlan,
  searchInput,
  setShowSearchModal,
  handleOpenMapSearch,
  onBannerClick,
  onGalleryBannerSelect,
  hasSubView,
}: {
  discoverHeroSectionRef: RefObject<HTMLElement | null>;
  discoverNavCompact: boolean;
  reduceMotion: boolean | null;
  glide: Glide;
  showBannerGallery: boolean;
  setShowBannerGallery: (v: boolean) => void;
  searchPlan: SearchPlan | null;
  searchInput: string;
  setShowSearchModal: (v: boolean) => void;
  handleOpenMapSearch: () => void;
  onBannerClick: (bannerId: string) => void;
  onGalleryBannerSelect: (bannerId: string) => void;
  hasSubView: boolean;
}) {
  return (
    <>
      <section ref={discoverHeroSectionRef} className="relative w-full min-w-0 -mx-4 -mt-6 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-6">
        <BannerCarousel onBannerClick={onBannerClick} onViewAll={() => setShowBannerGallery(true)} />
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 pt-[calc(1.35rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-[calc(1.5rem+env(safe-area-inset-top,0px))] lg:px-8"
          initial={false}
          animate={{
            opacity: discoverNavCompact ? 0 : 1,
            y: discoverNavCompact ? (reduceMotion ? 0 : -8) : 0,
          }}
          transition={{
            opacity: glide(discoverNavCompact ? 0.36 : 0.48),
            y: glide(discoverNavCompact ? 0.36 : 0.48),
          }}
        >
          <div className={cn("pointer-events-auto mx-auto flex max-w-3xl items-center gap-2", discoverNavCompact && "pointer-events-none")}>
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="flex h-14 flex-1 cursor-pointer items-center gap-3 rounded-full border border-white/30 bg-background/92 px-4 text-left shadow-[0_8px_28px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:bg-background/98"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/90">
                <Search className="h-4 w-4 text-foreground" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.9375rem]" style={{ fontWeight: 700 }}>
                  {searchPlan?.query || searchInput || "Find a restaurant"}
                </span>
                <span className="block truncate text-[0.75rem] text-muted-foreground">
                  {searchPlan ? formatSearchPlanSummary(searchPlan) : "Tonight, 7:00 PM, 2 people"}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={handleOpenMapSearch}
              className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-background/92 shadow-[0_8px_28px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:scale-[1.03] hover:bg-background/98 active:scale-95"
              aria-label="Open map search"
            >
              <MapIcon className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </motion.div>
      </section>
      {!hasSubView && (
        <motion.div
          aria-hidden={!discoverNavCompact}
          className={cn(
            "sticky top-0 z-50 -mx-4 overflow-hidden bg-background/96 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
            discoverNavCompact && "border-b border-border/55 py-2 shadow-[0_10px_36px_-14px_rgba(0,0,0,0.18)]",
          )}
          initial={false}
          animate={{
            maxHeight: discoverNavCompact ? 88 : 0,
            opacity: discoverNavCompact ? 1 : 0,
          }}
          transition={{
            maxHeight: glide(discoverNavCompact ? 0.48 : 0.36),
            opacity: glide(discoverNavCompact ? 0.44 : 0.3),
          }}
          style={{ pointerEvents: discoverNavCompact ? "auto" : "none" }}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-0.5">
            <motion.button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="flex h-11 min-h-11 flex-1 cursor-pointer items-center gap-2.5 rounded-full border border-border/80 bg-card px-3 text-left shadow-sm"
              initial={false}
              animate={{
                opacity: discoverNavCompact ? 1 : 0,
                y: reduceMotion ? 0 : discoverNavCompact ? 0 : -6,
              }}
              transition={{
                opacity: glide(0.42, reduceMotion ? 0 : discoverNavCompact ? 0.04 : 0),
                y: glide(0.45, reduceMotion ? 0 : discoverNavCompact ? 0.04 : 0),
              }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Search className="h-3.5 w-3.5 text-foreground" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.8125rem] leading-tight" style={{ fontWeight: 700 }}>
                  {searchPlan?.query || searchInput || "Find a restaurant"}
                </span>
                <span className="block truncate text-[0.625rem] leading-tight text-muted-foreground">
                  {searchPlan ? formatSearchPlanSummary(searchPlan) : "Tonight, 7:00 PM, 2 people"}
                </span>
              </span>
            </motion.button>
            <motion.button
              type="button"
              onClick={handleOpenMapSearch}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-card shadow-sm transition hover:scale-[1.04] active:scale-95"
              aria-label="Open map search"
              initial={false}
              animate={{
                opacity: discoverNavCompact ? 1 : 0,
                y: reduceMotion ? 0 : discoverNavCompact ? 0 : -6,
              }}
              transition={{
                opacity: glide(0.42, reduceMotion ? 0 : discoverNavCompact ? 0.08 : 0),
                y: glide(0.45, reduceMotion ? 0 : discoverNavCompact ? 0.08 : 0),
              }}
            >
              <MapIcon className="h-4 w-4 text-foreground" />
            </motion.button>
          </div>
        </motion.div>
      )}
      <BannerGalleryModal open={showBannerGallery} onClose={() => setShowBannerGallery(false)} onSelect={onGalleryBannerSelect} />
    </>
  );
}
