import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Checkbox, Radio, RadioGroup, Toggle, Select, MultiSelect, Slider, RangeSlider, NumberInput, StepperCounter, PasswordInput, FileUploader, type SelectOption } from "../ds";
import { Globe, Utensils, Home, Wifi, Car, Coffee } from "lucide-react";

const cuisineOptions: SelectOption[] = [
  { value: "italian", label: "Italian", group: "European" },
  { value: "french", label: "French", group: "European" },
  { value: "japanese", label: "Japanese", group: "Asian" },
  { value: "chinese", label: "Chinese", group: "Asian" },
  { value: "mexican", label: "Mexican", group: "Americas" },
  { value: "indian", label: "Indian", group: "Asian" },
  { value: "thai", label: "Thai", group: "Asian" },
  { value: "american", label: "American", group: "Americas" },
];

const amenityOptions: SelectOption[] = [
  { value: "wifi", label: "WiFi", icon: <Wifi className="w-3.5 h-3.5" /> },
  { value: "parking", label: "Parking", icon: <Car className="w-3.5 h-3.5" /> },
  { value: "breakfast", label: "Breakfast", icon: <Coffee className="w-3.5 h-3.5" /> },
  { value: "kitchen", label: "Kitchen", icon: <Utensils className="w-3.5 h-3.5" /> },
];

