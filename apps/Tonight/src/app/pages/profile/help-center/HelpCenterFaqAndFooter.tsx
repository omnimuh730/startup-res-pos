import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../../components/ds/Button";
import { Heading, Text } from "../../../components/ds/Text";
import type { FAQ } from "./types";

interface HelpCenterFaqAndFooterProps {
  faqs: FAQ[];
  expandedFaq: number | null;
  onSetExpandedFaq: (value: number | null) => void;
  onContactSupport?: () => void;
}

export function HelpCenterFaqAndFooter({
  faqs,
  expandedFaq,
  onSetExpandedFaq,
  onContactSupport,
}: HelpCenterFaqAndFooterProps) {
  return (
    <>
      <div id="help-faq" className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "color-mix(in oklab, var(--warning) 15%, transparent)" }}
          >
            <HelpCircle className="w-5 h-5" style={{ color: "var(--warning)" }} />
          </div>
          <Heading level={3}>Frequently asked</Heading>
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {faqs.map((faq, i) => {
            const open = expandedFaq === i;
            return (
              <div key={i} className={i !== faqs.length - 1 ? "border-b border-border" : ""}>
                <button
                  onClick={() => onSetExpandedFaq(open ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/40 transition cursor-pointer"
                >
                  <span className="flex-1 text-[0.8125rem]" style={{ fontWeight: 600 }}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
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
                      <div className="px-4 pb-4 text-[0.875rem] text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl p-5 text-center" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }}>
        <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background: "color-mix(in oklab, var(--primary) 20%, transparent)" }}>
          <MessageCircle className="w-6 h-6" style={{ color: "var(--primary)" }} />
        </div>
        <Text className="text-[1rem]" style={{ fontWeight: 700 }}>
          Still need a hand?
        </Text>
        <Text className="text-muted-foreground text-[0.875rem] mt-1">
          Talk to us — Contact Support lives in your Profile.
        </Text>
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <Button
            variant="primary"
            radius="full"
            onClick={() => onContactSupport?.()}
            leftIcon={<MessageCircle className="w-4 h-4" />}
          >
            Contact support
          </Button>
        </div>
      </div>

      <Text className="text-[0.75rem] text-muted-foreground text-center pt-2">
        Guide version 1.2 · Updated April 2026
      </Text>
    </>
  );
}
