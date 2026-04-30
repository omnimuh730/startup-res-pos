import { StaggerItem } from "../../../components/ds/Animate";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { pickRibbonLabel } from "../../../components/ds/Ribbon";
import { ChevronRight } from "lucide-react";
import { DragScrollContainer } from "../../shared/DragScrollContainer";
import { QUICK_CATEGORIES, CITIES, FOOD_TYPES, MONTHLY_BEST } from "../discoverData";
import { SectionHeader } from "../SaveButtons";
import { CategoryIcon } from "../CategoryIcon";
import { AirbnbRestaurantCard } from "../AirbnbRestaurantCard";
import type { DiscoverFeedBuilderProps, DiscoverFeedStaggerList } from "./discoverFeedTypes";

export function discoverFeedTopPart(p: DiscoverFeedBuilderProps): DiscoverFeedStaggerList {
  const { navigate, requireAuth, saveScrollPos, setSelectedCategory, openSection, openCity, openFoodType, openRestaurant, toggleSaveRestaurant } = p;
  return [
    <StaggerItem key="qc" preset="fadeInUp" className="mt-0">
      <div className="grid grid-cols-4 gap-y-3 gap-x-1">
        {QUICK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              if (cat.id === "nearby-me") {
                if (!requireAuth("/discover/search?q=Gangnam", "Sign in to find restaurants near your current location.")) return;
                navigate("/discover/search?q=Gangnam");
                return;
              }
              if (cat.id === "local-fav") {
                saveScrollPos();
                openSection("loved-by-locals");
                return;
              }
              saveScrollPos();
              setSelectedCategory(cat);
            }}
            className="group flex cursor-pointer flex-col items-center gap-1"
          >
            <div className="transition-transform group-hover:scale-110">
              <CategoryIcon id={cat.id} className="h-11 w-11" />
            </div>
            <span className="text-center text-[0.75rem] leading-tight whitespace-pre-line" style={{ fontWeight: 500 }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </StaggerItem>,
    <StaggerItem key="wte" preset="fadeInUp" className="mt-8">
      <SectionHeader title="Where to Eat?" onAction={() => openSection("where-to-eat")} />
      <DragScrollContainer className="flex gap-3 pb-1">
        {CITIES.map((city) => (
          <button key={city.id} onClick={() => openCity(city)} className="group relative h-20 w-32 shrink-0 cursor-pointer overflow-hidden rounded-xl">
            <ImageWithFallback src={city.image} alt={city.label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />
            <span className="absolute inset-0 flex items-center justify-center text-[0.8125rem] tracking-wider text-white" style={{ fontWeight: 700 }}>
              {city.label}
            </span>
          </button>
        ))}
        <button onClick={() => openSection("where-to-eat")} className="flex h-20 w-16 shrink-0 cursor-pointer items-center justify-center rounded-xl text-primary transition hover:bg-secondary">
          <div className="flex flex-col items-center gap-1">
            <ChevronRight className="h-6 w-6" />
            <span className="text-[0.6875rem]" style={{ fontWeight: 500 }}>
              More
            </span>
          </div>
        </button>
      </DragScrollContainer>
    </StaggerItem>,
    <StaggerItem key="tpft" preset="fadeInUp" className="mt-8">
      <SectionHeader title="Top Picks by Food Type" action="More" onAction={() => openSection("top-picks-food")} />
      <DragScrollContainer className="flex gap-3 pb-1">
        {FOOD_TYPES.map((f) => (
          <button key={f.id} onClick={() => openFoodType(f)} className="group relative h-20 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl">
            <ImageWithFallback src={f.image} alt={f.label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute right-2 bottom-2 left-2 text-[0.75rem] text-white" style={{ fontWeight: 600 }}>
              {f.label}
            </span>
          </button>
        ))}
      </DragScrollContainer>
    </StaggerItem>,
    <StaggerItem key="mb" preset="fadeInUp" className="mt-8">
      <SectionHeader title="Monthly Best" action="View All" onAction={() => openSection("monthly-best")} />
      <DragScrollContainer className="flex gap-4 pb-2">
        {MONTHLY_BEST.map((r, idx) => (
          <AirbnbRestaurantCard
            key={r.id}
            item={{
              id: r.id,
              name: r.name,
              cuisine: r.cuisine,
              area: r.area,
              rating: r.rating,
              image: r.image,
              price: idx === 1 ? "$$" : idx === 3 ? "$$$$" : "$$$",
              reviews: 780 + idx * 137,
              distance: `${(0.4 + idx * 0.3).toFixed(1)} mi`,
              badge: pickRibbonLabel(r.id),
              wait: idx === 3 ? "Few seats left" : "Tables tonight",
            }}
            onSelect={(item) => openRestaurant(item)}
            onSave={toggleSaveRestaurant}
            className="w-44 shrink-0 sm:w-48"
          />
        ))}
      </DragScrollContainer>
    </StaggerItem>,
  ];
}