export function FormControlsSection() {
  const [checkboxes, setCheckboxes] = useState({ wifi: true, pets: false, pool: false });
  const [radioVal, setRadioVal] = useState("delivery");
  const [toggles, setToggles] = useState({ accepting: true, notifications: false, darkMode: false });
  const [selectVal, setSelectVal] = useState("");
  const [multiVal, setMultiVal] = useState<string[]>(["wifi"]);
  const [sliderVal, setSliderVal] = useState(50);
  const [rangeVal, setRangeVal] = useState<[number, number]>([25, 75]);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 200]);
  const [numVal, setNumVal] = useState(2);
  const [guests, setGuests] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children_, setChildren_] = useState(0);
  const [password, setPassword] = useState("");

  return (
    <SectionWrapper
      id="form-controls-ds"
      title="Form Controls"
      description="Checkbox, Radio, Toggle, Select, Slider, NumberInput, PasswordInput and FileUploader — all reusable."
    >
      {/* Checkbox */}
      <ComponentCard title="Checkbox">
        <div className="space-y-3">
          <Checkbox
            checked={checkboxes.wifi}
            onCheck={(v) => setCheckboxes((p) => ({ ...p, wifi: v }))}
            label="WiFi included"
            description="Free high-speed internet"
          />
          <Checkbox
            checked={checkboxes.pets}
            onCheck={(v) => setCheckboxes((p) => ({ ...p, pets: v }))}
            label="Pets allowed"
          />
          <Checkbox
            checked={checkboxes.pool}
            onCheck={(v) => setCheckboxes((p) => ({ ...p, pool: v }))}
            label="Swimming pool"
          />
          <Checkbox indeterminate label="Select all (indeterminate)" />
          <Checkbox disabled label="Disabled option" />
          <Checkbox checked disabled label="Checked & disabled" />
          <Checkbox label="With error" error="This field is required" />
        </div>
      </ComponentCard>

      {/* Radio */}
      <ComponentCard title="Radio Group">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[0.75rem] text-muted-foreground mb-2">Order Type</p>
            <RadioGroup
              value={radioVal}
              onChange={setRadioVal}
              options={[
                { value: "delivery", label: "Delivery", description: "Delivered to your door" },
                { value: "pickup", label: "Pickup", description: "Pick up at the restaurant" },
                { value: "dine-in", label: "Dine-in", description: "Eat at the restaurant" },
              ]}
            />
          </div>
          <div>
            <p className="text-[0.75rem] text-muted-foreground mb-2">Horizontal Layout</p>
            <RadioGroup
              value={radioVal}
              onChange={setRadioVal}
              direction="row"
              options={[
                { value: "delivery", label: "Delivery" },
                { value: "pickup", label: "Pickup" },
                { value: "dine-in", label: "Dine-in" },
              ]}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Toggle */}
      <ComponentCard title="Toggle / Switch">
        <div className="space-y-4">
          <Toggle checked={toggles.accepting} onToggle={(v) => setToggles((p) => ({ ...p, accepting: v }))} label="Accepting orders" description="Restaurant is currently open for new orders" color="success" />
          <Toggle checked={toggles.notifications} onToggle={(v) => setToggles((p) => ({ ...p, notifications: v }))} label="Push notifications" />
          <Toggle checked={toggles.darkMode} onToggle={(v) => setToggles((p) => ({ ...p, darkMode: v }))} label="Dark mode" color="primary" />
          <div className="flex flex-wrap gap-6">
            <Toggle checked size="sm" label="Small" />
            <Toggle checked size="md" label="Medium" />
            <Toggle checked size="lg" label="Large" />
          </div>
          <Toggle disabled label="Disabled toggle" />
        </div>
      </ComponentCard>

      {/* Select */}
      <ComponentCard title="Select / Dropdown">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <Select
            label="Cuisine Type"
            options={cuisineOptions}
            value={selectVal}
            onChange={setSelectVal}
            placeholder="Choose cuisine..."
            searchable
            clearable
          />
          <Select
            label="With Error"
            options={cuisineOptions}
            value=""
            onChange={() => {}}
            error="Selection required"
          />
        </div>
      </ComponentCard>

      <ComponentCard title="Multi-Select">
        <div className="max-w-sm">
          <MultiSelect
            label="Amenities"
            options={amenityOptions}
            value={multiVal}
            onChange={setMultiVal}
            searchable
          />
        </div>
      </ComponentCard>

      {/* Slider */}
      <ComponentCard title="Slider">
        <div className="max-w-md space-y-6">
          <Slider label="Volume" value={sliderVal} onChange={setSliderVal} formatValue={(v) => `${v}%`} />
          <Slider
            label="Rating"
            min={1}
            max={5}
            step={0.5}
            value={3.5}
            formatValue={(v) => `${v} stars`}
            marks={[{ value: 1, label: "1" }, { value: 3, label: "3" }, { value: 5, label: "5" }]}
          />
        </div>
      </ComponentCard>

      <ComponentCard title="Range Slider">
        <div className="max-w-md space-y-6">
          <RangeSlider label="Price Range" value={priceRange} onChange={setPriceRange} min={0} max={500} step={10} formatValue={(v) => `$${v}`} />
          <RangeSlider label="Distance (km)" value={rangeVal} onChange={setRangeVal} min={0} max={100} formatValue={(v) => `${v}km`} />
        </div>
      </ComponentCard>

      {/* Number Input */}
      <ComponentCard title="Number Input & Stepper">
        <div className="space-y-5">
          <NumberInput label="Quantity" value={numVal} onChange={setNumVal} min={0} max={99} />
          <div className="max-w-xs space-y-3">
            <StepperCounter label="Guests" value={guests} onChange={setGuests} min={1} max={20} />
            <StepperCounter label="Adults" value={adults} onChange={setAdults} min={1} max={16} />
            <StepperCounter label="Children" value={children_} onChange={setChildren_} min={0} max={10} />
          </div>
        </div>
      </ComponentCard>

      {/* Password */}
      <ComponentCard title="Password Input">
        <div className="max-w-sm space-y-4">
          <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" showStrength />
          <PasswordInput label="Confirm Password" placeholder="Confirm password" />
        </div>
      </ComponentCard>

      {/* File Uploader */}
      <ComponentCard title="File Uploader">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FileUploader
            label="Property Photos"
            description="PNG, JPG, WEBP up to 10MB"
            accept="image/*"
            multiple
            maxFiles={5}
          />
          <FileUploader
            label="Menu PDF"
            description="Upload your restaurant menu"
            accept=".pdf"
            variant="button"
          />
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
