/* Help Center — illustrated, kid-and-elder-friendly guide with cross-links, chat, glossary */
import { useMemo, useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Search, Compass, Home, UtensilsCrossed, QrCode, Heart, Bell,
  User, MapPin, CalendarDays, Utensils, Receipt as ReceiptIcon,
  ShieldCheck, LogIn, Sparkles, BookOpen, HelpCircle, Mail, MessageCircle,
  CheckCircle2, AlertTriangle, ChevronRight, ChevronDown, Lightbulb,
  ArrowUp, Phone, ThumbsUp, ThumbsDown, Printer, Share2, Play, Volume2,
  Clock3, Accessibility,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../../components/ds/Card";
import { Text, Heading } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { DSBadge } from "../../components/ds/Badge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

type IconType = React.ComponentType<{ className?: string }>;

interface InlineLinkProps {
  to: string;
  onJump: (id: string) => void;
  children: React.ReactNode;
}
function InlineLink({ to, onJump, children }: InlineLinkProps) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onJump(to); }}
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition cursor-pointer inline-flex items-center gap-0.5"
      style={{ fontWeight: 600 }}
    >
      {children}
      <ChevronRight className="w-3 h-3" />
    </button>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <span
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[0.8125rem]"
        style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)", color: "var(--primary)", fontWeight: 700 }}
      >
        {n}
      </span>
      <div className="flex-1 text-[0.9375rem] leading-relaxed pt-1">{children}</div>
    </div>
  );
}

function Tip({ icon: Icon = Lightbulb, tone = "info", children }: { icon?: IconType; tone?: "info" | "warn" | "success"; children: React.ReactNode }) {
  const bg = tone === "warn" ? "color-mix(in oklab, var(--warning) 12%, transparent)"
    : tone === "success" ? "color-mix(in oklab, var(--success) 12%, transparent)"
    : "color-mix(in oklab, var(--primary) 10%, transparent)";
  const fg = tone === "warn" ? "var(--warning)" : tone === "success" ? "var(--success)" : "var(--primary)";
  return (
    <div className="flex gap-3 items-start rounded-xl p-3.5" style={{ background: bg }}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: fg }} />
      <div className="text-[0.875rem] leading-relaxed flex-1">{children}</div>
    </div>
  );
}

