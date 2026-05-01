import { StaggerItem } from "../../../components/ds/Animate";
import { DSBadge } from "../../../components/ds/Badge";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { Ribbon, pickRibbonLabel } from "../../../components/ds/Ribbon";
import { Star, Clock, MapPin } from "lucide-react";
import { DragScrollContainer } from "../../shared/DragScrollContainer";
import { fmtR } from "../discoverTypes";
import { LOVED_BY_LOCALS } from "../discoverData";
import { DISCOVER_LATE_NIGHT, DISCOVER_NEW_THIS_WEEK } from "./discoverHomeLists";
import { CardSaveBtn, SectionHeader } from "../SaveButtons";
import { NewsSection } from "../NewsSection";
import type { DiscoverFeedBuilderProps, DiscoverFeedStaggerList } from "./discoverFeedTypes";

export function discoverFeedBottomPart(p: DiscoverFeedBuilderProps): DiscoverFeedStaggerList {
  const { navigate, openSection, openRestaurant, toggleSaveRestaurant } = p;
  return [
    <StaggerItem key="lbl" preset="fadeInUp" className="mt-8">
      <SectionHeader title="Loved by Locals" action="View All" onAction={() => openSection("loved-by-locals")} />
      <div className="space-y-3">
        {LOVED_BY_LOCALS.map((r) => (
          <div
            key={r.id}
            onClick={() => openRestaurant({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim() })}
            className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:bg-secondary/30"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <ImageWithFallback src={r.image} alt={r.name} className="h-full w-full object-cover" />
              <Ribbon position="top-left" variant="diagonal" size="sm" color={pickRibbonLabel(r.id) === "Sale" ? "destructive" : "primary"}>
                {pickRibbonLabel(r.id)}
              </Ribbon>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-[0.875rem]" style={{ fontWeight: 600 }}>
                  {r.name}
                </p>
                <DSBadge variant="soft" color="primary" size="sm">
                  {r.tag}
                </DSBadge>
              </div>
              <p className="mt-0.5 text-[0.75rem] text-muted-foreground">
                {r.cuisine} / {r.price}
              </p>
              <div className="mt-1 flex items-center gap-3 text-[0.75rem]">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="h-3 w-3 fill-current" /> {fmtR(r.rating)}
                </span>
                <span className="text-muted-foreground">({r.reviews.toLocaleString()})</span>
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {r.distance}
                </span>
              </div>
            </div>
            <CardSaveBtn
              id={r.id}
              restaurant={{
                id: r.id,
                name: r.name,
                cuisine: r.cuisine.split("\u00b7")[0].trim(),
                emoji: "",
                rating: r.rating,
                reviews: r.reviews,
                price: r.price,
                lng: -122.42,
                lat: 37.78,
                open: true,
                distance: r.distance,
                image: r.image,
              }}
              onToggle={toggleSaveRestaurant}
              variant="inline"
            />
          </div>
        ))}
      </div>
    </StaggerItem>,
    <StaggerItem key="news" preset="fadeInUp" className="mt-8">
      <NewsSection onSelect={(id) => navigate(`/discover/news/${id}`)} onViewAll={() => navigate("/discover/news")} />
    </StaggerItem>,
    <StaggerItem key="ntw" preset="fadeInUp" className="mt-8">
      <SectionHeader title="New This Week" />
      <div className="space-y-3">
        {DISCOVER_NEW_THIS_WEEK.map((r) => (
          <div
            key={r.id}
            onClick={() => openRestaurant({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim() })}
            className="flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition hover:bg-secondary/30"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <ImageWithFallback src={r.image} alt={r.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.875rem]" style={{ fontWeight: 600 }}>
                {r.name}
              </p>
              <p className="text-[0.6875rem] text-muted-foreground">{r.cuisine}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[0.6875rem]">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="h-3 w-3 fill-current" /> {fmtR(r.rating)}
                </span>
                <span className="text-success flex items-center gap-0.5">
                  <Clock className="h-3 w-3" /> {r.time}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <DSBadge variant="soft" color="success" size="sm">
                NEW
              </DSBadge>
              <CardSaveBtn
                id={r.id}
                restaurant={{
                  id: r.id,
                  name: r.name,
                  cuisine: r.cuisine.split("\u00b7")[0].trim(),
                  emoji: "",
                  rating: r.rating,
                  reviews: 500,
                  price: "$$$",
                  lng: -122.42,
                  lat: 37.78,
                  open: true,
                  distance: "0.5 mi",
                  image: r.image,
                }}
                onToggle={toggleSaveRestaurant}
                variant="inline"
              />
            </div>
          </div>
        ))}
      </div>
    </StaggerItem>,
    <StaggerItem key="lne" preset="fadeInUp" className="mt-8">
      <SectionHeader title="Late Night Eats" action="View All" onAction={() => openSection("late-night")} />
      <DragScrollContainer className="flex gap-3 pb-1">
        {DISCOVER_LATE_NIGHT.map((r) => (
          <div key={r.id} className="group w-44 shrink-0 cursor-pointer" onClick={() => openRestaurant({ ...r, cuisine: r.cuisine.split("\u00b7")[0].trim() })}>
            <div className="relative mb-2 h-32 overflow-hidden rounded-xl">
              <ImageWithFallback src={r.image} alt={r.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <Ribbon position="top-left" variant="diagonal" size="md" color={pickRibbonLabel(r.id) === "Sale" ? "destructive" : "primary"}>
                {pickRibbonLabel(r.id)}
              </Ribbon>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[0.6875rem] text-white">
                <Clock className="h-3 w-3" /> {r.hours}
              </div>
              <CardSaveBtn
                id={r.id}
                restaurant={{
                  id: r.id,
                  name: r.name,
                  cuisine: r.cuisine.split("\u00b7")[0].trim(),
                  emoji: "",
                  rating: r.rating,
                  reviews: 500,
                  price: r.price,
                  lng: -122.42,
                  lat: 37.78,
                  open: true,
                  distance: "0.5 mi",
                  image: r.image,
                }}
                onToggle={toggleSaveRestaurant}
              />
            </div>
            <p className="truncate text-[0.8125rem]" style={{ fontWeight: 600 }}>
              {r.name}
            </p>
            <p className="text-[0.6875rem] text-muted-foreground">
              {r.cuisine} / {r.price}
            </p>
            <div className="mt-0.5 flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="text-[0.75rem]" style={{ fontWeight: 600 }}>
                {fmtR(r.rating)}
              </span>
            </div>
          </div>
        ))}
      </DragScrollContainer>
    </StaggerItem>,
  ];
}
