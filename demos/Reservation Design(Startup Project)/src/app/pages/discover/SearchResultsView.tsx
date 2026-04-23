/* Full-Page Search Results View */
import { useRef } from "react";
import { Search, X, ArrowLeft, MapPin, Utensils, ChefHat } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { HighlightText } from "./SaveButtons";
import type { SearchResults, SearchResultLocation, SearchResultRestaurant, SearchResultFood, SearchResultChef } from "./discoverTypes";

export function SearchResultsView({ query, results, onBack, onChangeQuery, onSelectLocation, onSelectRestaurant, onSelectFood, onSelectChef }: {
  query: string;
  results: SearchResults;
  onBack: () => void;
  onChangeQuery: (q: string) => void;
  onSelectLocation: (loc: SearchResultLocation) => void;
  onSelectRestaurant: (r: SearchResultRestaurant) => void;
  onSelectFood: (f: SearchResultFood) => void;
  onSelectChef: (c: SearchResultChef) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasResults = results.locations.length + results.restaurants.length + results.foods.length + results.chefs.length > 0;

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-1.5 hover:bg-secondary rounded-full transition cursor-pointer shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-secondary/50 border border-border rounded-xl text-[0.875rem] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            autoFocus
          />
          {query && (
            <button onClick={() => onChangeQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {!hasResults && query.trim() && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-[0.875rem]">No results found for "<span style={{ fontWeight: 600 }}>{query}</span>"</p>
          <p className="text-muted-foreground/60 text-[0.75rem] mt-1">Try different keywords or check spelling</p>
        </div>
      )}

      {results.locations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[1rem] mb-3" style={{ fontWeight: 700 }}>Location</h3>
          <div className="space-y-1">
            {results.locations.map((loc) => (
              <button key={loc.id} onClick={() => onSelectLocation(loc)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/50 transition cursor-pointer text-left">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="flex-1 text-[0.875rem]"><HighlightText text={loc.name} query={query} /></span>
                <span className="text-[0.8125rem] text-primary" style={{ fontWeight: 500 }}>{loc.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {results.restaurants.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[1rem] mb-3" style={{ fontWeight: 700 }}>Restaurant</h3>
          <div className="space-y-1">
            {results.restaurants.map((r) => (
              <button key={r.id} onClick={() => onSelectRestaurant(r)} className="w-full flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-secondary/50 transition cursor-pointer text-left">
                <ImageWithFallback src={r.image} alt={r.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875rem]" style={{ fontWeight: 600 }}><HighlightText text={r.name} query={query} /></p>
                  <p className="text-[0.75rem] text-muted-foreground mt-0.5"><HighlightText text={r.subtitle} query={query} /></p>
                  <p className="text-[0.6875rem] text-muted-foreground/70 mt-0.5 line-clamp-2">{r.address}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {results.foods.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[1rem] mb-3" style={{ fontWeight: 700 }}>Food</h3>
          <div className="space-y-1">
            {results.foods.map((f) => (
              <button key={f.id} onClick={() => onSelectFood(f)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/50 transition cursor-pointer text-left">
                <Utensils className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-[0.875rem]"><HighlightText text={f.name} query={query} /></span>
                <span className="text-[0.75rem] text-muted-foreground">{f.count} spots</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {results.chefs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[1rem] mb-3" style={{ fontWeight: 700 }}>People</h3>
          <div className="space-y-1">
            {results.chefs.map((c) => (
              <button key={c.id} onClick={() => onSelectChef(c)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/50 transition cursor-pointer text-left">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <ImageWithFallback src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875rem]" style={{ fontWeight: 600 }}><HighlightText text={c.name} query={query} /></p>
                  <p className="text-[0.6875rem] text-muted-foreground flex items-center gap-1">
                    <ChefHat className="w-3 h-3" /> {c.restaurant}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