function SectionHelpfulness({ sectionId, onFeedback }: { sectionId: string; onFeedback: (id: string, v: "up" | "down") => void }) {
  const [sent, setSent] = useState<"up" | "down" | null>(null);
  return (
    <div className="mt-4 flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-border">
      <Text className="text-[0.8125rem] text-muted-foreground">Was this helpful?</Text>
      <div className="flex items-center gap-2">
        {sent ? (
          <Text className="text-[0.8125rem]" style={{ color: sent === "up" ? "var(--success)" : "var(--muted-foreground)" }}>
            {sent === "up" ? "Thanks for the feedback! 🎉" : "Thanks — we'll make this clearer."}
          </Text>
        ) : (
          <>
            <button onClick={() => { setSent("up"); onFeedback(sectionId, "up"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-secondary/60 transition cursor-pointer text-[0.8125rem]">
              <ThumbsUp className="w-3.5 h-3.5" /> Yes
            </button>
            <button onClick={() => { setSent("down"); onFeedback(sectionId, "down"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-secondary/60 transition cursor-pointer text-[0.8125rem]">
              <ThumbsDown className="w-3.5 h-3.5" /> No
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface Section {
  id: string;
  title: string;
  icon: IconType;
  summary: string;
  keywords: string;
  image: string;
  readMins: number;
  related: string[];
  video?: { title: string; length: string };
  render: (jump: (id: string) => void) => React.ReactNode;
}

interface FAQ {
  q: string;
  a: React.ReactNode;
}


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

  const sections: Section[] = useMemo(() => [
    {
      id: "getting-started",
      title: "Getting started",
      icon: Sparkles,
      summary: "A friendly first look at CatchTable.",
      keywords: "start begin intro first time tutorial how",
      image: "https://images.unsplash.com/photo-1723744910051-da35a92321af?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["discover", "signin", "book"],
      video: { title: "30-second tour", length: "0:32" },
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Welcome! CatchTable helps you <b>find</b> great restaurants, <b>book</b> a table, <b>pay</b> with your phone, and <b>save</b> the places you love. You can look around without signing in. You only need an account when you want to save, book, or pay.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Open the app. The first thing you see is the <InlineLink to="discover" onJump={jump}>Discover</InlineLink> page.</Step>
            <Step n={2}>At the bottom of the screen are four big buttons: Discover, Explorer, Dining, and Profile. In the middle is a round QR button.</Step>
            <Step n={3}>Tap any card or picture to see more about a restaurant or a food.</Step>
            <Step n={4}>When you're ready, tap the heart to save a place, or tap <b>Book</b> to reserve a table.</Step>
          </div>
          <Tip>
            New here? Try <InlineLink to="discover" onJump={jump}>Discover</InlineLink> first to browse, then learn how to <InlineLink to="book" onJump={jump}>book a table</InlineLink>.
          </Tip>
        </div>
      ),
    },
    {
      id: "signin",
      title: "Sign in & accounts",
      icon: LogIn,
      summary: "Why you sometimes need to sign in.",
      keywords: "login register sign up account profile password",
      image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["saved", "book", "profile"],
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Browsing <InlineLink to="discover" onJump={jump}>Discover</InlineLink> and <InlineLink to="explorer" onJump={jump}>Explorer</InlineLink> is always free — no sign-in required. You'll be asked to sign in <b>only</b> when you use features that need your personal data.
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-2 mb-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--success)" }} /><Text style={{ fontWeight: 600 }}>No sign-in needed</Text></div>
              <ul className="text-[0.875rem] text-muted-foreground space-y-1 list-disc pl-4">
                <li>Browsing restaurants</li>
                <li>Searching food or places</li>
                <li>Reading menus &amp; reviews</li>
              </ul>
            </Card>
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-2 mb-1.5"><LogIn className="w-4 h-4" style={{ color: "var(--primary)" }} /><Text style={{ fontWeight: 600 }}>Sign-in required</Text></div>
              <ul className="text-[0.875rem] text-muted-foreground space-y-1 list-disc pl-4">
                <li><InlineLink to="saved" onJump={jump}>Saving to your Heart list</InlineLink></li>
                <li><InlineLink to="book" onJump={jump}>Booking a table</InlineLink></li>
                <li><InlineLink to="qrpay" onJump={jump}>QR Pay</InlineLink></li>
                <li>Dining &amp; Profile tabs</li>
              </ul>
            </Card>
          </div>
          <Tip tone="info" icon={ShieldCheck}>
            When a feature needs you to sign in, a small pop-up appears. Tap <b>Sign in</b> to continue, or <b>Not now</b> to go back.
          </Tip>
        </div>
      ),
    },
    {
      id: "discover",
      title: "Discover page",
      icon: Home,
      summary: "Find restaurants, foods, and promotions.",
      keywords: "discover home search banners categories monthly best",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=600&fit=crop",
      readMins: 3,
      related: ["saved", "book", "explorer"],
      video: { title: "Browsing Discover", length: "1:05" },
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            The <b>Discover</b> page is the front door of the app. Scroll up and down to see featured places, cities, food types, monthly best picks, and more.
          </Text>
          <div className="space-y-3">
            <Step n={1}><b>Search bar</b> at the top — type any restaurant, food, or city name and tap the result.</Step>
            <Step n={2}><b>Big picture banners</b> — drag left or right to see more. Tap the picture to open that collection. Tap <b>View All</b> in the corner to see every banner in a big gallery.</Step>
            <Step n={3}><b>Round category icons</b> — like "Korean", "Italian", "Dessert". Tap any one to see restaurants in that category.</Step>
            <Step n={4}><b>Nearby Me</b> &amp; <b>Local Favourite</b> — these use your location, so they need <InlineLink to="signin" onJump={jump}>sign in</InlineLink>.</Step>
            <Step n={5}>Tap any restaurant card to see the menu, photos, reviews, and a Book button.</Step>
          </div>
          <Tip>
            See a place you like? Tap the little <Heart className="inline w-3.5 h-3.5 text-red-500" fill="currentColor" /> on the picture to <InlineLink to="saved" onJump={jump}>save it</InlineLink> for later.
          </Tip>
        </div>
      ),
    },
    {
      id: "explorer",
      title: "Explorer (map)",
      icon: Compass,
      summary: "Find restaurants on a map near you.",
      keywords: "explorer map directions gps location near",
      image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["discover", "signin"],
      render: () => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            The <b>Explorer</b> tab shows a big map with pins for nearby restaurants. It's great when you want to see what's close to where you are.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Open the Explorer tab (bottom bar, compass icon).</Step>
            <Step n={2}>Drag the map, or pinch to zoom in and out.</Step>
            <Step n={3}>Tap any pin to open that restaurant's page.</Step>
            <Step n={4}>Tap <b>Directions</b> from a restaurant's page to see the route on the map.</Step>
          </div>
          <Tip tone="warn" icon={MapPin}>
            Map features may ask your phone for permission to use your location. If you say no, the map still works — you just won't see "you are here".
          </Tip>
        </div>
      ),
    },
    {
      id: "saved",
      title: "Saving to your Heart list",
      icon: Heart,
      summary: "Keep your favourites in one place.",
      keywords: "save favorite favourite heart bookmark list wishlist",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["signin", "discover"],
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Tap the little heart on any restaurant or food picture to add it to your <b>Heart list</b>. A red heart means it is saved. Tap again to remove.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Tap the heart icon on a card. If you aren't signed in, a pop-up will ask you to <InlineLink to="signin" onJump={jump}>sign in first</InlineLink>.</Step>
            <Step n={2}>Open your list by tapping the big heart at the top-right of the <InlineLink to="discover" onJump={jump}>Discover</InlineLink> page.</Step>
            <Step n={3}>Switch between <b>Restaurants</b> and <b>Foods</b> tabs.</Step>
            <Step n={4}>Tap any saved item to open it again, or tap its heart to remove it from the list.</Step>
          </div>
          <Tip icon={Heart}>
            Saving is free and private — only you can see your Heart list.
          </Tip>
        </div>
      ),
    },
    {
      id: "book",
      title: "Booking a table",
      icon: CalendarDays,
      summary: "Reserve your seat, pay a small deposit, and lock in your time.",
      keywords: "book reserve table reservation date time guest party deposit pro",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop",
      readMins: 5,
      related: ["policy", "dining", "signin", "enjoy", "reviews"],
      video: { title: "Booking in 45 seconds", length: "0:45" },
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Booking means telling the restaurant "please hold a table for me". This needs you to <InlineLink to="signin" onJump={jump}>sign in</InlineLink>, and reservations are a <b>Pro-only</b> feature — see <InlineLink to="profile" onJump={jump}>Profile → Upgrade to Pro</InlineLink>.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Open any restaurant from <InlineLink to="discover" onJump={jump}>Discover</InlineLink>.</Step>
            <Step n={2}>Tap the big <b>Book a Table</b> button at the bottom.</Step>
            <Step n={3}>Choose how many people (guests) will come.</Step>
            <Step n={4}>Pick a <b>date</b>. Use the "Custom" chip at the end of the row to pick any day on the calendar.</Step>
            <Step n={5}>Pick a <b>time</b> from the time chips.</Step>
            <Step n={6}>Enter your name, phone, and any notes (like "window seat" or "allergic to peanuts"). Choose the occasion if you like (birthday, anniversary, etc.).</Step>
            <Step n={7}>Pay the <b>deposit</b> to hold the table. The amount is shown before you confirm and is <b>refunded in full</b> after you arrive and pay your bill.</Step>
            <Step n={8}>Review everything, then tap <b>Confirm</b>. You'll see a success screen, and the booking appears in <InlineLink to="dining" onJump={jump}>Dining</InlineLink>.</Step>
          </div>
          <Tip tone="warn" icon={AlertTriangle}>
            Read the <InlineLink to="policy" onJump={jump}>Reservation policy</InlineLink> before you confirm — it covers the deposit, the 2-hour cancellation window, and what happens if you don't show up.
          </Tip>
          <Tip tone="success" icon={CheckCircle2}>
            A confirmed booking will also send you a reminder in the <InlineLink to="notifications" onJump={jump}>Notifications</InlineLink> list.
          </Tip>
        </div>
      ),
    },
    {
      id: "policy",
      title: "Reservation policy (deposit, cancel, no-show)",
      icon: ShieldCheck,
      summary: "How the deposit, refunds, cancellation window, and no-shows work.",
      keywords: "policy deposit refund cancel cancellation no-show noshow rules terms pro fee",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop",
      readMins: 3,
      related: ["book", "dining", "qrpay", "profile"],
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            To keep tables fair for everyone, every reservation has a small <b>deposit</b> and a simple set of rules. Here's exactly how it works:
          </Text>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 border border-border" style={{ background: "color-mix(in oklab, var(--primary) 6%, transparent)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <ReceiptIcon className="w-4 h-4 text-primary" />
                <Text style={{ fontWeight: 700 }}>Deposit to reserve</Text>
              </div>
              <Text className="text-[0.875rem] text-muted-foreground">You pay a small deposit when you confirm. This holds your table and is shown clearly before you pay.</Text>
            </div>
            <div className="rounded-2xl p-4 border border-border" style={{ background: "color-mix(in oklab, var(--success) 8%, transparent)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: "var(--success)" }} />
                <Text style={{ fontWeight: 700 }}>Cancel early = 100% refund</Text>
              </div>
              <Text className="text-[0.875rem] text-muted-foreground">Cancel <b>more than 2 hours before</b> your seating time and you get your full deposit back, automatically.</Text>
            </div>
            <div className="rounded-2xl p-4 border border-border" style={{ background: "color-mix(in oklab, var(--warning) 10%, transparent)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Clock3 className="w-4 h-4" style={{ color: "var(--warning)" }} />
                <Text style={{ fontWeight: 700 }}>Within 2 hours = locked</Text>
              </div>
              <Text className="text-[0.875rem] text-muted-foreground">Once it's inside the 2-hour window, the booking can no longer be cancelled — the kitchen is already preparing.</Text>
            </div>
            <div className="rounded-2xl p-4 border border-border" style={{ background: "color-mix(in oklab, var(--destructive) 8%, transparent)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="w-4 h-4" style={{ color: "var(--destructive)" }} />
                <Text style={{ fontWeight: 700 }}>No-show = deposit kept</Text>
              </div>
              <Text className="text-[0.875rem] text-muted-foreground">If you don't cancel and don't arrive, the restaurant keeps the deposit to cover the empty seat.</Text>
            </div>
          </div>

          <div className="space-y-3">
            <Text style={{ fontWeight: 700 }} className="text-[0.9375rem]">How we verify that you arrived</Text>
            <Step n={1}>When you reach the restaurant, open the <InlineLink to="dining" onJump={jump}>Dining</InlineLink> tab and find your booking card.</Step>
            <Step n={2}>Tap <b>Scan QR</b> and point your phone at the restaurant's arrival QR — <i>or</i> tap the small QR icon to <b>show your QR</b> and let a staff member scan it.</Step>
            <Step n={3}>Either way, your booking is marked as <b>arrived</b>. Your deposit is now safe and will come back when you pay the bill via <InlineLink to="qrpay" onJump={jump}>QR Pay</InlineLink>.</Step>
          </div>

          <Tip tone="info" icon={Sparkles}>
            Booking (and leaving a review later) is a <b>Pro-only</b> feature. Free members can browse, save, and search — upgrade any time from <InlineLink to="profile" onJump={jump}>Profile → Upgrade to Pro</InlineLink>.
          </Tip>
          <Tip tone="warn" icon={AlertTriangle}>
            Running late? Call the restaurant from the booking detail page. Most places will hold your table for 15 minutes — after that it may be released, and the no-show rule applies.
          </Tip>
        </div>
      ),
    },
    {
      id: "reviews",
      title: "Reviews (after you dine)",
      icon: MessageCircle,
      summary: "When you can review, how to do it, and what each score means.",
      keywords: "review rating stars feedback pro paid completed taste ambience service value money",
      image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&h=600&fit=crop",
      readMins: 3,
      related: ["policy", "dining", "qrpay", "profile"],
      render: (jump) => (
        <div className="space-y-5">
          <Text className="text-[0.9375rem] leading-relaxed">
            Reviews on CatchTable come from real diners only. The restaurant profile page does <b>not</b> have a "Write review" button — the option appears in your own booking once the meal is <b>paid and completed</b>.
          </Text>

          <div>
            <Heading level={4}>When can I leave a review?</Heading>
            <Text className="text-[0.875rem] text-muted-foreground mt-1">All three must be true:</Text>
            <div className="space-y-2 mt-3">
              <Step n={1}>Your booking is marked <b>arrived</b> (see <InlineLink to="policy" onJump={jump}>arrival verification</InlineLink>).</Step>
              <Step n={2}>You paid through <InlineLink to="qrpay" onJump={jump}>QR Pay</InlineLink>, so the visit shows <b>Completed</b>.</Step>
              <Step n={3}>You're on a <b>Pro</b> plan — reviewing, like booking, is Pro-only.</Step>
            </div>
          </div>

          <div>
            <Heading level={4}>How to leave a review</Heading>
            <div className="space-y-2 mt-3">
              <Step n={1}>Go to <InlineLink to="dining" onJump={jump}>Dining → Visited</InlineLink> and open the completed booking.</Step>
              <Step n={2}>Tap <b>Write review</b>. Give an <b>overall</b> star rating (required).</Step>
              <Step n={3}>Optionally rate any of the four sub-categories. You can skip any you don't want to rate — only the ones you score will show up.</Step>
              <Step n={4}>Add a short note (what stood out, what you'd order again) and submit.</Step>
            </div>
          </div>

          <div>
            <Heading level={4}>What each score means</Heading>
            <div className="mt-3 rounded-xl border border-border bg-card/50 divide-y divide-border">
              <div className="p-3">
                <Text style={{ fontWeight: 600 }}>🍴 Taste</Text>
                <Text className="text-[0.8125rem] text-muted-foreground mt-0.5">How the food itself tasted — flavor, freshness, seasoning, execution. Ignore price and service here.</Text>
              </div>
              <div className="p-3">
                <Text style={{ fontWeight: 600 }}>✨ Ambience</Text>
                <Text className="text-[0.8125rem] text-muted-foreground mt-0.5">The room: lighting, noise level, decor, comfort, vibe. Did the space fit the occasion?</Text>
              </div>
              <div className="p-3">
                <Text style={{ fontWeight: 600 }}>🤝 Service</Text>
                <Text className="text-[0.8125rem] text-muted-foreground mt-0.5">Staff attentiveness, timing between courses, friendliness, how issues were handled.</Text>
              </div>
              <div className="p-3">
                <Text style={{ fontWeight: 600 }}>💰 Value</Text>
                <Text className="text-[0.8125rem] text-muted-foreground mt-0.5">How the <i>overall experience</i> measured up to what you paid. A cheap meal can score low on value if it underdelivered; an expensive one can score high if it felt worth every penny.</Text>
              </div>
            </div>
          </div>

          <Tip tone="info" icon={Sparkles}>
            Not every reviewer rates every category — that's by design. Leave blank the ones you can't fairly judge, and the restaurant's averages will only count the scores people actually gave.
          </Tip>
        </div>
      ),
    },
    {
      id: "dining",
      title: "Dining tab (your bookings)",
      icon: UtensilsCrossed,
      summary: "Upcoming, currently dining, and past visits.",
      keywords: "dining reservation upcoming visited cancel edit",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop",
      readMins: 3,
      related: ["book", "policy", "enjoy", "qrpay", "reviews"],
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            The <b>Dining</b> tab is a simple list of all your bookings. Each card has the restaurant name, the date, and the status.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Upcoming bookings say "Left 2h 15m" until your seating time.</Step>
            <Step n={2}>If you're at the restaurant right now, the card shows <b>Now Dining</b> with a red dot.</Step>
            <Step n={3}>When you arrive, tap <b>Scan QR</b> to scan the restaurant's code — or show your own QR for staff to scan — to verify arrival and protect your deposit.</Step>
            <Step n={4}>Past bookings show <b>Visited</b> and a <b>View Receipt</b> button so you can see what you ate and paid. From here you can also <b>Write a review</b>.</Step>
            <Step n={5}>Tap a card to open its details — <b>Get directions</b>, <b>Invite friends</b>, <b>View menu</b>, or <b>Cancel</b> (if more than 2 hours remain).</Step>
          </div>
          <Tip tone="warn" icon={AlertTriangle}>
            Cancellations only refund the deposit <b>more than 2 hours before</b> your seating. Inside 2 hours the booking is locked, and a no-show means the deposit is kept — full details in <InlineLink to="policy" onJump={jump}>Reservation policy</InlineLink>.
          </Tip>
        </div>
      ),
    },
    {
      id: "enjoy",
      title: "While you're at the restaurant",
      icon: Utensils,
      summary: "Menu, servers, and Scan & Pay.",
      keywords: "enjoy meal menu waiter server call pay bill qr",
      image: "https://images.unsplash.com/photo-1753351055117-f24d8baa682e?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["dining", "qrpay"],
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            When your reservation starts, the <InlineLink to="dining" onJump={jump}>Dining</InlineLink> card turns into an <b>Enjoy Your Meal</b> page. It has three helpers:
          </Text>
          <div className="space-y-3">
            <Step n={1}><b>View menu</b> — see today's dishes and prices. The menu is <b>view only</b>; the waiter will take your order.</Step>
            <Step n={2}><b>Call server</b> — a polite way to ask for help without raising your hand.</Step>
            <Step n={3}><b>Scan &amp; pay</b> — see <InlineLink to="qrpay" onJump={jump}>QR Pay</InlineLink> below.</Step>
          </div>
          <Tip>
            Tap the restaurant name at the top of the page to see the full restaurant profile, hours, and reviews.
          </Tip>
        </div>
      ),
    },
    {
      id: "qrpay",
      title: "QR Pay (Scan & Pay)",
      icon: QrCode,
      summary: "Pay the bill by scanning a QR code.",
      keywords: "qr scan pay bill check tip split receipt",
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&h=600&fit=crop",
      readMins: 4,
      related: ["enjoy", "dining", "troubleshoot"],
      video: { title: "Scanning a bill QR", length: "0:58" },
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            At the end of your meal, you can pay without waiting for a card machine. Look for the small QR code on the bill or table.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Tap the big round <b>QR</b> button in the centre of the bottom bar, or tap <b>Scan &amp; Pay</b> from the Enjoy Your Meal page.</Step>
            <Step n={2}>Point your camera at the QR code on the bill.</Step>
            <Step n={3}>Check the items and the total carefully.</Step>
            <Step n={4}>Choose a tip if you want. You can split the bill with friends.</Step>
            <Step n={5}>Tap <b>Pay</b>. The restaurant will see the payment right away.</Step>
          </div>
          <Tip tone="success" icon={ReceiptIcon}>
            A receipt is saved to <InlineLink to="dining" onJump={jump}>Dining → Visited</InlineLink> for your records.
          </Tip>
          <Tip tone="warn" icon={ShieldCheck}>
            Only scan QR codes at the table, printed on the bill, or shown by a staff member. If anything looks odd, ask a server.
          </Tip>
        </div>
      ),
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      summary: "Reminders and updates from restaurants.",
      keywords: "notifications bell reminder updates inbox",
      image: "https://images.unsplash.com/photo-1604872376944-0b0d4e1c8a25?w=1200&h=600&fit=crop",
      readMins: 1,
      related: ["book", "dining"],
      render: () => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            The little bell icon shows messages about your bookings, offers, and important updates. A red number means you have something new.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Tap the bell at the top-right of the screen.</Step>
            <Step n={2}>Unread messages have a coloured dot. Tap one to read and mark it done.</Step>
            <Step n={3}>Use <b>Mark all as read</b> to clear the list quickly.</Step>
          </div>
        </div>
      ),
    },
    {
      id: "profile",
      title: "Profile & settings",
      icon: User,
      summary: "Your name, theme, rewards, and app settings.",
      keywords: "profile settings theme rewards tier balance friends",
      image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["signin", "help-usage"],
      render: () => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            The <b>Profile</b> tab is your personal space. From here you can edit your name, see your rewards balance, change the look of the app, and open Settings.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Tap your name at the top to edit your profile.</Step>
            <Step n={2}>Use the <b>Appearance</b> buttons to change colors or switch to dark mode.</Step>
            <Step n={3}>Open <b>Settings</b> for account, privacy, language, and sound options.</Step>
            <Step n={4}>Tap <b>Help &amp; Guide</b> any time to come back here.</Step>
          </div>
          <Tip tone="info" icon={Sparkles}>
            Earn points every time you dine or refer a friend — points unlock higher reward tiers.
          </Tip>
          <Text className="text-[0.8125rem] text-muted-foreground">Need to sign out? Open <b>Settings</b> and scroll to the bottom.</Text>
        </div>
      ),
    },
    {
      id: "accessibility",
      title: "Accessibility & comfort",
      icon: Accessibility,
      summary: "Larger text, read-aloud, and colour themes.",
      keywords: "accessibility large text read aloud voice contrast theme dark",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=600&fit=crop",
      readMins: 2,
      related: ["profile", "help-usage"],
      render: () => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Make the app comfortable for you. Whether you need bigger letters, spoken text, or a dark screen, we have options.
          </Text>
          <div className="space-y-3">
            <Step n={1}><b>Larger text</b> — use the <i>A+</i> button at the top of this guide to make everything bigger.</Step>
            <Step n={2}><b>Read aloud</b> — tap the speaker icon at the top of any section and the app will read it to you.</Step>
            <Step n={3}><b>Dark mode / themes</b> — change the colour in Profile → Appearance.</Step>
            <Step n={4}><b>Language</b> — go to Profile → Settings → Language.</Step>
          </div>
          <Tip tone="success" icon={Volume2}>
            Read-aloud needs a moment to start on some phones. If nothing happens, check that your phone's volume is on.
          </Tip>
        </div>
      ),
    },
    {
      id: "help-usage",
      title: "How to use this guide",
      icon: BookOpen,
      summary: "Search, links, and quick navigation.",
      keywords: "how use guide help search hyperlink navigation",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=600&fit=crop",
      readMins: 1,
      related: ["getting-started", "accessibility"],
      render: (jump) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">Think of this page as a small book with clickable pages.</Text>
          <div className="space-y-3">
            <Step n={1}>Use the <b>Search</b> box at the top to jump to any topic.</Step>
            <Step n={2}>Every underlined word is a <b>link</b>. Tap it to go to that topic. Try <InlineLink to="qrpay" onJump={jump}>QR Pay</InlineLink>!</Step>
            <Step n={3}>Scroll down — each topic has steps and pictures.</Step>
            <Step n={4}>Tap <b>"Was this helpful?"</b> at the end of a topic to tell us what to improve.</Step>
            <Step n={5}>Still stuck? Tap the floating chat bubble to <InlineLink to="contact" onJump={jump}>talk to us</InlineLink> right now.</Step>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshoot",
      title: "When something goes wrong",
      icon: AlertTriangle,
      summary: "Simple fixes for common problems.",
      keywords: "problem error bug fix help support slow crash",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop",
      readMins: 3,
      related: ["contact", "qrpay", "signin"],
      render: (jump) => (
        <div className="space-y-4">
          <div className="space-y-3">
            <Step n={1}><b>I can't see anything / the page is blank.</b> Pull down to refresh, or close the app and open it again.</Step>
            <Step n={2}><b>My heart isn't turning red.</b> You must <InlineLink to="signin" onJump={jump}>sign in</InlineLink> first to save items.</Step>
            <Step n={3}><b>Booking won't go through.</b> Check your phone number has the right country code.</Step>
            <Step n={4}><b>QR code won't scan.</b> Make sure there is enough light and hold the camera steady.</Step>
            <Step n={5}><b>I forgot my password.</b> On the login screen, tap <b>Forgot password</b>.</Step>
          </div>
          <Tip tone="info" icon={MessageCircle}>
            Still stuck? Jump to <InlineLink to="contact" onJump={jump}>Contact support</InlineLink> and we'll help — or tap the chat bubble at the bottom.
          </Tip>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact support",
      icon: MessageCircle,
      summary: "Chat, email, or call us.",
      keywords: "contact help support email phone chat live agent",
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1200&h=600&fit=crop",
      readMins: 1,
      related: ["troubleshoot", "help-usage"],
      render: () => (
        <div className="space-y-3">
          <Text className="text-[0.9375rem] leading-relaxed">
            Our team replies within 24 hours. Pick whichever is easiest for you.
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={() => onContactSupport?.()}
              className="text-left rounded-xl p-4 border border-primary bg-primary/5 hover:bg-primary/10 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--primary) 20%, transparent)" }}>
                  <MessageCircle className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <Text style={{ fontWeight: 600 }}>Live chat</Text>
                  <Text className="text-muted-foreground text-[0.8125rem]">Fastest · now</Text>
                </div>
              </div>
            </button>
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--info, var(--primary)) 15%, transparent)" }}>
                  <Mail className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <Text style={{ fontWeight: 600 }}>Email</Text>
                  <Text className="text-muted-foreground text-[0.8125rem]">help@catchtable.app</Text>
                </div>
              </div>
            </Card>
            <Card variant="default" padding="md" radius="lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--success) 15%, transparent)" }}>
                  <Phone className="w-5 h-5" style={{ color: "var(--success)" }} />
                </div>
                <div>
                  <Text style={{ fontWeight: 600 }}>Phone</Text>
                  <Text className="text-muted-foreground text-[0.8125rem]">1-800-CATCH-TB</Text>
                </div>
              </div>
            </Card>
          </div>
          <Text className="text-[0.8125rem] text-muted-foreground">Mon–Sun · 08:00–22:00 local time</Text>
        </div>
      ),
    },
  ], []);

  const faqs: FAQ[] = [
    { q: "Is CatchTable free to use?", a: "Yes. Browsing and searching are free. Some optional features (like Pro) have a small monthly fee." },
    { q: "Can I use the app without signing in?", a: <>You can browse Discover and Explorer freely. To save, book, or pay you'll need to <button className="text-primary underline" onClick={() => jump("signin")}>sign in</button>.</> },
    { q: "Do I need to pay a deposit to book?", a: <>Yes — a small deposit holds your table and is fully refunded after you arrive and pay. See <button className="text-primary underline" onClick={() => jump("policy")}>Reservation policy</button>.</> },
    { q: "Can I cancel a booking and get my deposit back?", a: <><b>Cancel more than 2 hours before</b> your seating for a 100% refund. Inside the 2-hour window the booking is locked, and a no-show means the restaurant keeps the deposit. Details in <button className="text-primary underline" onClick={() => jump("policy")}>Reservation policy</button>.</> },
    { q: "How does the restaurant know I actually showed up?", a: <>In the <button className="text-primary underline" onClick={() => jump("dining")}>Dining</button> tab, tap <b>Scan QR</b> at the restaurant — or show your QR for staff to scan. That marks your booking as arrived and protects your deposit.</> },
    { q: "Why can't I write a review yet?", a: <>Reviews unlock automatically once your booking is marked arrived <i>and</i> paid via QR Pay. Booking and reviewing are <b>Pro-only</b>. See <button className="text-primary underline" onClick={() => jump("reviews")}>Reviews</button>.</> },
    { q: "Are my card details safe with QR Pay?", a: "Yes. Your card is never shown to the restaurant — they only see that the payment succeeded." },
    { q: "Can children use this app?", a: "With a parent's help, yes. Parents should set up the account and be present when paying." },
    { q: "How do I change the language?", a: <>Open <b>Profile → Settings → Language</b>. See also <button className="text-primary underline" onClick={() => jump("accessibility")}>Accessibility &amp; comfort</button>.</> },
    { q: "Does the app work without internet?", a: "Browsing needs the internet. If your connection drops, try moving closer to Wi-Fi or switching off Airplane mode." },
  ];

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
      {/* Sticky header */}
      <div className="shrink-0 sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-3 max-w-3xl mx-auto w-full">
          <button onClick={activeTopic ? goIndex : onBack} className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center cursor-pointer transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <Heading level={3}>{activeTopic ? activeTopic.title : "Help & Guide"}</Heading>
            <Text className="text-muted-foreground text-[0.75rem]">{activeTopic ? activeTopic.summary : "A friendly guide for every step"}</Text>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-5 pb-24 space-y-7">
        {!activeTopic && (<>
          {/* Hero */}
          <div
            className="relative overflow-hidden rounded-3xl p-5 sm:p-6"
            style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, transparent), color-mix(in oklab, var(--info, var(--primary)) 14%, transparent))" }}
          >
            <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }} />
            <div className="absolute -bottom-12 -left-10 w-32 h-32 rounded-full" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }} />
            <div className="relative">
              <DSBadge variant="soft" color="primary" size="sm">For everyone · Kids &amp; grown-ups</DSBadge>
              <h2 className="mt-3 text-[1.5rem] sm:text-[1.75rem] leading-tight" style={{ fontWeight: 700 }}>
                How CatchTable works, in plain words.
              </h2>
              <Text className="text-muted-foreground mt-2 leading-relaxed">
                Short steps, pictures, and tips. Tap any topic to open its own page. Need a human? Head to Contact Support from your Profile.
              </Text>
              <div className="mt-4 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search help… e.g. booking, heart, QR"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["book", "qrpay", "saved", "troubleshoot"].map((sid) => {
                  const s = sections.find((x) => x.id === sid);
                  if (!s) return null;
                  return (
                    <button key={sid} onClick={() => jump(sid)}
                      className="text-[0.75rem] px-2.5 py-1 rounded-full bg-background/60 border border-border hover:bg-background transition cursor-pointer">
                      {s.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick-start cards */}
          <div>
            <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>Quick start</Text>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "getting-started", label: "First steps", icon: Sparkles },
                { id: "book", label: "Book a table", icon: CalendarDays },
                { id: "policy", label: "Deposit & cancel rules", icon: ShieldCheck },
                { id: "qrpay", label: "Scan & Pay", icon: QrCode },
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => jump(q.id)}
                  className="flex flex-col items-start gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-secondary/40 transition text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }}>
                    <q.icon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>{q.label}</Text>
                </button>
              ))}
            </div>
          </div>

          {/* Table of contents */}
          <div>
            <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>All topics</Text>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {filtered.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/40 transition cursor-pointer ${i !== filtered.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}>
                    <s.icon className="w-4.5 h-4.5" style={{ color: "var(--primary)" }} />
                  </div>
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
                <div className="px-4 py-6 text-center">
                  <Text className="text-muted-foreground text-[0.875rem]">No topics match "{query}". Try another word.</Text>
                </div>
              )}
            </div>
          </div>

        </>)}

        {activeTopic && (
          <div className="space-y-7">
            {(() => { const s = activeTopic; return (
              <section key={s.id} id={`help-${s.id}`} className="scroll-mt-4">
                {/* Section hero image */}
                <div className="relative rounded-3xl overflow-hidden mb-3" style={{ aspectRatio: "3 / 1" }}>
                  <ImageWithFallback src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)" }} />
                  <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[0.6875rem]" style={{ fontWeight: 700, color: "var(--primary)" }}>
                        <s.icon className="w-3 h-3" /> {s.title}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[0.6875rem]" style={{ fontWeight: 600 }}>
                        <Clock3 className="w-3 h-3" /> {s.readMins} min read
                      </span>
                      {s.video && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[0.6875rem]" style={{ fontWeight: 600 }}>
                          <Play className="w-3 h-3" /> Video · {s.video.length}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white mt-2 text-[1.25rem] sm:text-[1.375rem] leading-tight" style={{ fontWeight: 700 }}>
                      {s.title}
                    </h3>
                    <p className="text-white/80 text-[0.8125rem] mt-0.5">{s.summary}</p>
                  </div>
                  <button
                    onClick={() => speak(`${s.title}. ${s.summary}`)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white cursor-pointer transition"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <Card variant="default" padding="md" radius="lg">
                  {s.render(jump)}

                  {s.video && (
                    <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Play className="w-4 h-4" style={{ color: "var(--primary)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Text className="text-[0.875rem]" style={{ fontWeight: 600 }}>{s.video.title}</Text>
                        <Text className="text-muted-foreground text-[0.75rem]">Video walkthrough · {s.video.length}</Text>
                      </div>
                      <Button variant="outline" size="sm" radius="full">Watch</Button>
                    </div>
                  )}

                  {s.related.length > 0 && (
                    <div className="mt-4">
                      <Text className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2" style={{ fontWeight: 700 }}>Related</Text>
                      <div className="flex flex-wrap gap-2">
                        {s.related.map((rid) => {
                          const r = sections.find((x) => x.id === rid);
                          if (!r) return null;
                          return (
                            <button key={rid} onClick={() => jump(rid)}
                              className="text-[0.8125rem] px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/15 transition cursor-pointer inline-flex items-center gap-1">
                              <r.icon className="w-3.5 h-3.5" /> {r.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <SectionHelpfulness sectionId={s.id} onFeedback={handleFeedback} />
                </Card>
              </section>
            ); })()}

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="outline" radius="full" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={goIndex}>All topics</Button>
              <Button variant="primary" radius="full" leftIcon={<MessageCircle className="w-4 h-4" />} onClick={() => onContactSupport?.()}>Contact support</Button>
            </div>
          </div>
        )}

        {!activeTopic && (<>
          {/* FAQ */}
          <div id="help-faq" className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--warning) 15%, transparent)" }}>
                <HelpCircle className="w-5 h-5" style={{ color: "var(--warning)" }} />
              </div>
              <Heading level={3}>Frequently asked</Heading>
            </div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {faqs.map((f, i) => {
                const open = expandedFaq === i;
                return (
                  <div key={i} className={i !== faqs.length - 1 ? "border-b border-border" : ""}>
                    <button
                      onClick={() => setExpandedFaq(open ? null : i)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/40 transition cursor-pointer"
                    >
                      <span className="flex-1 text-[0.8125rem]" style={{ fontWeight: 600 }}>{f.q}</span>
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
                          <div className="px-4 pb-4 text-[0.875rem] text-muted-foreground leading-relaxed">{f.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer card */}
          <div className="rounded-3xl p-5 text-center" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }}>
            <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background: "color-mix(in oklab, var(--primary) 20%, transparent)" }}>
              <MessageCircle className="w-6 h-6" style={{ color: "var(--primary)" }} />
            </div>
            <Text className="text-[1rem]" style={{ fontWeight: 700 }}>Still need a hand?</Text>
            <Text className="text-muted-foreground text-[0.875rem] mt-1">Talk to us — Contact Support lives in your Profile.</Text>
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              <Button variant="primary" radius="full" onClick={() => onContactSupport?.()} leftIcon={<MessageCircle className="w-4 h-4" />}>Contact support</Button>
            </div>
          </div>

          <Text className="text-[0.75rem] text-muted-foreground text-center pt-2">Guide version 1.2 · Updated April 2026</Text>
        </>)}
        </div>

        {/* Back to top */}
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
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
