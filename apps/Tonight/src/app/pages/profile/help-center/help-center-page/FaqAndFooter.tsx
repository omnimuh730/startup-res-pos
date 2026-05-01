import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { Heading, Text } from "../../../../components/ds/Text";
import { type buildFaqs } from "../helpCenterContent";

export function FaqAndFooter({ faqs, expandedFaq, onSetExpandedFaq, onContactSupport }: { faqs: ReturnType<typeof buildFaqs>; expandedFaq: number | null; onSetExpandedFaq: (value: number | null) => void; onContactSupport?: () => void }) {
  return (
    <>
      <section id="help-faq"><div className="mb-3 flex items-center gap-3 px-1"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><HelpCircle className="h-5 w-5" /></span><div><Heading level={3} className="text-[1.125rem]" style={{ fontWeight: 800 }}>Frequently asked</Heading><Text className="text-[0.75rem] text-muted-foreground">Short answers before you chat with us.</Text></div></div><div className="overflow-hidden rounded-[1.5rem] border border-border bg-card">{faqs.map((faq, index) => { const open = expandedFaq === index; return <div key={index} className={index !== faqs.length - 1 ? "border-b border-border/70" : ""}><button type="button" onClick={() => onSetExpandedFaq(open ? null : index)} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition hover:bg-secondary/60"><span className="min-w-0 flex-1 text-[0.875rem]" style={{ fontWeight: 700 }}>{faq.q}</span><ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} /></button><AnimatePresence initial={false}>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"><div className="px-4 pb-4 text-[0.875rem] leading-relaxed text-muted-foreground">{faq.a}</div></motion.div>}</AnimatePresence></div>; })}</div></section>
      <section className="rounded-[1.75rem] border border-primary/15 bg-primary/8 p-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(255,56,92,0.22)]"><MessageCircle className="h-5 w-5" /></span><div className="min-w-0 flex-1"><Text className="text-[1rem]" style={{ fontWeight: 800 }}>Still need a hand?</Text><Text className="mt-0.5 text-[0.8125rem] leading-snug text-muted-foreground">Support can help with bookings, billing, and account questions.</Text></div></div><Button variant="primary" radius="full" fullWidth onClick={() => onContactSupport?.()} leftIcon={<MessageCircle className="h-4 w-4" />} className="mt-4 min-h-11 font-bold">Contact support</Button></section>
      <Text className="pb-1 pt-1 text-center text-[0.75rem] text-muted-foreground">Guide version 1.2 - Updated April 2026</Text>
    </>
  );
}
