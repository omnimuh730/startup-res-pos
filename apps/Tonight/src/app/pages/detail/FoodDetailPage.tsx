/* Full-screen food detail page */
import { useState } from "react";
import { ArrowLeft, Heart, Clock } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { MENU_IMAGES, FOOD_DETAILS } from "./restaurantDetailData";

export function FoodDetailPage({ item, restaurantName, onBack, onSave, isSaved }: {
  item: { name: string; desc: string; price: number; popular: boolean; category: string; image?: string };
  restaurantName: string;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}) {
  const [localSaved, setLocalSaved] = useState(isSaved ?? false);
  const details = FOOD_DETAILS[item.name] || {
    ingredients: ["Premium ingredients", "House-made sauce", "Fresh herbs", "Seasonal vegetables"],
    allergens: ["Please ask staff"],
    pairings: ["House wine", "Craft beer"],
    calories: 350,
    prepTime: "12 min",
  };
  const imageSrc = item.image || MENU_IMAGES[item.name] || "";

  return (
    <div className="fixed inset-0 z-[300] bg-background flex flex-col">
      {/* Hero Image */}
      <div className="relative h-56 sm:h-64 shrink-0">
        <ImageWithFallback src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        {onSave && (
          <button onClick={() => { onSave(); setLocalSaved(s => !s); }} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition">
            <Heart className={`w-5 h-5 ${localSaved ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        )}
        {item.popular && (
          <div className="absolute bottom-4 right-4">
            <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[0.6875rem]" style={{ fontWeight: 600 }}>Popular</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-20">
          <h1 className="text-white text-[1.5rem]" style={{ fontWeight: 700 }}>{item.name}</h1>
          <p className="text-white/80 text-[0.8125rem] mt-0.5">{restaurantName} · {item.category}</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4 space-y-6">
          {/* Price & quick info */}
          <div className="flex items-center justify-between">
            <p className="text-[1.5rem]" style={{ fontWeight: 700 }}>${item.price}</p>
            <div className="flex items-center gap-3 text-[0.8125rem] text-muted-foreground">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary"><Clock className="w-3.5 h-3.5" /> {details.prepTime}</span>
              <span className="px-3 py-1 rounded-full bg-secondary">{details.calories} cal</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl border border-border bg-card/50">
            <h4 className="text-[0.8125rem] mb-1.5" style={{ fontWeight: 600 }}>About this dish</h4>
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>

          {/* Ingredients */}
          <div>
            <h4 className="text-[0.875rem] mb-3" style={{ fontWeight: 600 }}>Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {details.ingredients.map((ing) => (
                <span key={ing} className="px-3 py-1.5 rounded-full bg-secondary text-[0.8125rem]">{ing}</span>
              ))}
            </div>
          </div>

          {/* Allergens */}
          {details.allergens.length > 0 && (
            <div>
              <h4 className="text-[0.875rem] mb-3" style={{ fontWeight: 600 }}>Allergens</h4>
              <div className="flex flex-wrap gap-2">
                {details.allergens.map((a) => (
                  <span key={a} className="px-3 py-1.5 rounded-full bg-warning/10 text-warning text-[0.8125rem]" style={{ fontWeight: 500 }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested pairings */}
          <div>
            <h4 className="text-[0.875rem] mb-3" style={{ fontWeight: 600 }}>Pairs well with</h4>
            <div className="flex flex-wrap gap-2">
              {details.pairings.map((p) => (
                <span key={p} className="px-3 py-1.5 rounded-full border border-border text-[0.8125rem] text-muted-foreground">🍷 {p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
