import { useState, useRef, useEffect, type ReactNode } from "react";
import { Search, X, Loader2 } from "lucide-react";

type SearchBarSize = "sm" | "md" | "lg";

export interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  group?: string;
}

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
  suggestions?: SearchSuggestion[];
  placeholder?: string;
  size?: SearchBarSize;
  loading?: boolean;
  clearable?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<SearchBarSize, { input: string; icon: string }> = {
  sm: { input: "pl-9 pr-3 py-2 text-[0.75rem]", icon: "left-3 w-3.5 h-3.5" },
  md: { input: "pl-10 pr-4 py-2.5 text-[0.8125rem]", icon: "left-3.5 w-4 h-4" },
  lg: { input: "pl-12 pr-5 py-3.5 text-[0.9375rem]", icon: "left-4 w-5 h-5" },
};

export function SearchBar({
  value: controlledValue,
  onChange,
  onSearch,
  onSelect,
  suggestions = [],
  placeholder = "Search...",
  size = "md",
  loading = false,
  clearable = true,
  autoFocus = false,
  disabled = false,
  className = "",
}: SearchBarProps) {
  const [internal, setInternal] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const val = controlledValue ?? internal;
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (v: string) => {
    setInternal(v);
    onChange?.(v);
    setOpen(v.length > 0 && suggestions.length > 0);
  };

  const handleSelect = (s: SearchSuggestion) => {
    setInternal(s.label);
    onChange?.(s.label);
    onSelect?.(s);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.(val);
      setOpen(false);
    }
    if (e.key === "Escape") setOpen(false);
  };

  const s = sizeClasses[size];
  const showSuggestions = open && (suggestions.length > 0 || loading);

  // Group suggestions
  const groups = new Map<string, SearchSuggestion[]>();
  suggestions.forEach((s) => {
    const g = s.group || "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(s);
  });

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div className="relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 ${s.icon} text-muted-foreground pointer-events-none`} />
        <input
          ref={inputRef}
          type="text"
          value={val}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { setFocused(true); if (val && suggestions.length) setOpen(true); }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`
            w-full ${s.input} border rounded-xl bg-background outline-none transition-all
            ${focused ? "border-primary ring-2 ring-primary/20" : "border-border"}
            ${disabled ? "opacity-50" : ""}
          `}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
          {clearable && val && !loading && (
            <button
              type="button"
              onClick={() => { handleChange(""); inputRef.current?.focus(); }}
              className="p-0.5 hover:bg-secondary rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
          {loading && suggestions.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground mb-2" />
              <p className="text-[0.75rem] text-muted-foreground">Searching...</p>
            </div>
          ) : (
            Array.from(groups.entries()).map(([group, items]) => (
              <div key={group || "_default"}>
                {group && <p className="px-3 pt-2 pb-1 text-[0.625rem] text-muted-foreground uppercase tracking-wider">{group}</p>}
                {items.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelect(s)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary transition-colors cursor-pointer text-left"
                  >
                    {s.icon && <span className="shrink-0 text-muted-foreground">{s.icon}</span>}
                    <div className="min-w-0">
                      <p className="text-[0.8125rem] truncate">{s.label}</p>
                      {s.description && <p className="text-[0.6875rem] text-muted-foreground truncate">{s.description}</p>}
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
