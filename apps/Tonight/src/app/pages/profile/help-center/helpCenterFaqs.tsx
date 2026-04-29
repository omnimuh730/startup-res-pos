import type { FAQ } from "./types";

export function createHelpCenterFaqs(jumpTo: (id: string) => void): FAQ[] {
  return [
    { q: "Is CatchTable free to use?", a: "Yes. Browsing and searching are free. Some optional features (like Pro) have a small monthly fee." },
    { q: "Can I use the app without signing in?", a: <>You can browse Discover and Explorer freely. To save, book, or pay you'll need to <button className="text-primary underline" onClick={() => jumpTo("signin")}>sign in</button>.</> },
    { q: "Do I need to pay a deposit to book?", a: <>Yes — a small deposit holds your table and is fully refunded after you arrive and pay. See <button className="text-primary underline" onClick={() => jumpTo("policy")}>Reservation policy</button>.</> },
    { q: "Can I cancel a booking and get my deposit back?", a: <><b>Cancel more than 2 hours before</b> your seating for a 100% refund. Inside the 2-hour window the booking is locked, and a no-show means the restaurant keeps the deposit. Details in <button className="text-primary underline" onClick={() => jumpTo("policy")}>Reservation policy</button>.</> },
    { q: "How does the restaurant know I actually showed up?", a: <>In the <button className="text-primary underline" onClick={() => jumpTo("dining")}>Dining</button> tab, tap <b>Scan QR</b> at the restaurant — or show your QR for staff to scan. That marks your booking as arrived and protects your deposit.</> },
    { q: "Why can't I write a review yet?", a: <>Reviews unlock automatically once your booking is marked arrived <i>and</i> paid via QR Pay. Booking and reviewing are <b>Pro-only</b>. See <button className="text-primary underline" onClick={() => jumpTo("reviews")}>Reviews</button>.</> },
    { q: "Are my card details safe with QR Pay?", a: "Yes. Your card is never shown to the restaurant — they only see that the payment succeeded." },
    { q: "Can children use this app?", a: "With a parent's help, yes. Parents should set up the account and be present when paying." },
    { q: "How do I change the language?", a: <>Open <b>Profile → Settings → Language</b>. See also <button className="text-primary underline" onClick={() => jumpTo("accessibility")}>Accessibility &amp; comfort</button>.</> },
    { q: "Does the app work without internet?", a: "Browsing needs the internet. If your connection drops, try moving closer to Wi-Fi or switching off Airplane mode." },
  ];
}
