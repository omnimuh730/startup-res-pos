import { ArrowLeft } from "lucide-react";
import { fmtR, type RestaurantData } from "../restaurantDetailData";

const subRatings = [
  { label: "Taste", value: "5.0", icon: "🍽️" },
  { label: "Ambience", value: "4.9", icon: "✨" },
  { label: "Service", value: "4.8", icon: "🤝" },
  { label: "Value", value: "4.7", icon: "💰" },
];

const distribution = [
  { stars: 5, pct: 88 },
  { stars: 4, pct: 64 },
  { stars: 3, pct: 30 },
  { stars: 2, pct: 14 },
  { stars: 1, pct: 8 },
];

export function ReviewStatsHeader({
  restaurant,
  searchOpen,
  onBack,
  onShowHowReviewsWork,
}: {
  restaurant: RestaurantData;
  searchOpen: boolean;
  onBack: () => void;
  onShowHowReviewsWork: () => void;
}) {
  return (
    <div className={`px-5 pt-4 bg-[#f5f2e8] border-b border-border overflow-hidden transition-all duration-300 ease-out ${searchOpen ? "max-h-0 opacity-0 pb-0 border-b-0" : "max-h-[520px] opacity-100 pb-6"}`}>
      <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer">
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="text-center mt-2">
        <div className="text-[3.25rem] leading-none">🏆 {fmtR(restaurant.rating)} 🏆</div>
        <h2 className="text-[1.75rem] mt-2 leading-tight" style={{ fontWeight: 700 }}>Guest favorite</h2>
        <p className="text-[0.95rem] text-muted-foreground mt-2 leading-6">
          This home is in the top 5% of eligible listings based on ratings, reviews, and reliability
        </p>
        <button onClick={onShowHowReviewsWork} className="underline mt-2 text-[0.85rem] cursor-pointer">How reviews work</button>
      </div>

      <div className="mt-6 border-t border-border pt-4 grid grid-cols-2 gap-4">
        <div className="pr-2">
          <p className="text-[1rem] mb-3" style={{ fontWeight: 700 }}>Overall rating</p>
          <div className="space-y-1.5">
            {distribution.map((d) => (
              <div key={d.stars} className="grid grid-cols-[12px_1fr] items-center gap-2">
                <span className="text-[0.95rem] text-muted-foreground">{d.stars}</span>
                <div className="h-2 rounded-full bg-border/70 overflow-hidden">
                  <div className={`h-full rounded-full ${d.stars === 5 ? "bg-foreground" : "bg-muted-foreground/30"}`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pl-2 grid grid-cols-2 border-l border-border">
          {subRatings.map((m, idx) => (
            <div
              key={m.label}
              className={`px-4 py-2 ${idx % 2 === 0 ? "border-r border-border" : ""} ${idx < 2 ? "border-b border-border" : ""}`}
            >
              <p className="text-[0.85rem]">{m.label}</p>
              <p className="text-[1rem] mt-0.5" style={{ fontWeight: 700 }}>{m.value}</p>
              <p className="text-[0.95rem] mt-1.5">{m.icon}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
