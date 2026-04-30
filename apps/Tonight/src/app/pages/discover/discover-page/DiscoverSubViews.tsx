import { useNavigate } from "react-router";
import type { MutableRefObject } from "react";
import { RestaurantDetailView } from "../../detail/RestaurantDetailView";
import type { RestaurantData } from "../../detail/RestaurantDetailView";
import { BookTableFlow } from "../../booking/BookTableFlow";
import type { SearchResults, SearchResultLocation, SearchResultFood, SearchResultChef } from "../discoverTypes";
import { searchResultToRestaurantData, filterSearchResults, ALL_SECTION_DATA } from "../discoverSearchData";
import { SearchResultsView } from "../SearchResultsView";
import { LocationResultsView } from "../LocationResultsView";
import { FoodResultsView } from "../FoodResultsView";
import { CategoryResultsView } from "../CategoryResultsView";
import { SectionListView } from "../SectionListView";
import { NewsListPage, NewsDetailPage, MOCK_NEWS } from "../NewsSection";
import type { SearchPlan } from "../DiscoverSearchModal";
import { formatSearchPlanSummary } from "./discoverFormatters";

export function DiscoverSubViews({
  detailRestaurant,
  bookingRestaurant,
  bookingReservationPlan,
  selectedLocation,
  selectedFood,
  selectedCategory,
  viewingSection,
  showSearchResults,
  viewingNewsList,
  viewingNewsItem,
  searchQuery,
  searchResults,
  searchPlan,
  debounceRef,
  setDetailRestaurant,
  setBookingRestaurant,
  setSelectedLocation,
  setSelectedFood,
  setSelectedCategory,
  setViewingSection,
  setSearchQuery,
  setSearchResults,
  setShowSearchModal,
  toggleSaveRestaurant,
  toggleSaveFood,
  toggleSaveFoodName,
  isRestaurantSaved,
  savedFoodsRef,
  savedFoodNames,
  restoreScrollPos,
  handleSearchBack,
  handleSelectLocation,
  handleSelectFood,
  handleSelectChef,
}: {
  detailRestaurant: RestaurantData | null;
  bookingRestaurant: RestaurantData | null;
  bookingReservationPlan: SearchPlan | undefined;
  selectedLocation: SearchResultLocation | null;
  selectedFood: SearchResultFood | null;
  selectedCategory: { id: string; label: string; icon?: string } | null;
  viewingSection: string | null;
  showSearchResults: boolean;
  viewingNewsList: boolean;
  viewingNewsItem: (typeof MOCK_NEWS)[0] | null;
  searchQuery: string;
  searchResults: SearchResults;
  searchPlan: SearchPlan | null;
  debounceRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setDetailRestaurant: (r: RestaurantData | null) => void;
  setBookingRestaurant: (r: RestaurantData | null) => void;
  setSelectedLocation: (l: SearchResultLocation | null) => void;
  setSelectedFood: (f: SearchResultFood | null) => void;
  setSelectedCategory: (c: { id: string; label: string; icon?: string } | null) => void;
  setViewingSection: (s: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSearchResults: (r: SearchResults) => void;
  setShowSearchModal: (v: boolean) => void;
  toggleSaveRestaurant: (r: RestaurantData) => void;
  toggleSaveFood: (f: SearchResultFood) => void;
  toggleSaveFoodName: (name: string) => void;
  isRestaurantSaved: (id: string) => boolean;
  savedFoodsRef: MutableRefObject<{ id: string }[]>;
  savedFoodNames: string[];
  restoreScrollPos: () => void;
  handleSearchBack: () => void;
  handleSelectLocation: (loc: SearchResultLocation) => void;
  handleSelectFood: (f: SearchResultFood) => void;
  handleSelectChef: (c: SearchResultChef) => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      {detailRestaurant && (
        <>
          <RestaurantDetailView
            restaurant={detailRestaurant}
            onBack={() => {
              setDetailRestaurant(null);
              restoreScrollPos();
            }}
            onBookTable={(r) => setBookingRestaurant(r)}
            onDirections={(r) => navigate(`/discover/search?q=${encodeURIComponent(r.name)}`)}
            onSave={toggleSaveRestaurant}
            isSaved={isRestaurantSaved(detailRestaurant.id)}
            onSaveFood={toggleSaveFoodName}
            savedFoodNames={savedFoodNames}
          />
          {bookingRestaurant && (
            <BookTableFlow
              restaurant={bookingRestaurant}
              initialReservation={bookingReservationPlan}
              onBack={() => setBookingRestaurant(null)}
              onComplete={() => {
                setBookingRestaurant(null);
                setDetailRestaurant(null);
              }}
            />
          )}
        </>
      )}

      {selectedLocation && !detailRestaurant && (
        <LocationResultsView
          location={selectedLocation}
          onBack={() => {
            setSelectedLocation(null);
            restoreScrollPos();
          }}
          onSelectRestaurant={(r) => setDetailRestaurant(r)}
          onSaveRestaurant={toggleSaveRestaurant}
          isRestaurantSaved={isRestaurantSaved}
        />
      )}
      {selectedFood && !detailRestaurant && (
        <FoodResultsView
          food={selectedFood}
          onBack={() => {
            setSelectedFood(null);
            restoreScrollPos();
          }}
          onSaveFood={toggleSaveFood}
          isFoodSaved={savedFoodsRef.current.some((s) => s.id === selectedFood.id)}
          onSaveFoodName={toggleSaveFoodName}
          savedFoodNames={savedFoodNames}
        />
      )}
      {selectedCategory && !detailRestaurant && (
        <>
          <CategoryResultsView
            category={selectedCategory}
            onBack={() => {
              setSelectedCategory(null);
              restoreScrollPos();
            }}
            onSelectRestaurant={(r) => setDetailRestaurant(r)}
            onBookTable={(r) => setBookingRestaurant(r)}
            onSaveRestaurant={toggleSaveRestaurant}
          />
          {bookingRestaurant && (
            <BookTableFlow
              restaurant={bookingRestaurant}
              onBack={() => setBookingRestaurant(null)}
              onComplete={() => setBookingRestaurant(null)}
            />
          )}
        </>
      )}
      {viewingSection && ALL_SECTION_DATA[viewingSection] && !detailRestaurant && (
        <SectionListView
          title={ALL_SECTION_DATA[viewingSection].title}
          items={ALL_SECTION_DATA[viewingSection].items}
          onBack={() => {
            setViewingSection(null);
            restoreScrollPos();
          }}
          onSelectRestaurant={(r) => setDetailRestaurant(r)}
          onSaveRestaurant={toggleSaveRestaurant}
          isRestaurantSaved={isRestaurantSaved}
        />
      )}
      {viewingNewsList && <NewsListPage onBack={() => navigate("/discover")} onSelect={(id) => navigate(`/discover/news/${id}`)} />}
      {viewingNewsItem && (
        <NewsDetailPage item={viewingNewsItem} onBack={() => navigate("/discover/news")} onSelect={(id) => navigate(`/discover/news/${id}`)} />
      )}
      {showSearchResults && !detailRestaurant && !selectedLocation && !selectedFood && (
        <SearchResultsView
          query={searchQuery}
          results={searchResults}
          summary={searchPlan ? formatSearchPlanSummary(searchPlan) : undefined}
          onBack={handleSearchBack}
          onChangeQuery={(q) => {
            setSearchQuery(q);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              setSearchResults(filterSearchResults(q));
            }, 400);
          }}
          onOpenSearch={() => setShowSearchModal(true)}
          onSelectLocation={handleSelectLocation}
          onSelectRestaurant={(r) => setDetailRestaurant(searchResultToRestaurantData(r))}
          onSelectFood={handleSelectFood}
          onSelectChef={handleSelectChef}
        />
      )}
    </>
  );
}
