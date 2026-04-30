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
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DSBadge } from "../../../components/ds/Badge";
import { Button } from "../../../components/ds/Button";
import { Card } from "../../../components/ds/Card";
import { Heading, Text } from "../../../components/ds/Text";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { DragScrollContainer } from "../../shared/DragScrollContainer";
import { SectionHelpfulness } from "./HelpCenterPrimitives";
import { buildFaqs, buildSections } from "./helpCenterContent";
import type { Section } from "./types";

interface HelpCenterPageProps {
  onBack: () => void;
  topicId?: string | null;
  onNavigateTopic?: (id: string | null) => void;
  onContactSupport?: () => void;
}

const QUICK_LINK_IDS = ["book", "qrpay", "saved", "troubleshoot"];
const QUICK_START_ITEMS = [
  { id: "getting-started", label: "First steps", icon: Sparkles, meta: "2 min" },
  { id: "book", label: "Book a table", icon: CalendarDays, meta: "5 min" },
  { id: "policy", label: "Deposits", icon: ShieldCheck, meta: "Rules" },
  { id: "qrpay", label: "QR Pay", icon: QrCode, meta: "Scan" },
];

const HELP_HERO_IMAGE =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=720&fit=crop";

function HeaderIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition hover:bg-secondary/80 active:scale-95"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text
      className="mb-3 px-1 text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground"
      style={{ fontWeight: 700 }}
    >
      {children}
    </Text>
  );
}

