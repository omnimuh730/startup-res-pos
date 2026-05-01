import {
  CalendarDays,
  ChevronRight,
  Clock3,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DSBadge } from "../../../components/ds/Badge";
import { Text } from "../../../components/ds/Text";
import type { Section } from "./types";

const QUICK_LINK_IDS = ["book", "qrpay", "saved", "troubleshoot"];
const QUICK_START_ITEMS = [
  { id: "getting-started", label: "First steps", icon: Sparkles },
  { id: "book", label: "Book a table", icon: CalendarDays },
  { id: "policy", label: "Deposit & cancel rules", icon: ShieldCheck },
  { id: "qrpay", label: "Scan & Pay", icon: QrCode },
];

interface HelpCenterIndexViewProps {
  query: string;
  onQueryChange: (value: string) => void;
  sections: Section[];
  filtered: Section[];
  onJump: (id: string) => void;
}

export function HelpCenterIndexView({
  query,
  onQueryChange,
  sections,
  filtered,
  onJump,
}: HelpCenterIndexViewProps) {
  return (
    <>
      <div
        className="relative overflow-hidden rounded-3xl p-5 sm:p-6"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, transparent), color-mix(in oklab, var(--info, var(--primary)) 14%, transparent))",
        }}
      >
        <div
          className="absolute -top-10 -right-8 w-40 h-40 rounded-full"
          style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }}
        />
        <div
          className="absolute -bottom-12 -left-10 w-32 h-32 rounded-full"
          style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }}
        />
        <div className="relative">
          <DSBadge variant="soft" color="primary" size="sm">
            For everyone · Kids &amp; grown-ups
          </DSBadge>
          <h2 className="mt-3 text-[1.5rem] sm:text-[1.75rem] leading-tight" style={{ fontWeight: 700 }}>
            How CatchTable works, in plain words.
          </h2>
          <Text className="text-muted-foreground mt-2 leading-relaxed">
            Short steps, pictures, and tips. Tap any topic to open its own page.
            Need a human? Head to Contact Support from your Profile.
          </Text>
          <div className="mt-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search help… e.g. booking, heart, QR"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK_LINK_IDS.map((sid) => {
              const section = sections.find((x) => x.id === sid);
              if (!section) return null;
              return (
                <button
                  key={sid}
                  onClick={() => onJump(sid)}
                  className="text-[0.75rem] px-2.5 py-1 rounded-full bg-background/60 border border-border hover:bg-background transition cursor-pointer"
                >
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>
          Quick start
        </Text>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_START_ITEMS.map((quick) => (
            <button
              key={quick.id}
              onClick={() => onJump(quick.id)}
              className="flex flex-col items-start gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-secondary/40 transition text-left cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }}
              >
                <quick.icon className="w-5 h-5" style={{ color: "var(--primary)" }} />
              </div>
              <Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>
                {quick.label}
              </Text>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>
          All topics
        </Text>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {filtered.map((section, i) => (
            <button
              key={section.id}
              onClick={() => onJump(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/40 transition cursor-pointer ${
                i !== filtered.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}
              >
                <section.icon className="w-4.5 h-4.5" style={{ color: "var(--primary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Text className="truncate" style={{ fontWeight: 600 }}>
                    {section.title}
                  </Text>
                  <span className="text-[0.6875rem] text-muted-foreground flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                    <Clock3 className="w-3 h-3" /> {section.readMins} min
                  </span>
                </div>
                <Text className="text-muted-foreground text-[0.8125rem] truncate">
                  {section.summary}
                </Text>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Text className="text-muted-foreground text-[0.875rem]">
                No topics match "{query}". Try another word.
              </Text>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
