import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, Check, X } from "lucide-react";

type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  size?: SelectSize;
  searchable?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: "px-3 py-1.5 text-[0.75rem]",
  md: "px-3.5 py-2.5 text-[0.8125rem]",
  lg: "px-4 py-3 text-[0.9375rem]",
};

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  helperText,
  error,
  disabled = false,
  size = "md",
  searchable = false,
  clearable = false,
  fullWidth = true,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  // Group options
  const groups = new Map<string, SelectOption[]>();
  filtered.forEach((o) => {
    const g = o.group || "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(o);
  });

  return (
    <div className={`${fullWidth ? "w-full" : "inline-block"} ${className}`} ref={ref}>
      {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={`
            w-full flex items-center justify-between border rounded-lg bg-background transition-all cursor-pointer
            ${sizeClasses[size]}
            ${error ? "border-destructive" : open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <span className={selected ? "text-foreground" : "text-muted-foreground"}>
            {selected ? (
              <span className="flex items-center gap-2">
                {selected.icon}
                {selected.label}
              </span>
            ) : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {clearable && selected && (
              <span
                onClick={(e) => { e.stopPropagation(); onChange?.(""); }}
                className="p-0.5 hover:bg-secondary rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </div>
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-xl overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-1.5 text-[0.8125rem] bg-secondary rounded-lg outline-none"
                  autoFocus
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <p className="px-3 py-4 text-[0.8125rem] text-muted-foreground text-center">No options found</p>
              )}
              {Array.from(groups.entries()).map(([group, items]) => (
                <div key={group || "_default"}>
                  {group && (
                    <p className="px-3 pt-2 pb-1 text-[0.625rem] text-muted-foreground uppercase tracking-wider">{group}</p>
                  )}
                  {items.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => { onChange?.(opt.value); setOpen(false); setSearch(""); }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-[0.8125rem] transition-colors cursor-pointer
                        ${opt.value === value ? "bg-primary/10 text-primary" : "hover:bg-secondary"}
                        ${opt.disabled ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                    >
                      <span className="flex items-center gap-2">
                        {opt.icon}
                        {opt.label}
                      </span>
                      {opt.value === value && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-[0.75rem] text-destructive mt-1">{error}</p>}
      {!error && helperText && <p className="text-[0.75rem] text-muted-foreground mt-1">{helperText}</p>}
    </div>
  );
}

// ── MultiSelect ────────────────────────────────────────────
export interface MultiSelectProps extends Omit<SelectProps, "value" | "onChange" | "clearable"> {
  value?: string[];
  onChange?: (values: string[]) => void;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  label,
  error,
  disabled = false,
  size = "md",
  searchable = false,
  fullWidth = true,
  className = "",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedOpts = options.filter((o) => value.includes(o.value));
  const filtered = search ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())) : options;

  const toggleOption = (val: string) => {
    const next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val];
    onChange?.(next);
  };

  const removeTag = (val: string) => onChange?.(value.filter((v) => v !== val));

  return (
    <div className={`${fullWidth ? "w-full" : "inline-block"} ${className}`} ref={ref}>
      {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={`
            w-full flex items-center justify-between border rounded-lg bg-background transition-all min-h-[42px] cursor-pointer
            ${sizeClasses[size]}
            ${error ? "border-destructive" : open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"}
          `}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOpts.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedOpts.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[0.6875rem]"
                >
                  {opt.label}
                  <X
                    className="w-3 h-3 cursor-pointer hover:opacity-70"
                    onClick={(e) => { e.stopPropagation(); removeTag(opt.value); }}
                  />
                </span>
              ))
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-xl overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-1.5 text-[0.8125rem] bg-secondary rounded-lg outline-none"
                  autoFocus
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleOption(opt.value)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-[0.8125rem] transition-colors cursor-pointer
                    ${value.includes(opt.value) ? "bg-primary/10 text-primary" : "hover:bg-secondary"}
                  `}
                >
                  <span className="flex items-center gap-2">{opt.icon}{opt.label}</span>
                  {value.includes(opt.value) && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-[0.75rem] text-destructive mt-1">{error}</p>}
    </div>
  );
}
