import { motion, useDragControls } from "motion/react";
import { Search } from "lucide-react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { RestaurantResultCard } from "./ResultCards";
import type { MappedSearchRestaurant, SheetState } from "./types";
import { getNearestSheetState, getSheetY } from "./filterUtils";

type SearchResultsSheetProps = {
  filteredRestaurants: MappedSearchRestaurant[];
  query: string;
  activeFilterCount: number;
  sheetState: SheetState;
  setSheetState: (state: SheetState) => void;
  setPreviewIndex: (index: number | null) => void;
  onSelectRestaurant: (restaurant: MappedSearchRestaurant) => void;
  sheetRef: RefObject<HTMLElement | null>;
  peekHeaderRef: RefObject<HTMLButtonElement | null>;
  resultsListRef: RefObject<HTMLDivElement | null>;
  sheetHeight: number;
  peekHeight: number;
  sheetY: number;
  listPullOffset: number;
  searchHeaderHeight: number;
  peekHeaderHeight: number;
  onListPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onListPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onListPointerEnd: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onListPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

export function SearchResultsSheet({
  filteredRestaurants,
  query,
  activeFilterCount,
  sheetState,
  setSheetState,
  setPreviewIndex,
  onSelectRestaurant,
  sheetRef,
  peekHeaderRef,
  resultsListRef,
  sheetHeight,
  peekHeight,
  sheetY,
  listPullOffset,
  searchHeaderHeight,
  peekHeaderHeight,
  onListPointerDown,
  onListPointerMove,
  onListPointerEnd,
  onListPointerCancel,
}: SearchResultsSheetProps) {
  const hasResults = filteredRestaurants.length > 0;
  const isPeek = sheetState === "peek";
  const title = hasResults ? "Over 1,000 results" : "No restaurants found";
  const dragControls = useDragControls();
  const animatedSheetY = sheetY + listPullOffset;
  const startSheetDrag = (event: ReactPointerEvent<HTMLElement>) => {
    setPreviewIndex(null);
    dragControls.start(event, { snapToCursor: false });
  };

  return (
    <motion.section
      ref={sheetRef}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragElastic={0.08}
      dragMomentum={false}
      dragConstraints={{ top: 0, bottom: getSheetY("peek", sheetHeight, peekHeight) }}
      onDragStart={() => setPreviewIndex(null)}
      onDragEnd={(_, info) => {
        const projectedY = sheetY + info.offset.y + info.velocity.y * 0.22;
        if (info.velocity.y < -980) return setSheetState("full");
        if (info.velocity.y > 980) return setSheetState(sheetState === "full" ? "half" : "peek");
        setSheetState(getNearestSheetState(projectedY, sheetHeight, peekHeight));
      }}
      animate={{ y: animatedSheetY }}
      transition={
        listPullOffset > 0
          ? { type: "spring", damping: 38, stiffness: 420, mass: 0.72, restDelta: 0.5, restSpeed: 10 }
          : { type: "spring", damping: 31, stiffness: 255, mass: 0.86, restDelta: 0.5, restSpeed: 8 }
      }
      className="absolute bottom-0 left-0 right-0 z-20 rounded-t-[1.75rem] bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.12)]"
      style={{ top: searchHeaderHeight, touchAction: sheetState === "full" ? "pan-y" : "none", willChange: "transform" }}
    >
      <button
        ref={peekHeaderRef}
        type="button"
        onClick={() => {
          setPreviewIndex(null);
          setSheetState((current) => (current === "peek" ? "half" : current === "half" ? "full" : "half"));
        }}
        className="block w-full cursor-grab px-5 pb-3 pt-2 active:cursor-grabbing"
        aria-label={isPeek ? "Show results list" : "Move results list"}
        onPointerDown={(event) => startSheetDrag(event)}
      >
        <span className="mx-auto block h-1 w-10 rounded-full bg-[#D1D1D1]" />
        <span className="mt-3 block text-center text-[1rem] text-[#222222]" style={{ fontWeight: 700 }}>{title}</span>
      </button>

      {!hasResults ? (
        <div className={`px-6 py-12 text-center transition-opacity ${isPeek ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          <Search className="mx-auto mb-3 h-11 w-11 text-[#717171]/30" />
          <p className="text-[0.9375rem] text-[#222222]" style={{ fontWeight: 700 }}>
            {activeFilterCount > 0 ? "No restaurants match these filters" : `No results for "${query}"`}
          </p>
          <p className="mt-1 text-[0.8125rem] text-[#717171]">
            {activeFilterCount > 0 ? "Clear a few filters to see more places." : "Try a cuisine, restaurant name, or neighborhood."}
          </p>
        </div>
      ) : (
        <div
          ref={resultsListRef}
          onPointerDown={(event) => {
            if (sheetState !== "full") {
              startSheetDrag(event);
              return;
            }
            onListPointerDown(event);
          }}
          onPointerMove={onListPointerMove}
          onPointerUp={onListPointerEnd}
          onPointerCancel={onListPointerCancel}
          onWheel={(event) => {
            if (sheetState === "full" && (resultsListRef.current?.scrollTop ?? 0) <= 1 && event.deltaY < -28) {
              setPreviewIndex(null);
              setSheetState("half");
            }
          }}
          className={`px-4 pb-0 transition-opacity ${
            isPeek ? "pointer-events-none overflow-hidden opacity-0" : sheetState === "full" ? "cursor-grab overflow-y-auto overscroll-contain opacity-100 active:cursor-grabbing" : "cursor-grab overflow-hidden opacity-100 active:cursor-grabbing"
          }`}
          style={{ height: `calc(100% - ${Math.round(peekHeaderHeight)}px)`, paddingBottom: sheetState === "full" ? "5rem" : "1.5rem" }}
        >
          <div className="space-y-6">
            {filteredRestaurants.map((restaurant, index) => (
              <RestaurantResultCard key={restaurant.id} restaurant={restaurant} index={index} onSelect={() => onSelectRestaurant(restaurant)} />
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
