import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowUp, Printer, Share2 } from "lucide-react";
import { Heading, Text } from "../../../components/ds/Text";
import { buildFaqs, buildSections } from "./helpCenterContent";
import { FaqAndFooter } from "./help-center-page/FaqAndFooter";
import { HelpIndexView } from "./help-center-page/HelpIndexView";
import { HelpTopicView } from "./help-center-page/HelpTopicView";
import { HeaderIconButton } from "./help-center-page/shared";

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

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, [topicId]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const onScroll = () => setShowTop(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleFeedback = (_id: string, _value: "up" | "down") => {};

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof navigator !== "undefined" && nav.share) {
      try { await nav.share({ title: "CatchTable Help", text: "A quick guide to CatchTable", url }); } catch {}
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
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
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const base = term ? sections.filter((section) => section.title.toLowerCase().includes(term) || section.summary.toLowerCase().includes(term) || section.keywords.toLowerCase().includes(term)) : sections;
    const pinned = base.filter((section) => section.id === "help-usage");
    const rest = base.filter((section) => section.id !== "help-usage");
    return [...pinned, ...rest];
  }, [query, sections]);

  const activeTopic = topicId ? sections.find((section) => section.id === topicId) ?? null : null;
  const goIndex = () => (onNavigateTopic ? onNavigateTopic(null) : onBack());

  return (
    <div className="fixed left-0 right-0 top-0 z-[250] flex flex-col bg-background text-foreground" style={{ bottom: "var(--app-bottom-chrome-height, 0px)" }}>
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur-md"><div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 pb-3 sm:px-6" style={{ paddingTop: "calc(var(--safe-area-inset-top, 0px) + 0.75rem)" }}><HeaderIconButton label="Back" onClick={activeTopic ? goIndex : onBack}><ArrowLeft className="h-5 w-5" /></HeaderIconButton><div className="min-w-0 flex-1"><Heading level={3} className="truncate text-[1.125rem] leading-tight" style={{ fontWeight: 800 }}>{activeTopic ? activeTopic.title : "Help center"}</Heading><Text className="mt-0.5 truncate text-[0.75rem] text-muted-foreground">{activeTopic ? activeTopic.summary : "Answers for bookings, payments, and profile"}</Text></div>{activeTopic && <div className="flex items-center gap-1.5"><HeaderIconButton label="Share" onClick={handleShare}><Share2 className="h-4 w-4" /></HeaderIconButton><HeaderIconButton label="Print" onClick={handlePrint}><Printer className="h-4 w-4" /></HeaderIconButton></div>}</div></header>
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto"><motion.div key={activeTopic?.id ?? "index"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }} className="mx-auto w-full max-w-3xl space-y-6 px-4 pb-6 pt-5 sm:px-6">{!activeTopic ? <><HelpIndexView query={query} onQueryChange={setQuery} sections={sections} filtered={filtered} onJump={jump} /><FaqAndFooter faqs={faqs} expandedFaq={expandedFaq} onSetExpandedFaq={setExpandedFaq} onContactSupport={onContactSupport} /></> : <HelpTopicView activeTopic={activeTopic} sections={sections} onJump={jump} onSpeak={speak} onFeedback={handleFeedback} onGoIndex={goIndex} onContactSupport={onContactSupport} />}</motion.div><AnimatePresence>{showTop && <motion.button type="button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })} className="fixed right-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(255,56,92,0.24)] transition hover:scale-105 active:scale-95" style={{ bottom: "calc(var(--app-bottom-chrome-height, 0px) + 1rem)" }} aria-label="Back to top"><ArrowUp className="h-5 w-5" /></motion.button>}</AnimatePresence></div>
    </div>
  );
}
