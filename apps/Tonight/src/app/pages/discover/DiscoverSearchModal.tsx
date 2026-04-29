import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Clock3,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

type SearchStep = "where" | "when" | "who";

interface SearchPlan {
  query: string;
  dateLabel: string;
  timeLabel: string;
  partySize: number;
  dateOffset: number;
}

interface DiscoverSearchModalProps {
  open: boolean;
  initialQuery: string;
  onClose: () => void;
  onSearch: (plan: SearchPlan) => void;
}

const recentSearches = ["Sakura Omakase", "Korean BBQ", "SoHo / Downtown", "French Bistro"];
const destinationSuggestions = [
  { label: "Near me", helper: "Find what's around you", icon: Navigation },
  { label: "Gangnam Station", helper: "512 restaurants", icon: MapPin },
  { label: "SoHo / Downtown", helper: "256 restaurants", icon: MapPin },
  { label: "Japanese Omakase", helper: "89 chef counters", icon: Sparkles },
];
const timeSlots = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
const dateOptions = [
  { label: "Tonight", offset: 0 },
  { label: "Tomorrow", offset: 1 },
  { label: "This weekend", offset: 5 },
  { label: "Next week", offset: 7 },
];

function formatReservationTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  const hour = Number(match[1]);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${match[2]} ${suffix}`;
}

function formatPeople(count: number) {
  return `${count} ${count === 1 ? "person" : "people"}`;
}

function formatPlanSummary(dateLabel: string, timeLabel: string, partySize: number) {
  return `${dateLabel}, ${formatReservationTime(timeLabel)}, ${formatPeople(partySize)}`;
}

export function DiscoverSearchModal({ open, initialQuery, onClose, onSearch }: DiscoverSearchModalProps) {
  const [activeStep, setActiveStep] = useState<SearchStep>("where");
  const [query, setQuery] = useState(initialQuery);
  const [dateLabel, setDateLabel] = useState("Tonight");
  const [dateOffset, setDateOffset] = useState(0);
  const [timeLabel, setTimeLabel] = useState("19:00");
  const [partySize, setPartySize] = useState(2);

  useEffect(() => {
    if (!open) return;
    setActiveStep("where");
    setQuery(initialQuery);
  }, [initialQuery, open]);

  const summary = useMemo(() => {
    const where = query.trim() || "Add restaurant, cuisine, or area";
    return `${where} - ${formatPlanSummary(dateLabel, timeLabel, partySize)}`;
  }, [dateLabel, partySize, query, timeLabel]);

  const clearAll = () => {
    setQuery("");
    setDateLabel("Tonight");
    setDateOffset(0);
    setTimeLabel("19:00");
    setPartySize(2);
    setActiveStep("where");
  };

  const goNext = () => {
    if (activeStep === "where") setActiveStep("when");
    else if (activeStep === "when") setActiveStep("who");
    else if (query.trim()) onSearch({ query: query.trim(), dateLabel, timeLabel, partySize, dateOffset });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[260] bg-white text-[#222222] safe-area-pad-top"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-[#DDDDDD] px-6 pb-3 pt-5">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-[#F7F7F7]"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
                <p className="text-[0.9375rem]" style={{ fontWeight: 700 }}>Start your search</p>
                <div className="w-9" />
              </div>
              <p className="mt-3 truncate text-[0.8125rem] text-[#717171]">{summary}</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[#F7F7F7] px-4 py-4">
              <SearchStepCard
                id="where"
                activeStep={activeStep}
                title="Where?"
                collapsedValue={query.trim() || "Search restaurants"}
                onActivate={setActiveStep}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Restaurant, location, or cuisine"
                    className="h-12 w-full rounded-full border border-[#DDDDDD] bg-white pl-11 pr-4 text-[0.9375rem] outline-none focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/10"
                  />
                </div>

                <div className="pt-4">
                  <p className="mb-2 text-[0.8125rem] text-[#717171]" style={{ fontWeight: 600 }}>Recent searches</p>
                  <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="shrink-0 cursor-pointer rounded-full border border-[#DDDDDD] bg-white px-4 py-2 text-[0.875rem]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-4">
                  <p className="mb-2 text-[0.8125rem] text-[#717171]" style={{ fontWeight: 600 }}>Suggested for you</p>
                  {destinationSuggestions.map(({ label, helper, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => setQuery(label === "Near me" ? "Gangnam Station" : label)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-2 py-2.5 text-left hover:bg-[#F7F7F7]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2F2F2]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.9375rem]" style={{ fontWeight: 600 }}>{label}</span>
                        <span className="block text-[0.8125rem] text-[#717171]">{helper}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </SearchStepCard>

              <SearchStepCard
                id="when"
                activeStep={activeStep}
                title="When?"
                collapsedValue={`${dateLabel}, ${formatReservationTime(timeLabel)}`}
                onActivate={setActiveStep}
              >
                <div className="inline-flex rounded-full bg-[#F2F2F2] p-1">
                  <button className="rounded-full bg-white px-4 py-2 text-[0.875rem] shadow-sm" style={{ fontWeight: 700 }}>Date</button>
                  <button className="rounded-full px-4 py-2 text-[0.875rem] text-[#717171]">Flexible</button>
                </div>

                <div className="pt-5">
                  <p className="mb-3 text-[0.9375rem]" style={{ fontWeight: 700 }}>Pick a day</p>
                  <div className="grid grid-cols-2 gap-2">
                    {dateOptions.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => {
                          setDateLabel(option.label);
                          setDateOffset(option.offset);
                        }}
                        className={`cursor-pointer rounded-2xl border px-4 py-3 text-left text-[0.875rem] ${
                          dateLabel === option.label ? "border-[#222222] bg-[#222222] text-white" : "border-[#DDDDDD] bg-white"
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-5">
                  <p className="mb-3 text-[0.9375rem]" style={{ fontWeight: 700 }}>Pick a time</p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTimeLabel(slot)}
                        className={`cursor-pointer rounded-2xl border px-3 py-3 text-left text-[0.8125rem] ${
                          timeLabel === slot ? "border-[#222222] bg-[#222222] text-white" : "border-[#DDDDDD] bg-white"
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        <Clock3 className="mb-1 h-4 w-4" />
                        {formatReservationTime(slot)}
                      </button>
                    ))}
                  </div>
                </div>
              </SearchStepCard>

              <SearchStepCard
                id="who"
                activeStep={activeStep}
                title="Who?"
                collapsedValue={formatPeople(partySize)}
                onActivate={setActiveStep}
              >
                <StepperRow
                  label="People"
                  helper="Total guests for the table"
                  value={partySize}
                  min={1}
                  onChange={setPartySize}
                />
              </SearchStepCard>
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-[#DDDDDD] bg-white px-6 py-4">
              <button onClick={clearAll} className="cursor-pointer text-[0.9375rem] underline" style={{ fontWeight: 700 }}>Clear all</button>
              <button
                onClick={goNext}
                disabled={activeStep === "who" && !query.trim()}
                className="flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[#E31C5F] px-7 text-[0.9375rem] text-white disabled:cursor-not-allowed disabled:opacity-40"
                style={{ fontWeight: 700 }}
              >
                {activeStep === "who" && <Search className="h-4 w-4" />}
                {activeStep === "who" ? "Search" : "Next"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchStepCard({
  id,
  activeStep,
  title,
  collapsedValue,
  onActivate,
  children,
}: {
  id: SearchStep;
  activeStep: SearchStep;
  title: string;
  collapsedValue: string;
  onActivate: (step: SearchStep) => void;
  children: ReactNode;
}) {
  const active = activeStep === id;

  return (
    <section className={`rounded-[1.5rem] bg-white p-5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all ${active ? "border-2 border-[#222222]" : "border border-transparent"}`}>
      <button onClick={() => onActivate(id)} className="flex w-full cursor-pointer items-center justify-between gap-3 text-left">
        <span className="text-[1.25rem]" style={{ fontWeight: 700 }}>{title}</span>
        {!active && (
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[0.875rem] text-[#717171]">{collapsedValue}</span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </span>
        )}
      </button>
      <div className={`grid transition-[grid-template-rows,opacity] duration-[250ms] ease-in-out ${active ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

function StepperRow({
  label,
  helper,
  value,
  min = 0,
  onChange,
}: {
  label: string;
  helper: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{label}</p>
        <p className="text-[0.8125rem] text-[#717171]">{helper}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#B0B0B0] disabled:opacity-35"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-5 text-center text-[0.9375rem]" style={{ fontWeight: 700 }}>{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#B0B0B0]"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export type { SearchPlan };
