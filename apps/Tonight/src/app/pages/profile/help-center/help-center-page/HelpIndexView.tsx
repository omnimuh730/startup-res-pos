import { CalendarDays, ChevronRight, Clock3, QrCode, Search, ShieldCheck, Sparkles } from "lucide-react";
import type { Section } from "../types";
import { DSBadge } from "../../../../components/ds/Badge";
import { Text } from "../../../../components/ds/Text";
import { ImageWithFallback } from "../../../../components/figma/ImageWithFallback";
import { DragScrollContainer } from "../../../shared/DragScrollContainer";
import { SectionLabel } from "./shared";

const QUICK_LINK_IDS = ["book", "qrpay", "saved", "troubleshoot"];
const QUICK_START_ITEMS = [
  { id: "getting-started", label: "First steps", icon: Sparkles, meta: "2 min" },
  { id: "book", label: "Book a table", icon: CalendarDays, meta: "5 min" },
  { id: "policy", label: "Deposits", icon: ShieldCheck, meta: "Rules" },
  { id: "qrpay", label: "QR Pay", icon: QrCode, meta: "Scan" },
];

const HELP_HERO_IMAGE = "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=720&fit=crop";

export function HelpIndexView({ query, onQueryChange, sections, filtered, onJump }: { query: string; onQueryChange: (value: string) => void; sections: Section[]; filtered: Section[]; onJump: (id: string) => void }) {
  return (
    <>
      <section className="space-y-4">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.08)]"><div className="relative h-[10rem] sm:h-[11rem]"><ImageWithFallback src={HELP_HERO_IMAGE} alt="Restaurant table with shared dishes" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" /><div className="absolute inset-x-0 bottom-0 p-4"><DSBadge variant="soft" color="primary" size="sm">Help center</DSBadge><h2 className="mt-2 text-[1.625rem] leading-[1.12] text-white" style={{ fontWeight: 800 }}>What do you need tonight?</h2><Text className="mt-1 max-w-[32rem] text-[0.8125rem] leading-snug text-white/85">Fast answers for bookings, QR Pay, saved places, and account settings.</Text></div></div></div>
        <div className="rounded-[1.5rem] border border-border bg-card p-3 shadow-[0_4px_18px_rgba(0,0,0,0.05)]"><label className="relative block"><Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" /><input type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search booking, QR, refund..." className="h-13 w-full rounded-full border border-border bg-secondary/45 pl-11 pr-4 text-[0.9375rem] outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/15" /></label><DragScrollContainer className="mt-3 flex gap-2 pb-1">{QUICK_LINK_IDS.map((sid) => { const section = sections.find((item) => item.id === sid); if (!section) return null; return <button key={sid} type="button" onClick={() => onJump(sid)} className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 text-[0.8125rem] text-primary transition hover:bg-primary/12 active:scale-95" style={{ fontWeight: 700 }}><section.icon className="h-3.5 w-3.5" />{section.title}</button>; })}</DragScrollContainer></div>
      </section>
      <section><SectionLabel>Start here</SectionLabel><div className="grid grid-cols-2 gap-3">{QUICK_START_ITEMS.map((item) => <button key={item.id} type="button" onClick={() => onJump(item.id)} className="group flex min-h-[5.25rem] cursor-pointer items-center gap-3 rounded-[1.25rem] border border-border bg-card p-3.5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:border-primary/30 hover:shadow-[0_6px_18px_rgba(0,0,0,0.07)] active:scale-[0.98]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><item.icon className="h-5 w-5" /></span><span className="min-w-0"><Text className="truncate text-[0.9375rem]" style={{ fontWeight: 700 }}>{item.label}</Text><Text className="text-[0.75rem] text-muted-foreground">{item.meta}</Text></span></button>)}</div></section>
      <section><SectionLabel>All topics</SectionLabel><div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_3px_16px_rgba(0,0,0,0.04)]">{filtered.map((section, index) => <button key={section.id} type="button" onClick={() => onJump(section.id)} className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition hover:bg-secondary/60 active:bg-secondary ${index !== filtered.length - 1 ? "border-b border-border/70" : ""}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground"><section.icon className="h-4.5 w-4.5" /></span><span className="min-w-0 flex-1"><span className="flex min-w-0 items-center gap-2"><Text className="truncate text-[0.9375rem]" style={{ fontWeight: 700 }}>{section.title}</Text><span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-primary/8 px-2 py-0.5 text-[0.6875rem] text-primary"><Clock3 className="h-3 w-3" />{section.readMins}m</span></span><Text className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">{section.summary}</Text></span><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /></button>)}{filtered.length === 0 && <div className="px-5 py-8 text-center"><Text className="text-[0.9375rem]" style={{ fontWeight: 700 }}>No matching topics</Text><Text className="mt-1 text-[0.8125rem] text-muted-foreground">Try another word, or contact support for help.</Text></div>}</div></section>
    </>
  );
}
