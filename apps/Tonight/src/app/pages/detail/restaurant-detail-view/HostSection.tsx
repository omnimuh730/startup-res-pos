import { BadgeCheck } from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { fmtR, type RestaurantData } from "../restaurantDetailData";
import { StatCell } from "./DetailPrimitives";
import type { HostProfile } from "./types";

export function HostSection({ restaurant, hostProfile }: { restaurant: RestaurantData; hostProfile: HostProfile }) {
  return (
    <section className="px-6 py-6 border-b border-border">
      <h2 className="text-[1.75rem] leading-tight mb-4" style={{ fontWeight: 700 }}>Meet your host</h2>
      <div className="rounded-3xl border border-border p-5 shadow-sm">
        <div className="grid grid-cols-3 gap-5 items-center">
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-border">
              <ImageWithFallback src={hostProfile.image} alt={`${hostProfile.name} profile`} className="w-full h-full object-cover" />
            </div>
            <p className="text-[1.75rem] leading-none mt-3" style={{ fontWeight: 700 }}>{hostProfile.name}</p>
            <p className="text-[0.95rem] text-muted-foreground flex items-center gap-1 mt-1"><BadgeCheck className="w-4 h-4" /> Superhost</p>
          </div>
          <div className="col-span-1 min-w-[110px]">
            <StatCell label="Reviews" value={String(restaurant.reviews)} />
            <StatCell label="Rating" value={`${fmtR(restaurant.rating)}★`} />
            <StatCell label="Years hosting" value={String(hostProfile.yearsHosting)} />
          </div>
        </div>
      </div>
      <p className="text-[1rem] leading-7 mt-5">Our team loves welcoming guests and making every visit smooth. Expect warm service, fast response times, and attention to special occasions.</p>
    </section>
  );
}
