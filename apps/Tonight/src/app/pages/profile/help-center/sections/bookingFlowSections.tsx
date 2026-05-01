import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  QrCode,
  Receipt as ReceiptIcon,
  ShieldCheck,
  Sparkles,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";
import { Heading, Text } from "../../../../components/ds/Text";
import { InlineLink, Step, Tip } from "../HelpCenterPrimitives";
import type { Section } from "../types";

export function createBookingFlowSections(): Section[] {
  return [
    {
      id: "book",
      title: "Booking a table",
      icon: Bell,
      summary: "Reserve your seat, pay a small deposit, and lock in your time.",
      keywords: "book reserve table reservation date time guest party deposit pro",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop",
      readMins: 5,
      related: ["policy", "dining", "signin", "enjoy", "reviews"],
      video: { title: "Booking in 45 seconds", length: "0:45" },
      render: (jumpTo) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            Booking means telling the restaurant "please hold a table for me". This needs you to <InlineLink to="signin" onJump={jumpTo}>sign in</InlineLink>, and reservations are a <b>Pro-only</b> feature — see <InlineLink to="profile" onJump={jumpTo}>Profile → Upgrade to Pro</InlineLink>.
          </Text>
          <div className="space-y-3">
            <Step n={1}>Open any restaurant from <InlineLink to="discover" onJump={jumpTo}>Discover</InlineLink>.</Step>
            <Step n={2}>Tap the big <b>Book a Table</b> button at the bottom.</Step>
            <Step n={3}>Choose how many people (guests) will come.</Step>
            <Step n={4}>Pick a <b>date</b>. Use the "Custom" chip at the end of the row to pick any day on the calendar.</Step>
            <Step n={5}>Pick a <b>time</b> from the time chips.</Step>
            <Step n={6}>Enter your name, phone, and any notes (like "window seat" or "allergic to peanuts"). Choose the occasion if you like (birthday, anniversary, etc.).</Step>
            <Step n={7}>Pay the <b>deposit</b> to hold the table. The amount is shown before you confirm and is <b>refunded in full</b> after you arrive and pay your bill.</Step>
            <Step n={8}>Review everything, then tap <b>Confirm</b>. You'll see a success screen, and the booking appears in <InlineLink to="dining" onJump={jumpTo}>Dining</InlineLink>.</Step>
          </div>
          <Tip tone="warn" icon={AlertTriangle}>
            Read the <InlineLink to="policy" onJump={jumpTo}>Reservation policy</InlineLink> before you confirm — it covers the deposit, the 2-hour cancellation window, and what happens if you don't show up.
          </Tip>
          <Tip tone="success" icon={CheckCircle2}>
            A confirmed booking will also send you a reminder in the <InlineLink to="notifications" onJump={jumpTo}>Notifications</InlineLink> list.
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
      render: (jumpTo) => (
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
            <Step n={1}>When you reach the restaurant, open the <InlineLink to="dining" onJump={jumpTo}>Dining</InlineLink> tab and find your booking card.</Step>
            <Step n={2}>Tap <b>Scan QR</b> and point your phone at the restaurant's arrival QR — <i>or</i> tap the small QR icon to <b>show your QR</b> and let a staff member scan it.</Step>
            <Step n={3}>Either way, your booking is marked as <b>arrived</b>. Your deposit is now safe and will come back when you pay the bill via <InlineLink to="qrpay" onJump={jumpTo}>QR Pay</InlineLink>.</Step>
          </div>
          <Tip tone="info" icon={Sparkles}>
            Booking (and leaving a review later) is a <b>Pro-only</b> feature. Free members can browse, save, and search — upgrade any time from <InlineLink to="profile" onJump={jumpTo}>Profile → Upgrade to Pro</InlineLink>.
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
      render: (jumpTo) => (
        <div className="space-y-5">
          <Text className="text-[0.9375rem] leading-relaxed">
            Reviews on CatchTable come from real diners only. The restaurant profile page does <b>not</b> have a "Write review" button — the option appears in your own booking once the meal is <b>paid and completed</b>.
          </Text>
          <div>
            <Heading level={4}>When can I leave a review?</Heading>
            <Text className="text-[0.875rem] text-muted-foreground mt-1">All three must be true:</Text>
            <div className="space-y-2 mt-3">
              <Step n={1}>Your booking is marked <b>arrived</b> (see <InlineLink to="policy" onJump={jumpTo}>arrival verification</InlineLink>).</Step>
              <Step n={2}>You paid through <InlineLink to="qrpay" onJump={jumpTo}>QR Pay</InlineLink>, so the visit shows <b>Completed</b>.</Step>
              <Step n={3}>You're on a <b>Pro</b> plan — reviewing, like booking, is Pro-only.</Step>
            </div>
          </div>
          <div>
            <Heading level={4}>How to leave a review</Heading>
            <div className="space-y-2 mt-3">
              <Step n={1}>Go to <InlineLink to="dining" onJump={jumpTo}>Dining → Visited</InlineLink> and open the completed booking.</Step>
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
      render: (jumpTo) => (
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
            Cancellations only refund the deposit <b>more than 2 hours before</b> your seating. Inside 2 hours the booking is locked, and a no-show means the deposit is kept — full details in <InlineLink to="policy" onJump={jumpTo}>Reservation policy</InlineLink>.
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
      render: (jumpTo) => (
        <div className="space-y-4">
          <Text className="text-[0.9375rem] leading-relaxed">
            When your reservation starts, the <InlineLink to="dining" onJump={jumpTo}>Dining</InlineLink> card turns into an <b>Enjoy Your Meal</b> page. It has three helpers:
          </Text>
          <div className="space-y-3">
            <Step n={1}><b>View menu</b> — see today's dishes and prices. The menu is <b>view only</b>; the waiter will take your order.</Step>
            <Step n={2}><b>Call server</b> — a polite way to ask for help without raising your hand.</Step>
            <Step n={3}><b>Scan &amp; pay</b> — see <InlineLink to="qrpay" onJump={jumpTo}>QR Pay</InlineLink> below.</Step>
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
      render: (jumpTo) => (
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
            A receipt is saved to <InlineLink to="dining" onJump={jumpTo}>Dining → Visited</InlineLink> for your records.
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
      icon: CalendarDays,
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
  ];
}
