/* Help Center — illustrated, kid-and-elder-friendly guide with cross-links, chat, glossary */
import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Heading, Text } from "../../components/ds/Text";
import { HelpCenterFaqAndFooter } from "./help-center/HelpCenterFaqAndFooter";
import { HelpCenterIndexView } from "./help-center/HelpCenterIndexView";
import { HelpCenterTopicView } from "./help-center/HelpCenterTopicView";
import { buildSections, buildFaqs } from "./help-center/helpCenterContent";
import type { FAQ, Section } from "./help-center/types";

interface HelpCenterPageProps {
  onBack: () => void;
  topicId?: string | null;
  onNavigateTopic?: (id: string | null) => void;
  onContactSupport?: () => void;
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
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleFeedback = (_id: string, _v: "up" | "down") => {
    // could persist later
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const sections: Section[] = useMemo(
    () => buildSections({ jump, onContactSupport }),
    [onContactSupport]
  );
  const faqs: FAQ[] = useMemo(() => buildFaqs(jump), []);

  const filtered = (() => {
    const base = query.trim()
      ? sections.filter((s) => {
          const q = query.toLowerCase();
          return (
            s.title.toLowerCase().includes(q) ||
            s.summary.toLowerCase().includes(q) ||
            s.keywords.toLowerCase().includes(q)
          );
        })
      : sections;
    const pinned = base.filter((s) => s.id === "help-usage");
    const rest = base.filter((s) => s.id !== "help-usage");
    return [...pinned, ...rest];
  })();

  const activeTopic = topicId
    ? sections.find((s) => s.id === topicId) ?? null
    : null;
  const goIndex = () => (onNavigateTopic ? onNavigateTopic(null) : onBack());

  return (
    <div className="fixed inset-0 z-[250] bg-background flex flex-col">
      <div className="shrink-0 sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-3 max-w-3xl mx-auto w-full">
          <button
            onClick={activeTopic ? goIndex : onBack}
            className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center cursor-pointer transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <Heading level={3}>
              {activeTopic ? activeTopic.title : "Help & Guide"}
            </Heading>
            <Text className="text-muted-foreground text-[0.75rem]">
              {activeTopic
                ? activeTopic.summary
                : "A friendly guide for every step"}
            </Text>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-5 pb-24 space-y-7">
          {!activeTopic && (
            <HelpCenterIndexView
              query={query}
              onQueryChange={setQuery}
              sections={sections}
              filtered={filtered}
              onJump={jump}
            />
          )}

          {activeTopic && (
            <HelpCenterTopicView
              activeTopic={activeTopic}
              sections={sections}
              onJump={jump}
              onSpeak={speak}
              onFeedback={handleFeedback}
              onGoIndex={goIndex}
              onContactSupport={onContactSupport}
            />
          )}

          {!activeTopic && (
            <HelpCenterFaqAndFooter
              faqs={faqs}
              expandedFaq={expandedFaq}
              onSetExpandedFaq={setExpandedFaq}
              onContactSupport={onContactSupport}
            />
          )}
        </div>

        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() =>
                scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="fixed bottom-36 right-5 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition z-10"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
