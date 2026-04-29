import { Award, Car, Clock3, Phone, Sparkles, UtensilsCrossed, Wifi } from "lucide-react";
import type { RestaurantData } from "../restaurantDetailData";
import type { RestaurantExtendedData } from "./types";
import { Amenity, FeatureRow } from "./DetailPrimitives";

export function HighlightsSection({ restaurant }: { restaurant: RestaurantData }) {
  return (
    <section className="px-6 py-6 border-b border-border space-y-4">
      <FeatureRow icon={<Award className="w-5 h-5" />} title="Exceptional dining experience" subtitle="Guests consistently praise this place for quality and atmosphere." />
      <FeatureRow icon={<UtensilsCrossed className="w-5 h-5" />} title={`${restaurant.cuisine} cuisine`} subtitle="Chef-driven menu with seasonal ingredients and house specialties." />
    </section>
  );
}

export function AboutSection({ ext }: { ext: RestaurantExtendedData }) {
  return (
    <section className="px-6 py-6 border-b border-border">
      <h2 className="text-[1.75rem] leading-tight mb-3" style={{ fontWeight: 700 }}>About this place</h2>
      <p className="text-[1rem] leading-7 text-foreground/90">{ext.description} Whether it is date night or a celebration, this restaurant is designed for memorable meals with attentive service and a curated menu.</p>
    </section>
  );
}

export function AmenitiesSection({ ext }: { ext: RestaurantExtendedData }) {
  return (
    <section className="px-6 py-6 border-b border-border">
      <h2 className="text-[1.75rem] leading-tight mb-5" style={{ fontWeight: 700 }}>What this place offers</h2>
      <div className="space-y-4 text-[1rem]">
        <Amenity icon={<Clock3 className="w-5 h-5" />} text={`Service time: ${ext.deliveryTime}`} />
        <Amenity icon={<Wifi className="w-5 h-5" />} text="Fast WiFi and cozy seating" />
        <Amenity icon={<Car className="w-5 h-5" />} text="Convenient parking nearby" />
        <Amenity icon={<Phone className="w-5 h-5" />} text={`Phone support: ${ext.phone}`} />
        <Amenity icon={<Sparkles className="w-5 h-5" />} text={ext.tags.join(" • ")} />
      </div>
      <button className="mt-5 w-full h-12 rounded-xl bg-secondary text-foreground text-[1rem] cursor-pointer" style={{ fontWeight: 600 }}>
        Show all amenities
      </button>
    </section>
  );
}

export function CancellationPolicySection() {
  return (
    <section className="px-6 py-6 border-b border-border">
      <h2 className="text-[1.75rem] leading-tight mb-3" style={{ fontWeight: 700 }}>Cancellation policy</h2>
      <p className="text-[1rem] leading-7">Free cancellation up to 24 hours before your reservation. Late cancellations may include a partial fee depending on booking size and timing.</p>
    </section>
  );
}