function HelpIndexView({
  query,
  onQueryChange,
  sections,
  filtered,
  onJump,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  sections: Section[];
  filtered: Section[];
  onJump: (id: string) => void;
}) {
  return (
    <>
      <section className="space-y-4">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="relative h-[10rem] sm:h-[11rem]">
            <ImageWithFallback
              src={HELP_HERO_IMAGE}
              alt="Restaurant table with shared dishes"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <DSBadge variant="soft" color="primary" size="sm">
                Help center
              </DSBadge>
              <h2
                className="mt-2 text-[1.625rem] leading-[1.12] text-white"
                style={{ fontWeight: 800 }}
              >
                What do you need tonight?
              </h2>
              <Text className="mt-1 max-w-[32rem] text-[0.8125rem] leading-snug text-white/85">
                Fast answers for bookings, QR Pay, saved places, and account settings.
              </Text>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-card p-3 shadow-[0_4px_18px_rgba(0,0,0,0.05)]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search booking, QR, refund..."
              className="h-13 w-full rounded-full border border-border bg-secondary/45 pl-11 pr-4 text-[0.9375rem] outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <DragScrollContainer className="mt-3 flex gap-2 pb-1">
            {QUICK_LINK_IDS.map((sid) => {
              const section = sections.find((item) => item.id === sid);
              if (!section) return null;
              return (
                <button
                  key={sid}
                  type="button"
                  onClick={() => onJump(sid)}
                  className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 text-[0.8125rem] text-primary transition hover:bg-primary/12 active:scale-95"
                  style={{ fontWeight: 700 }}
                >
                  <section.icon className="h-3.5 w-3.5" />
                  {section.title}
                </button>
              );
            })}
          </DragScrollContainer>
        </div>
      </section>

      <section>
        <SectionLabel>Start here</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_START_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onJump(item.id)}
              className="group flex min-h-[5.25rem] cursor-pointer items-center gap-3 rounded-[1.25rem] border border-border bg-card p-3.5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:border-primary/30 hover:shadow-[0_6px_18px_rgba(0,0,0,0.07)] active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <Text className="truncate text-[0.9375rem]" style={{ fontWeight: 700 }}>
                  {item.label}
                </Text>
                <Text className="text-[0.75rem] text-muted-foreground">{item.meta}</Text>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>All topics</SectionLabel>
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_3px_16px_rgba(0,0,0,0.04)]">
          {filtered.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onJump(section.id)}
              className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition hover:bg-secondary/60 active:bg-secondary ${
                index !== filtered.length - 1 ? "border-b border-border/70" : ""
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                <section.icon className="h-4.5 w-4.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex min-w-0 items-center gap-2">
                  <Text className="truncate text-[0.9375rem]" style={{ fontWeight: 700 }}>
                    {section.title}
                  </Text>
                  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-primary/8 px-2 py-0.5 text-[0.6875rem] text-primary">
                    <Clock3 className="h-3 w-3" />
                    {section.readMins}m
                  </span>
                </span>
                <Text className="mt-0.5 truncate text-[0.8125rem] text-muted-foreground">
                  {section.summary}
                </Text>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center">
              <Text className="text-[0.9375rem]" style={{ fontWeight: 700 }}>
                No matching topics
              </Text>
              <Text className="mt-1 text-[0.8125rem] text-muted-foreground">
                Try another word, or contact support for help.
              </Text>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function HelpTopicView({
  activeTopic,
  sections,
  onJump,
  onSpeak,
  onFeedback,
  onGoIndex,
  onContactSupport,
}: {
  activeTopic: Section;
  sections: Section[];
  onJump: (id: string) => void;
  onSpeak: (text: string) => void;
  onFeedback: (id: string, value: "up" | "down") => void;
  onGoIndex: () => void;
  onContactSupport?: () => void;
}) {
  return (
    <div className="space-y-5">
      <section id={`help-${activeTopic.id}`} className="scroll-mt-4">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="relative h-[11rem] sm:h-[13rem]">
            <ImageWithFallback
              src={activeTopic.image}
              alt={activeTopic.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] text-primary shadow-sm"
                  style={{ fontWeight: 800 }}
                >
                  <activeTopic.icon className="h-3.5 w-3.5" />
                  {activeTopic.title}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[0.6875rem] text-white">
                  <Clock3 className="h-3 w-3" />
                  {activeTopic.readMins} min
                </span>
                {activeTopic.video && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[0.6875rem] text-white">
                    <Play className="h-3 w-3" />
                    {activeTopic.video.length}
                  </span>
                )}
              </div>
              <h2
                className="mt-2 text-[1.45rem] leading-tight text-white sm:text-[1.625rem]"
                style={{ fontWeight: 800 }}
              >
                {activeTopic.title}
              </h2>
              <Text className="mt-1 line-clamp-2 text-[0.8125rem] leading-snug text-white/85">
                {activeTopic.summary}
              </Text>
            </div>
            <button
              type="button"
              onClick={() => onSpeak(`${activeTopic.title}. ${activeTopic.summary}`)}
              className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition hover:bg-white active:scale-95"
              aria-label="Read aloud"
              title="Read aloud"
            >
              <Volume2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <Card
          variant="default"
          padding="md"
          radius="xl"
          className="mt-4 shadow-[0_3px_16px_rgba(0,0,0,0.04)]"
        >
          {activeTopic.render(onJump)}

          {activeTopic.video && (
            <div className="mt-5 flex items-center gap-3 rounded-[1.25rem] border border-border bg-secondary/45 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Play className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <Text className="truncate text-[0.875rem]" style={{ fontWeight: 700 }}>
                  {activeTopic.video.title}
                </Text>
                <Text className="text-[0.75rem] text-muted-foreground">
                  Video walkthrough - {activeTopic.video.length}
                </Text>
              </span>
              <Button variant="outline" size="sm" radius="full" className="shrink-0">
                Watch
              </Button>
            </div>
          )}

          {activeTopic.related.length > 0 && (
            <div className="mt-5">
              <SectionLabel>Related</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {activeTopic.related.map((relatedId) => {
                  const related = sections.find((section) => section.id === relatedId);
                  if (!related) return null;
                  return (
                    <button
                      key={relatedId}
                      type="button"
                      onClick={() => onJump(relatedId)}
                      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary/10 px-3 text-[0.8125rem] text-primary transition hover:bg-primary/15 active:scale-95"
                      style={{ fontWeight: 700 }}
                    >
                      <related.icon className="h-3.5 w-3.5" />
                      {related.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <SectionHelpfulness sectionId={activeTopic.id} onFeedback={onFeedback} />
        </Card>
      </section>

      <div className="flex items-center justify-between gap-3 pt-1">
        <Button
          variant="outline"
          radius="full"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={onGoIndex}
          className="min-h-11"
        >
          All topics
        </Button>
        <Button
          variant="primary"
          radius="full"
          leftIcon={<MessageCircle className="h-4 w-4" />}
          onClick={() => onContactSupport?.()}
          className="min-h-11"
        >
          Contact
        </Button>
      </div>
    </div>
  );
}

function FaqAndFooter({
  faqs,
  expandedFaq,
  onSetExpandedFaq,
  onContactSupport,
}: {
  faqs: ReturnType<typeof buildFaqs>;
  expandedFaq: number | null;
  onSetExpandedFaq: (value: number | null) => void;
  onContactSupport?: () => void;
}) {
  return (
    <>
      <section id="help-faq">
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HelpCircle className="h-5 w-5" />
          </span>
          <div>
            <Heading level={3} className="text-[1.125rem]" style={{ fontWeight: 800 }}>
              Frequently asked
            </Heading>
            <Text className="text-[0.75rem] text-muted-foreground">
              Short answers before you chat with us.
            </Text>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
          {faqs.map((faq, index) => {
            const open = expandedFaq === index;
            return (
              <div
                key={index}
                className={index !== faqs.length - 1 ? "border-b border-border/70" : ""}
              >
                <button
                  type="button"
                  onClick={() => onSetExpandedFaq(open ? null : index)}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition hover:bg-secondary/60"
                >
                  <span className="min-w-0 flex-1 text-[0.875rem]" style={{ fontWeight: 700 }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-[0.875rem] leading-relaxed text-muted-foreground">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-primary/15 bg-primary/8 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(255,56,92,0.22)]">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <Text className="text-[1rem]" style={{ fontWeight: 800 }}>
              Still need a hand?
            </Text>
            <Text className="mt-0.5 text-[0.8125rem] leading-snug text-muted-foreground">
              Support can help with bookings, billing, and account questions.
            </Text>
          </div>
        </div>
        <Button
          variant="primary"
          radius="full"
          fullWidth
          onClick={() => onContactSupport?.()}
          leftIcon={<MessageCircle className="h-4 w-4" />}
          className="mt-4 min-h-11 font-bold"
        >
          Contact support
        </Button>
      </section>

      <Text className="pb-1 pt-1 text-center text-[0.75rem] text-muted-foreground">
        Guide version 1.2 - Updated April 2026
      </Text>
    </>
  );
}

export function HelpCenterPage({
  onBack,
  topicId = null,
  onNavigateTopic,
  onContactSupport,
}: HelpCenterPageProps) {
  const [query, setQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [showTop, setShowTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    if (onNavigateTopic) {
      onNavigateTopic(id);
      return;
    }

    const el = document.getElementById(`help-${id}`);
    const container = scrollRef.current;
    if (!el || !container) return;

    const top =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      12;
    container.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [topicId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    const onScroll = () => setShowTop(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleFeedback = (_id: string, _value: "up" | "down") => {
    // Feedback persistence can be wired to the backend later.
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
    };

    if (typeof navigator !== "undefined" && nav.share) {
      try {
        await nav.share({
          title: "CatchTable Help",
          text: "A quick guide to CatchTable",
          url,
        });
      } catch {
        // User cancelled sharing.
      }
      return;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const sections = useMemo(
    () => buildSections({ jump, onContactSupport }),
    [onContactSupport]
  );
  const faqs = useMemo(() => buildFaqs(jump), []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const base = term
      ? sections.filter(
          (section) =>
            section.title.toLowerCase().includes(term) ||
            section.summary.toLowerCase().includes(term) ||
            section.keywords.toLowerCase().includes(term)
        )
      : sections;

    const pinned = base.filter((section) => section.id === "help-usage");
    const rest = base.filter((section) => section.id !== "help-usage");
    return [...pinned, ...rest];
  }, [query, sections]);

  const activeTopic = topicId
    ? sections.find((section) => section.id === topicId) ?? null
    : null;
  const goIndex = () => (onNavigateTopic ? onNavigateTopic(null) : onBack());

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[250] flex flex-col bg-background text-foreground"
      style={{ bottom: "var(--app-bottom-chrome-height, 0px)" }}
    >
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur-md">
        <div
          className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 pb-3 sm:px-6"
          style={{ paddingTop: "calc(var(--safe-area-inset-top, 0px) + 0.75rem)" }}
        >
          <HeaderIconButton label="Back" onClick={activeTopic ? goIndex : onBack}>
            <ArrowLeft className="h-5 w-5" />
          </HeaderIconButton>
          <div className="min-w-0 flex-1">
            <Heading
              level={3}
              className="truncate text-[1.125rem] leading-tight"
              style={{ fontWeight: 800 }}
            >
              {activeTopic ? activeTopic.title : "Help center"}
            </Heading>
            <Text className="mt-0.5 truncate text-[0.75rem] text-muted-foreground">
              {activeTopic ? activeTopic.summary : "Answers for bookings, payments, and profile"}
            </Text>
          </div>
          {activeTopic && (
            <div className="flex items-center gap-1.5">
              <HeaderIconButton label="Share" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </HeaderIconButton>
              <HeaderIconButton label="Print" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </HeaderIconButton>
            </div>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
        <motion.div
          key={activeTopic?.id ?? "index"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto w-full max-w-3xl space-y-6 px-4 pb-6 pt-5 sm:px-6"
        >
          {!activeTopic ? (
            <>
              <HelpIndexView
                query={query}
                onQueryChange={setQuery}
                sections={sections}
                filtered={filtered}
                onJump={jump}
              />
              <FaqAndFooter
                faqs={faqs}
                expandedFaq={expandedFaq}
                onSetExpandedFaq={setExpandedFaq}
                onContactSupport={onContactSupport}
              />
            </>
          ) : (
            <HelpTopicView
              activeTopic={activeTopic}
              sections={sections}
              onJump={jump}
              onSpeak={speak}
              onFeedback={handleFeedback}
              onGoIndex={goIndex}
              onContactSupport={onContactSupport}
            />
          )}
        </motion.div>

        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed right-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(255,56,92,0.24)] transition hover:scale-105 active:scale-95"
              style={{ bottom: "calc(var(--app-bottom-chrome-height, 0px) + 1rem)" }}
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
