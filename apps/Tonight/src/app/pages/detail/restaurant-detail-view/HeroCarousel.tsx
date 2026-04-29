import { ArrowLeft, Heart, Share } from "lucide-react";
import type { RefObject } from "react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import type { RestaurantData } from "../restaurantDetailData";

interface HeroCarouselProps {
  restaurant: RestaurantData;
  galleryImages: string[];
  heroIdx: number;
  heroRef: RefObject<HTMLDivElement | null>;
  isSaved: boolean;
  onBack: () => void;
  onHeroScroll: () => void;
  onSave?: (restaurant: RestaurantData) => void;
}

export function HeroCarousel({ restaurant, galleryImages, heroIdx, heroRef, isSaved, onBack, onHeroScroll, onSave }: HeroCarouselProps) {
  return (
    <div className="relative shrink-0 h-[24rem] sm:h-[28rem] overflow-hidden select-none">
      <div
        ref={heroRef}
        onScroll={onHeroScroll}
        className="flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
        onDragStart={(e) => e.preventDefault()}
      >
        {galleryImages.map((src, i) => (
          <div key={i} className="w-full h-full shrink-0 snap-center relative pointer-events-none">
            <ImageWithFallback src={src} alt={`${restaurant.name} ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center cursor-pointer">
            <Share className="w-4 h-4 text-foreground" />
          </button>
          {onSave && (
            <button onClick={() => onSave(restaurant)} className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center cursor-pointer">
              <Heart className={`w-5 h-5 ${isSaved ? "fill-rose-500 text-rose-500" : "text-foreground"}`} />
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-12 right-5 px-3 py-1 rounded-lg bg-black/60 text-white text-[0.8rem]">
        {heroIdx + 1} / {galleryImages.length}
      </div>
    </div>
  );
}
