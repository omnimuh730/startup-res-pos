import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { X, Check, Star, MapPin, User, Hash, Plus } from "lucide-react";

export function ChipsSection() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["React", "TypeScript"]);
  const [selectedChoice, setSelectedChoice] = useState("Entire place");
  const [inputChips, setInputChips] = useState(["Design", "Frontend", "UI/UX"]);
  const [inputValue, setInputValue] = useState("");

  const toggleFilter = (f: string) =>
    setSelectedFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const addChip = () => {
    if (inputValue.trim() && !inputChips.includes(inputValue.trim())) {
      setInputChips([...inputChips, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <SectionWrapper
      id="chips"
      title="Chips & Tags"
      description="Compact elements for filters, selections, tags, and input. Includes actionable, removable, and choice variants."
    >
      <ComponentCard title="Basic Chips">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[0.8125rem]">
            Primary
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[0.8125rem] border border-border">
            Secondary
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/15 text-success text-[0.8125rem]">
            <Check className="w-3.5 h-3.5" /> Approved
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/15 text-warning text-[0.8125rem]">
            <Star className="w-3.5 h-3.5" /> Featured
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/15 text-destructive text-[0.8125rem]">
            Deprecated
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-info/15 text-info text-[0.8125rem]">
            <MapPin className="w-3.5 h-3.5" /> Location
          </span>
        </div>
      </ComponentCard>

      <ComponentCard title="Removable Chips">
        <div className="flex flex-wrap gap-2">
          {["JavaScript", "React", "Node.js", "GraphQL", "Tailwind"].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[0.8125rem] bg-card hover:bg-secondary transition-colors"
            >
              <Hash className="w-3 h-3 text-muted-foreground" />
              {tag}
              <button className="ml-0.5 p-0.5 rounded-full hover:bg-destructive/15 hover:text-destructive cursor-pointer transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Filter Chips (Multi-select)">
        <p className="text-[0.8125rem] text-muted-foreground mb-3">Select technologies:</p>
        <div className="flex flex-wrap gap-2">
          {["React", "Vue", "Angular", "Svelte", "TypeScript", "Next.js", "Remix"].map((f) => {
            const active = selectedFilters.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.8125rem] border transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                }`}
              >
                {active && <Check className="w-3.5 h-3.5" />}
                {f}
              </button>
            );
          })}
        </div>
        <p className="text-[0.75rem] text-muted-foreground mt-2">
          Selected: {selectedFilters.join(", ") || "None"}
        </p>
      </ComponentCard>

      <ComponentCard title="Choice Chips (Single-select)">
        <p className="text-[0.8125rem] text-muted-foreground mb-3">Type of place:</p>
        <div className="flex flex-wrap gap-2">
          {["Entire place", "Private room", "Shared room", "Hotel room"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedChoice(c)}
              className={`px-4 py-2 rounded-xl text-[0.8125rem] border-2 transition-all cursor-pointer ${
                selectedChoice === c
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Input Chips">
        <div className="max-w-md">
          <label className="text-[0.8125rem] block mb-1.5">Skills</label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-background min-h-[48px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            {inputChips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[0.8125rem]"
              >
                {chip}
                <button
                  onClick={() => setInputChips(inputChips.filter((c) => c !== chip))}
                  className="p-0.5 rounded hover:bg-primary/20 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add skill..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChip()}
              className="flex-1 min-w-[80px] py-1 outline-none bg-transparent text-[0.8125rem]"
            />
          </div>
          <p className="text-[0.6875rem] text-muted-foreground mt-1.5">Press Enter to add a chip</p>
        </div>
      </ComponentCard>

      <ComponentCard title="Chip Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[0.6875rem]">
            Extra Small
          </span>
          <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[0.75rem]">
            Small
          </span>
          <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[0.8125rem]">
            Medium
          </span>
          <span className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-[0.875rem]">
            Large
          </span>
        </div>
      </ComponentCard>

      <ComponentCard title="Avatar Chips">
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Alice", color: "bg-primary" },
            { name: "Bob", color: "bg-info" },
            { name: "Carol", color: "bg-success" },
          ].map((u) => (
            <span
              key={u.name}
              className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full border border-border text-[0.8125rem]"
            >
              <span className={`w-6 h-6 rounded-full ${u.color} text-white flex items-center justify-center text-[0.6875rem]`}>
                {u.name[0]}
              </span>
              {u.name}
            </span>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
