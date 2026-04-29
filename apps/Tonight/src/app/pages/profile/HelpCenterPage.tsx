/* Help Center — illustrated, kid-and-elder-friendly guide with cross-links, chat, glossary */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  HelpCircle,
  MessageCircle,
  Play,
  Printer,
  QrCode,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { DSBadge } from "../../components/ds/Badge";
import { Button } from "../../components/ds/Button";
import { Card } from "../../components/ds/Card";
import { Heading, Text } from "../../components/ds/Text";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { SectionHelpfulness } from "./help-center/HelpCenterPrimitives";
import { buildFaqs, buildSections } from "./help-center/helpCenterContent";

interface HelpCenterPageProps {
  onBack: () => void;
  topicId?: string | null;
  onNavigateTopic?: (id: string | null) => void;
  onContactSupport?: () => void;
}

export function HelpCenterPage({ onBack, topicId = null, onNavigateTopic, onContactSupport }: HelpCenterPageProps) {
  const [query, setQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [showTop, setShowTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    if (onNavigateTopic) { onNavigateTopic(id); return; }
    const el = document.getElementById(`help-${id}`);
    const container = scrollRef.current;
    if (!el || !container) return;
    const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 12;
    container.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [topicId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleFeedback = (_id: string, _v: "up" | "down") => { /* could persist later */ };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }).share) {
      try { await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({ title: "CatchTable Help", text: "A friendly guide to CatchTable", url }); } catch { /* cancelled */ }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };
  const handlePrint = () => { if (typeof window !== "undefined") window.print(); };
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const sections = useMemo(() => buildSections({ jump, onContactSupport }), [onContactSupport]);
  const faqs = useMemo(() => buildFaqs(jump), []);

  const filtered = (() => {
    const base = query.trim()
      ? sections.filter((s) => {
          const q = query.toLowerCase();
          return s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.keywords.toLowerCase().includes(q);
        })
      : sections;
    const pinned = base.filter((s) => s.id === "help-usage");
    const rest = base.filter((s) => s.id !== "help-usage");
    return [...pinned, ...rest];
  })();

  const activeTopic = topicId ? sections.find((s) => s.id === topicId) ?? null : null;
  const goIndex = () => (onNavigateTopic ? onNavigateTopic(null) : onBack());

  return (
    <div className="fixed inset-0 z-[250] bg-background flex flex-col">
      <div className="shrink-0 sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-3 max-w-3xl mx-auto w-full">
          <button onClick={activeTopic ? goIndex : onBack} className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center cursor-pointer transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <Heading level={3}>{activeTopic ? activeTopic.title : "Help & Guide"}</Heading>
            <Text className="text-muted-foreground text-[0.75rem]">{activeTopic ? activeTopic.summary : "A friendly guide for every step"}</Text>
          </div>
          {activeTopic && (
            <div className="flex items-center gap-1">
              <button onClick={handleShare} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center cursor-pointer transition" title="Share"><Share2 className="w-4 h-4" /></button>
              <button onClick={handlePrint} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center cursor-pointer transition" title="Print"><Printer className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-5 pb-24 space-y-7">
          {!activeTopic && (
            <>
              <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, transparent), color-mix(in oklab, var(--info, var(--primary)) 14%, transparent))" }}>
                <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }} />
                <div className="absolute -bottom-12 -left-10 w-32 h-32 rounded-full" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }} />
                <div className="relative">
                  <DSBadge variant="soft" color="primary" size="sm">For everyone · Kids &amp; grown-ups</DSBadge>
                  <h2 className="mt-3 text-[1.5rem] sm:text-[1.75rem] leading-tight" style={{ fontWeight: 700 }}>How CatchTable works, in plain words.</h2>
                  <Text className="text-muted-foreground mt-2 leading-relaxed">Short steps, pictures, and tips. Tap any topic to open its own page. Need a human? Head to Contact Support from your Profile.</Text>
                  <div className="mt-4 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search help… e.g. booking, heart, QR" className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["book", "qrpay", "saved", "troubleshoot"].map((sid) => {
                      const s = sections.find((x) => x.id === sid);
                      if (!s) return null;
                      return <button key={sid} onClick={() => jump(sid)} className="text-[0.75rem] px-2.5 py-1 rounded-full bg-background/60 border border-border hover:bg-background transition cursor-pointer">{s.title}</button>;
                    })}
                  </div>
                </div>
              </div>

              <div>
                <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>Quick start</Text>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[{ id: "getting-started", label: "First steps", icon: Sparkles }, { id: "book", label: "Book a table", icon: CalendarDays }, { id: "policy", label: "Deposit & cancel rules", icon: ShieldCheck }, { id: "qrpay", label: "Scan & Pay", icon: QrCode }].map((q) => (
                    <button key={q.id} onClick={() => jump(q.id)} className="flex flex-col items-start gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-secondary/40 transition text-left cursor-pointer">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }}><q.icon className="w-5 h-5" style={{ color: "var(--primary)" }} /></div>
                      <Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>{q.label}</Text>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>All topics</Text>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  {filtered.map((s, i) => (
                    <button key={s.id} onClick={() => jump(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/40 transition cursor-pointer ${i !== filtered.length - 1 ? "border-b border-border" : ""}`}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}><s.icon className="w-4.5 h-4.5" style={{ color: "var(--primary)" }} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Text className="truncate" style={{ fontWeight: 600 }}>{s.title}</Text>
                          <span className="text-[0.6875rem] text-muted-foreground flex items-center gap-0.5 shrink-0 whitespace-nowrap"><Clock3 className="w-3 h-3" /> {s.readMins} min</span>
                        </div>
                        <Text className="text-muted-foreground text-[0.8125rem] truncate">{s.summary}</Text>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <div className="px-4 py-6 text-center"><Text className="text-muted-foreground text-[0.875rem]">No topics match "{query}". Try another word.</Text></div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTopic && (
            <div className="space-y-7">
              <section key={activeTopic.id} id={`help-${activeTopic.id}`} className="scroll-mt-4">
                <div className="relative rounded-3xl overflow-hidden mb-3" style={{ aspectRatio: "3 / 1" }}>
                  <ImageWithFallback src={activeTopic.image} alt={activeTopic.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)" }} />
                  <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[0.6875rem]" style={{ fontWeight: 700, color: "var(--primary)" }}><activeTopic.icon className="w-3 h-3" /> {activeTopic.title}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[0.6875rem]" style={{ fontWeight: 600 }}><Clock3 className="w-3 h-3" /> {activeTopic.readMins} min read</span>
                      {activeTopic.video && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[0.6875rem]" style={{ fontWeight: 600 }}><Play className="w-3 h-3" /> Video · {activeTopic.video.length}</span>}
                    </div>
                    <h3 className="text-white mt-2 text-[1.25rem] sm:text-[1.375rem] leading-tight" style={{ fontWeight: 700 }}>{activeTopic.title}</h3>
                    <p className="text-white/80 text-[0.8125rem] mt-0.5">{activeTopic.summary}</p>
                  </div>
                  <button onClick={() => speak(`${activeTopic.title}. ${activeTopic.summary}`)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white cursor-pointer transition" title="Read aloud"><Volume2 className="w-4 h-4" /></button>
                </div>
                <Card variant="default" padding="md" radius="lg">
                  {activeTopic.render(jump)}
                  {activeTopic.video && <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-3 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center"><Play className="w-4 h-4" style={{ color: "var(--primary)" }} /></div><div className="flex-1 min-w-0"><Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>{activeTopic.video.title}</Text><Text className="text-muted-foreground text-[0.75rem]">Video walkthrough · {activeTopic.video.length}</Text></div><Button variant="outline" size="sm" radius="full">Watch</Button></div>}
                  {activeTopic.related.length > 0 && (
                    <div className="mt-4">
                      <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>Related</Text>
                      <div className="flex flex-wrap gap-2">
                        {activeTopic.related.map((rid) => {
                          const r = sections.find((x) => x.id === rid);
                          if (!r) return null;
                          return <button key={rid} onClick={() => jump(rid)} className="text-[0.8125rem] px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/15 transition cursor-pointer inline-flex items-center gap-1"><r.icon className="w-3.5 h-3.5" /> {r.title}</button>;
                        })}
                      </div>
                    </div>
                  )}
                  <SectionHelpfulness sectionId={activeTopic.id} onFeedback={handleFeedback} />
                </Card>
              </section>
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button variant="outline" radius="full" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={goIndex}>All topics</Button>
                <Button variant="primary" radius="full" leftIcon={<MessageCircle className="w-4 h-4" />} onClick={() => onContactSupport?.()}>Contact support</Button>
              </div>
            </div>
          )}

          {!activeTopic && (
            <>
              <div id="help-faq" className="space-y-3">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--warning) 15%, transparent)" }}><HelpCircle className="w-5 h-5" style={{ color: "var(--warning)" }} /></div><Heading level={3}>Frequently asked</Heading></div>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  {faqs.map((f, i) => {
                    const open = expandedFaq === i;
                    return (
                      <div key={i} className={i !== faqs.length - 1 ? "border-b border-border" : ""}>
                        <button onClick={() => setExpandedFaq(open ? null : i)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/40 transition cursor-pointer"><span className="flex-1 text-[0.8125rem]" style={{ fontWeight: 600 }}>{f.q}</span><ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} /></button>
                        <AnimatePresence initial={false}>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"><div className="px-4 pb-4 text-[0.875rem] text-muted-foreground leading-relaxed">{f.a}</div></motion.div>}</AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl p-5 text-center" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }}>
                <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background: "color-mix(in oklab, var(--primary) 20%, transparent)" }}><MessageCircle className="w-6 h-6" style={{ color: "var(--primary)" }} /></div>
                <Text className="text-[1rem]" style={{ fontWeight: 700 }}>Still need a hand?</Text>
                <Text className="text-muted-foreground text-[0.875rem] mt-1">Talk to us — Contact Support lives in your Profile.</Text>
                <div className="mt-3 flex items-center justify-center gap-2 flex-wrap"><Button variant="primary" radius="full" onClick={() => onContactSupport?.()} leftIcon={<MessageCircle className="w-4 h-4" />}>Contact support</Button></div>
              </div>
              <Text className="text-[0.75rem] text-muted-foreground text-center pt-2">Guide version 1.2 · Updated April 2026</Text>
            </>
          )}
        </div>

        <AnimatePresence>
          {showTop && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-36 right-5 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition z-10" aria-label="Back to top">
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
