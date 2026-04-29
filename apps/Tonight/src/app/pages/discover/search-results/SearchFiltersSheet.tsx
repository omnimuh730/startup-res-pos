import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Check, X, Zap } from "lucide-react";
import {
  AMENITY_OPTIONS,
  CUISINE_OPTIONS,
  DISTANCE_OPTIONS,
  OCCASION_OPTIONS,
  PRICE_OPTIONS,
  RATING_OPTIONS,
  SEATING_OPTIONS,
  SORT_OPTIONS,
} from "../../explorer/explorerData";
import { getFilterCount, toggleFilterValue } from "./filterUtils";
import type { SearchFilterState } from "./types";

export function SearchFiltersSheet({
  filters,
  onChange,
  onClose,
  onClear,
  onApply,
  resultCount,
}: {
  filters: SearchFilterState;
  onChange: (filters: SearchFilterState) => void;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  resultCount: number;
}) {
  const activeCount = getFilterCount(filters);
  const update = (patch: Partial<SearchFilterState>) => onChange({ ...filters, ...patch });
  const toggleList = (key: "prices" | "cuisines" | "amenities" | "occasions" | "seating", value: string) => {
    update({ [key]: toggleFilterValue(filters[key], value) });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex justify-center bg-black/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute bottom-0 flex h-[min(88vh,760px)] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[1.75rem] bg-white text-[#222222] shadow-[0_-18px_50px_rgba(0,0,0,0.2)]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 34, stiffness: 320 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex h-14 shrink-0 items-center justify-center border-b border-[#DDDDDD]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F7F7F7]"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-[1rem]" style={{ fontWeight: 800 }}>Filters</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-28 pt-6">
          <FilterSection title="Sort by">
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <FilterPill
                  key={option}
                  label={option}
                  active={filters.sortBy === option}
                  onClick={() => update({ sortBy: option })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Recommended for you">
            <div className="grid grid-cols-3 gap-3">
              <RecommendedFilterCard
                label="Open now"
                active={filters.openNow}
                icon={<span className="text-[1.65rem]">●</span>}
                onClick={() => update({ openNow: !filters.openNow })}
              />
              <RecommendedFilterCard
                label="Instant Book"
                active={filters.instantBook}
                icon={<Zap className="h-8 w-8 text-[#FF385C]" />}
                onClick={() => update({ instantBook: !filters.instantBook })}
              />
              <RecommendedFilterCard
                label="Parking"
                active={filters.amenities.includes("Parking")}
                icon={<span className="text-[1.75rem]">P</span>}
                onClick={() => toggleList("amenities", "Parking")}
              />
            </div>
          </FilterSection>

          <FilterSection title="Cuisine">
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.slice(0, 12).map((option) => (
                <FilterPill
                  key={option.label}
                  label={option.label}
                  active={filters.cuisines.includes(option.label)}
                  onClick={() => toggleList("cuisines", option.label)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Price range" subtitle="Average table price, includes fees">
            <div className="mb-4 mt-3 flex h-20 items-end gap-1">
              {Array.from({ length: 34 }).map((_, index) => {
                const height = 8 + Math.round(Math.sin((index / 33) * Math.PI) * 54) + (index % 5) * 3;
                return <span key={index} className="flex-1 rounded-t-sm bg-[#FF385C]" style={{ height }} />;
              })}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRICE_OPTIONS.map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => toggleList("prices", price)}
                  className={`h-11 rounded-full border text-[0.875rem] transition ${
                    filters.prices.includes(price) ? "border-[#222222] bg-[#222222] text-white" : "border-[#DDDDDD] bg-white text-[#222222]"
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {price}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Rating">
            <div className="flex flex-wrap gap-2">
              {RATING_OPTIONS.map((rating) => (
                <FilterPill
                  key={rating}
                  label={rating}
                  active={filters.rating === rating}
                  onClick={() => update({ rating })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Distance">
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map((distance) => (
                <FilterPill
                  key={distance}
                  label={distance}
                  active={filters.distance === distance}
                  onClick={() => update({ distance })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Amenities">
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((option) => (
                <FilterPill
                  key={option.label}
                  label={option.label}
                  active={filters.amenities.includes(option.label)}
                  onClick={() => toggleList("amenities", option.label)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Seating">
            <div className="flex flex-wrap gap-2">
              {SEATING_OPTIONS.map((option) => (
                <FilterPill
                  key={option.label}
                  label={option.label}
                  active={filters.seating.includes(option.label)}
                  onClick={() => toggleList("seating", option.label)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Occasion">
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map((option) => (
                <FilterPill
                  key={option.label}
                  label={option.label}
                  active={filters.occasions.includes(option.label)}
                  onClick={() => toggleList("occasions", option.label)}
                />
              ))}
            </div>
          </FilterSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 border-t border-[#DDDDDD] bg-white/95 px-6 py-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
            className="text-[0.9375rem] underline disabled:text-[#B0B0B0] disabled:no-underline"
            style={{ fontWeight: 700 }}
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-lg bg-[#222222] px-7 py-3 text-[0.9375rem] text-white disabled:bg-[#DDDDDD]"
            style={{ fontWeight: 800 }}
            disabled={resultCount === 0}
          >
            {resultCount > 0 ? "Show 1,000+ places" : "No matches"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FilterSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="border-b border-[#EBEBEB] py-6 first:pt-0">
      <h3 className="text-[1.125rem] text-[#222222]" style={{ fontWeight: 800 }}>{title}</h3>
      {subtitle && <p className="mt-0.5 text-[0.875rem] text-[#717171]">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RecommendedFilterCard({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="text-center">
      <span className={`relative flex aspect-square items-center justify-center rounded-xl border bg-white transition ${
        active ? "border-[#222222] ring-2 ring-[#222222]" : "border-[#DDDDDD]"
      }`}>
        {icon}
        {active && (
          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#222222] text-white">
            <Check className="h-3 w-3" />
          </span>
        )}
      </span>
      <span className="mt-2 block text-[0.8125rem] text-[#222222]">{label}</span>
    </button>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-[0.875rem] transition ${
        active ? "border-[#222222] bg-[#222222] text-white" : "border-[#DDDDDD] bg-white text-[#222222]"
      }`}
      style={{ fontWeight: active ? 700 : 500 }}
    >
      {label}
    </button>
  );
}
