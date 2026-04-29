/* Food Category Results Page */
import { useState } from "react";
import { ArrowLeft, Heart, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { FoodNameSaveBtn } from "./SaveButtons";
import { generateDishesForFoodType } from "./discoverDishData";
import { FoodDetailPage } from "../detail/RestaurantDetailView";
import type { SearchResultFood } from "./discoverTypes";

export function FoodResultsView({ food, onBack, onSaveFood, isFoodSaved, onSaveFoodName, savedFoodNames = [] }: {
  food: SearchResultFood;
  onBack: () => void;
  onSaveFood?: (f: SearchResultFood) => void;
  isFoodSaved?: boolean;
  onSaveFoodName?: (name: string) => void;
  savedFoodNames?: string[];
}) {
  const dishes = generateDishesForFoodType(food.id, food.name);
  const [selectedDish, setSelectedDish] = useState<typeof dishes[0] | null>(null);

  if (selectedDish) {
    return (
      <FoodDetailPage
        item={{
          name: selectedDish.name,
          desc: selectedDish.desc,
          price: selectedDish.price,
          popular: selectedDish.popular,
          category: food.name,
          image: selectedDish.image,
        }}
        restaurantName={selectedDish.restaurant}
        onBack={() => setSelectedDish(null)}
        onSave={onSaveFood ? () => onSaveFood(food) : undefined}
        isSaved={isFoodSaved}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {food.image ? (
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-5">
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <ImageWithFallback src={food.image} alt={food.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button type="button" onClick={onBack} className="absolute top-4 left-4 p-1.5 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            {onSaveFood && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSaveFood(food);
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition"
              >
                <Heart className={`w-5 h-5 ${isFoodSaved ? "fill-red-500 text-red-500" : "text-white"}`} />
              </button>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-[1.5rem]" style={{ fontWeight: 800 }}>{food.name}</h2>
              <p className="text-white/70 text-[0.8125rem] mt-0.5">{dishes.length} dishes</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={onBack} className="p-1.5 hover:bg-secondary rounded-full transition cursor-pointer shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-[1.125rem]" style={{ fontWeight: 700 }}>{food.name}</h2>
            <p className="text-[0.75rem] text-muted-foreground">{dishes.length} dishes</p>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {dishes.map((dish, i) => (
          <div key={`${dish.name}-${i}`} onClick={() => setSelectedDish(dish)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-secondary/30 active:bg-secondary/50 transition cursor-pointer text-left">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <ImageWithFallback src={dish.image || food.image || ""} alt={dish.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>{dish.name}</p>
                {dish.popular && (
                  <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[0.6875rem] shrink-0" style={{ fontWeight: 500 }}>Popular</span>
                )}
              </div>
              <p className="text-[0.75rem] text-muted-foreground mt-0.5 line-clamp-1">{dish.desc}</p>
              <div className="flex items-center gap-3 mt-1 text-[0.75rem]">
                <span style={{ fontWeight: 600 }}>${dish.price}</span>
                <span className="text-muted-foreground">at {dish.restaurant}</span>
              </div>
            </div>
            {onSaveFoodName ? (
              <FoodNameSaveBtn name={dish.name} onToggle={onSaveFoodName} />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
