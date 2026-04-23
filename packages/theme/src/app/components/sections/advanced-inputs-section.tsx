import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { DatePicker, DateRangePicker, TimePicker, TimeSlotPicker, SearchBar, type SearchSuggestion } from "../ds";
import { MapPin, Utensils, Home, Building2, Globe } from "lucide-react";

const searchSuggestions: SearchSuggestion[] = [
  { id: "1", label: "Los Angeles, CA", description: "City in California", icon: <MapPin className="w-4 h-4" />, group: "Locations" },
  { id: "2", label: "San Francisco, CA", description: "City in California", icon: <MapPin className="w-4 h-4" />, group: "Locations" },
  { id: "3", label: "Nobu Malibu", description: "Japanese • $$$$ • Malibu", icon: <Utensils className="w-4 h-4" />, group: "Restaurants" },
  { id: "4", label: "Bestia", description: "Italian • $$$ • Downtown LA", icon: <Utensils className="w-4 h-4" />, group: "Restaurants" },
  { id: "5", label: "Modern Beach House", description: "Entire home • Malibu", icon: <Home className="w-4 h-4" />, group: "Properties" },
  { id: "6", label: "Downtown Loft", description: "Entire apt • DTLA", icon: <Building2 className="w-4 h-4" />, group: "Properties" },
];

export function AdvancedInputsSection() {
  const [date, setDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [time, setTime] = useState("19:00");
  const [timeSlot, setTimeSlot] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SectionWrapper
      id="advanced-inputs-ds"
      title="Advanced Inputs"
      description="Date pickers, time/slot pickers, and search with autocomplete — critical for booking, delivery, and reservation apps."
    >
      {/* Date Picker */}
      <ComponentCard title="Date Picker">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div className="relative">
            <DatePicker
              label="Reservation Date"
              value={date}
              onChange={setDate}
              placeholder="Select date..."
            />
          </div>
          <div className="relative">
            <DatePicker
              label="With Min Date (today)"
              value={null}
              onChange={() => {}}
              minDate={new Date()}
              placeholder="Future dates only"
            />
          </div>
        </div>
      </ComponentCard>

      {/* Date Range Picker */}
      <ComponentCard title="Date Range Picker">
        <div className="max-w-sm relative">
          <DateRangePicker
            label="Check-in / Check-out"
            value={dateRange}
            onChange={setDateRange}
            minDate={new Date()}
          />
        </div>
        {dateRange[0] && dateRange[1] && (
          <p className="text-[0.75rem] text-muted-foreground mt-2">
            {Math.ceil((dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24))} nights selected
          </p>
        )}
      </ComponentCard>

      {/* Time Picker */}
      <ComponentCard title="Time Picker">
        <TimePicker label="Pickup Time" value={time} onChange={setTime} />
        <p className="text-[0.75rem] text-muted-foreground mt-2">Selected: {time}</p>
      </ComponentCard>

      {/* Time Slot Picker */}
      <ComponentCard title="Time Slot Picker">
        <div className="max-w-md">
          <TimeSlotPicker
            label="Available Times — Thursday, Dec 19"
            value={timeSlot}
            onChange={setTimeSlot}
            unavailable={["6:00 PM", "8:30 PM", "10:00 PM"]}
          />
        </div>
      </ComponentCard>

      {/* Search Bar */}
      <ComponentCard title="Search / Autocomplete">
        <div className="max-w-lg space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            suggestions={searchQuery.length > 0 ? searchSuggestions.filter((s) =>
              s.label.toLowerCase().includes(searchQuery.toLowerCase())
            ) : []}
            placeholder="Search locations, restaurants, properties..."
            size="lg"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchBar placeholder="Small search..." size="sm" />
            <SearchBar placeholder="Loading state..." loading />
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
