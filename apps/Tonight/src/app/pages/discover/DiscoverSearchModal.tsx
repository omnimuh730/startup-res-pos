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
const timeSlots = ["Breakfast", "Lunch", "Dinner", "Late night"];
const dateChips = ["Today", "Tomorrow", "This weekend", "Next week"];

export function DiscoverSearchModal({ open, initialQuery, onClose, onSearch }: DiscoverSearchModalProps) {
  const [activeStep, setActiveStep] = useState<SearchStep>("where");
  const [query, setQuery] = useState(initialQuery);
  const [dateLabel, setDateLabel] = useState("Tonight");
  const [timeLabel, setTimeLabel] = useState("7:00 PM");
  const [partySize, setPartySize] = useState(2);
  const [highChair, setHighChair] = useState(false);

  useEffect(() => {
    if (!open) return;
    setActiveStep("where");
    setQuery(initialQuery);
  }, [initialQuery, open]);

  const footerLabel = activeStep === "who" ? "Search" : "Next";
  const summary = useMemo(() => {
    const where = query.trim() || "Add restaurant, cuisine, or area";
    return `${where} · ${dateLabel} ${timeLabel} · ${partySize} ${partySize === 1 ? "person" : "people"}`;
  }, [dateLabel, partySize, query, timeLabel]);

  const clearAll = () => {
    setQuery("");
    setDateLabel("Tonight");
    setTimeLabel("7:00 PM");
    setPartySize(2);
    setHighChair(false);
    setActiveStep("where");
  };

  const goNext = () => {
    if (activeStep === "where") setActiveStep("when");
    else if (activeStep === "when") setActiveStep("who");
    else if (query.trim()) onSearch({ query: query.trim(), dateLabel, timeLabel, partySize });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[260] bg-white text-[#222222]"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        >
          <div className="h-full flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-[#DDDDDD]">
              <div className="flex items-center justify-between">
                <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center cursor-pointer" aria-label="Close search">
                  <X className="w-5 h-5" />
                </button>
                <p className="text-[0.9375rem]" style={{ fontWeight: 700 }}>Start your search</p>
                <div className="w-9" />
              </div>
              <p className="mt-3 text-[0.8125rem] text-[#717171] truncate">{summary}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F7F7F7]">
              <SearchStepCard
                id="where"
                activeStep={activeStep}
                title="Where?"
                collapsedValue={query.trim() || "Search destinations"}
                onActivate={setActiveStep}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Restaurant, location, or cuisine"
                    className="w-full h-12 rounded-full border border-[#DDDDDD] bg-white pl-11 pr-4 outline-none focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/10 text-[0.9375rem]"
                  />
                </div>

                <div className="pt-4">
                  <p className="text-[0.8125rem] text-[#717171] mb-2" style={{ fontWeight: 600 }}>Recent searches</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {recentSearches.map((item) => (
                      <button key={item} onClick={() => setQuery(item)} className="shrink-0 rounded-full border border-[#DDDDDD] bg-white px-4 py-2 text-[0.875rem] cursor-pointer">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-1">
                  <p className="text-[0.8125rem] text-[#717171] mb-2" style={{ fontWeight: 600 }}>Suggested for you</p>
                  {destinationSuggestions.map(({ label, helper, icon: Icon }) => (
                    <button key={label} onClick={() => setQuery(label === "Near me" ? "Gangnam Station" : label)} className="w-full flex items-center gap-3 rounded-2xl px-2 py-2.5 hover:bg-[#F7F7F7] cursor-pointer text-left">
                      <span className="w-11 h-11 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
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
                collapsedValue={`${dateLabel} · ${timeLabel}`}
                onActivate={setActiveStep}
              >
                <div className="inline-flex rounded-full bg-[#F2F2F2] p-1">
                  <button className="rounded-full bg-white px-4 py-2 text-[0.875rem] shadow-sm" style={{ fontWeight: 700 }}>Dates</button>
                  <button className="rounded-full px-4 py-2 text-[0.875rem] text-[#717171]">Flexible</button>
                </div>

                <div className="pt-5">
                  <p className="text-[0.9375rem] mb-3" style={{ fontWeight: 700 }}>Pick a day</p>
                  <div className="grid grid-cols-2 gap-2">
                    {dateChips.map((chip) => (
                      <button key={chip} onClick={() => setDateLabel(chip === "Today" ? "Tonight" : chip)} className={`rounded-2xl border px-4 py-3 text-left text-[0.875rem] cursor-pointer ${dateLabel === chip || (chip === "Today" && dateLabel === "Tonight") ? "border-[#222222] bg-[#222222] text-white" : "border-[#DDDDDD] bg-white"}`} style={{ fontWeight: 600 }}>
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-5">
                  <p className="text-[0.9375rem] mb-3" style={{ fontWeight: 700 }}>Time</p>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button key={slot} onClick={() => setTimeLabel(slot)} className={`rounded-2xl border px-4 py-3 text-left text-[0.875rem] cursor-pointer ${timeLabel === slot ? "border-[#222222] bg-[#222222] text-white" : "border-[#DDDDDD] bg-white"}`} style={{ fontWeight: 600 }}>
                        <Clock3 className="w-4 h-4 mb-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </SearchStepCard>

              <SearchStepCard
                id="who"
                activeStep={activeStep}
                title="Who?"
                collapsedValue={`${partySize} ${partySize === 1 ? "person" : "people"}`}
                onActivate={setActiveStep}
              >
                <StepperRow
                  label="Guests"
                  helper="Adults and children"
                  value={partySize}
                  min={1}
                  onChange={setPartySize}
                />
                <div className="border-t border-[#DDDDDD]" />
                <button onClick={() => setHighChair((v) => !v)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer">
                  <span>
                    <span className="block text-[0.9375rem]" style={{ fontWeight: 600 }}>High chair</span>
                    <span className="block text-[0.8125rem] text-[#717171]">Let the restaurant prepare one</span>
                  </span>
                  <span className={`w-12 h-7 rounded-full p-0.5 transition-colors ${highChair ? "bg-[#E31C5F]" : "bg-[#DDDDDD]"}`}>
                    <span className={`block w-6 h-6 rounded-full bg-white transition-transform ${highChair ? "translate-x-5" : ""}`} />
                  </span>
                </button>
              </SearchStepCard>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#DDDDDD] px-6 py-4 flex items-center justify-between gap-4">
              <button onClick={clearAll} className="underline text-[0.9375rem] cursor-pointer" style={{ fontWeight: 700 }}>Clear all</button>
              <button
                onClick={goNext}
                disabled={activeStep === "who" && !query.trim()}
                className="h-12 px-7 rounded-full bg-[#E31C5F] text-white text-[0.9375rem] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                style={{ fontWeight: 700 }}
              >
                {activeStep === "who" && <Search className="w-4 h-4" />}
                {footerLabel}
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
      <button onClick={() => onActivate(id)} className="w-full flex items-center justify-between gap-3 text-left cursor-pointer">
        <span className="text-[1.25rem]" style={{ fontWeight: 700 }}>{title}</span>
        {!active && (
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-[0.875rem] text-[#717171] truncate">{collapsedValue}</span>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </span>
        )}
      </button>
      <div className={`grid transition-[grid-template-rows,opacity] duration-[250ms] ease-in-out ${active ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"}`}>
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
          className="w-8 h-8 rounded-full border border-[#B0B0B0] disabled:opacity-35 flex items-center justify-center cursor-pointer"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-5 text-center text-[0.9375rem]" style={{ fontWeight: 700 }}>{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center cursor-pointer"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export type { SearchPlan };
