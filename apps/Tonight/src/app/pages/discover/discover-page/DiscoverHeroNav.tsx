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
      <section ref={discoverHeroSectionRef} className="relative min-w-0 -mx-4 -mt-6 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-6">
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
            
            {/* HERO SEARCH BUTTON - MAC OS GLASSMORPHISM */}
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="group relative flex h-14 flex-1 cursor-pointer items-center gap-3 overflow-hidden rounded-full border border-white/40 bg-white/20 px-4 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_32px_rgba(0,0,0,0.16)] backdrop-blur-[32px] backdrop-saturate-[1.8] transition-all duration-300 hover:bg-white/30 dark:border-white/15 dark:bg-black/30 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] dark:hover:bg-black/40"
            >
              {/* Static top-edge glare reflection */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-60 dark:from-white/10 dark:opacity-20" />
              {/* Animated diagonal shine on hover */}
              <div className="pointer-events-none absolute inset-0 w-full -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10" />

              {/* Nested Glass Icon Container */}
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Search className="h-4 w-4 text-foreground/90 drop-shadow-sm" />
              </span>
              <span className="relative min-w-0">
                <span className="block truncate text-[0.9375rem] font-bold tracking-tight text-foreground/95 drop-shadow-sm">
                  {searchPlan?.query || searchInput || "Find a restaurant"}
                </span>
                <span className="block truncate text-[0.75rem] font-medium text-foreground/70 drop-shadow-sm">
                  {searchPlan ? formatSearchPlanSummary(searchPlan) : "Tonight, 7:00 PM, 2 people"}
                </span>
              </span>
            </button>

            {/* HERO MAP BUTTON - MAC OS GLASSMORPHISM */}
            <button
              type="button"
              onClick={handleOpenMapSearch}
              className="group relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_32px_rgba(0,0,0,0.16)] backdrop-blur-[32px] backdrop-saturate-[1.8] transition-all duration-300 hover:scale-[1.04] hover:bg-white/30 active:scale-95 dark:border-white/15 dark:bg-black/30 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] dark:hover:bg-black/40"
              aria-label="Open map search"
            >
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-60 dark:from-white/10 dark:opacity-20" />
              <div className="pointer-events-none absolute inset-0 w-full -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:translate-x-full group-hover:opacity-100 dark:via-white/10" />
              
              <MapIcon className="relative h-5 w-5 text-foreground/90 drop-shadow-sm" />
            </button>
          </div>
        </motion.div>
      </section>

      {!hasSubView && (
        <motion.div
          aria-hidden={!discoverNavCompact}
          className={cn(
            "fixed inset-x-0 top-0 z-[70] overflow-hidden",
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
          <div
            className={cn(
              "mx-auto flex w-full max-w-3xl items-center gap-2 bg-background/50 px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] backdrop-blur-[32px] backdrop-saturate-[2] sm:px-6 lg:px-8",
              discoverNavCompact && "border-b border-white/20 shadow-[0_10px_36px_-14px_rgba(0,0,0,0.2)] dark:border-white/10",
            )}
          >
            {/* COMPACT NAV SEARCH BUTTON */}
            <motion.button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="group relative flex h-11 min-h-11 flex-1 cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-white/30 bg-white/30 px-3 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_12px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:bg-white/40 dark:border-white/10 dark:bg-white/5 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_12px_rgba(0,0,0,0.3)] dark:hover:bg-white/10"
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
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-50 dark:from-white/5" />
              
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-sm dark:border-white/10 dark:bg-white/10">
                <Search className="h-3.5 w-3.5 text-foreground/90" />
              </span>
              <span className="relative min-w-0">
                <span className="block truncate text-[0.8125rem] font-bold leading-tight text-foreground/95 drop-shadow-sm">
                  {searchPlan?.query || searchInput || "Find a restaurant"}
                </span>
                <span className="block truncate text-[0.625rem] font-medium leading-tight text-foreground/70 drop-shadow-sm">
                  {searchPlan ? formatSearchPlanSummary(searchPlan) : "Tonight, 7:00 PM, 2 people"}
                </span>
              </span>
            </motion.button>

            {/* COMPACT NAV MAP BUTTON */}
            <motion.button
              type="button"
              onClick={handleOpenMapSearch}
              className="group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_12px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.04] hover:bg-white/40 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_12px_rgba(0,0,0,0.3)] dark:hover:bg-white/10"
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
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-50 dark:from-white/5" />
              <MapIcon className="relative h-4 w-4 text-foreground/90 drop-shadow-sm" />
            </motion.button>
          </div>
        </motion.div>
      )}
      <BannerGalleryModal open={showBannerGallery} onClose={() => setShowBannerGallery(false)} onSelect={onGalleryBannerSelect} />
    </>
  );
}