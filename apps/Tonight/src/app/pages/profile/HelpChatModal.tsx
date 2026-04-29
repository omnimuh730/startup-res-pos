/* In-app support chat — simulated assistant with canned answers + free input */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Bot, User as UserIcon, Sparkles, Paperclip, Smile, CheckCheck, Headphones } from "lucide-react";
import { Button } from "../../components/ds/Button";

type Sender = "bot" | "user" | "agent";

interface ChatMessage {
  id: string;
  sender: Sender;
  text?: string;
  chips?: { label: string; payload: string }[];
  link?: { label: string; sectionId: string };
  ts: number;
}

interface HelpChatModalProps {
  open: boolean;
  onClose: () => void;
  onJumpToSection?: (id: string) => void;
}

const QUICK_REPLIES: { label: string; payload: string }[] = [
  { label: "How do I book a table?", payload: "book" },
  { label: "How does QR Pay work?", payload: "qrpay" },
  { label: "Save to Heart list", payload: "saved" },
  { label: "I forgot my password", payload: "password" },
  { label: "Cancel a booking", payload: "cancel" },
  { label: "Talk to a human", payload: "agent" },
];

function botReply(payload: string): ChatMessage[] {
  const now = Date.now();
  const base = (text: string, extras: Partial<ChatMessage> = {}): ChatMessage => ({
    id: `${now}-${Math.random()}`, sender: "bot", text, ts: now, ...extras,
  });
  switch (payload) {
    case "book":
      return [
        base("Booking a table takes about 30 seconds:"),
        base("1) Open a restaurant → 2) Tap Book a Table → 3) Pick guests, date, time → 4) Add your name & phone → 5) Confirm."),
        base("Want the full walkthrough?", { link: { label: "Open the Booking guide", sectionId: "book" } }),
      ];
    case "qrpay":
      return [
        base("QR Pay lets you pay the bill with your phone — no card machine needed."),
        base("Look for the QR code on the receipt, tap the round QR button at the bottom of the app, and point the camera."),
        base("Full steps here:", { link: { label: "Open QR Pay guide", sectionId: "qrpay" } }),
      ];
    case "saved":
      return [
        base("Tap the small heart on any restaurant or food picture. A red heart means it's saved to your Heart list."),
        base("You'll need to be signed in. Open the big heart on Discover to see everything you've saved."),
        base("", { link: { label: "Open the Saving guide", sectionId: "saved" } }),
      ];
    case "password":
      return [
        base("No problem! On the login screen, tap \"Forgot password\" and we'll email you a reset link."),
        base("If the email doesn't arrive in 5 minutes, check your spam folder or try again."),
      ];
    case "cancel":
      return [
        base("You can cancel a booking from the Dining tab: open the booking → tap the menu (•••) → Cancel."),
        base("Most restaurants allow free cancellation up to a few hours before your seating time."),
        base("More details:", { link: { label: "Open the Dining guide", sectionId: "dining" } }),
      ];
    case "agent":
      return [
        base("Connecting you with a human agent… 👩‍💼"),
        base("A support agent is typing…", { sender: "agent" } as Partial<ChatMessage>),
      ];
    default:
      return [
        base("I'm not sure I understood — could you rephrase?"),
        base("You can also pick one of the common topics below, or type your question."),
      ];
  }
}

function heuristicPayload(text: string): string {
  const t = text.toLowerCase();
  if (/(book|reserve|reservation|table)/.test(t)) return "book";
  if (/(qr|pay|bill|scan)/.test(t)) return "qrpay";
  if (/(save|heart|favou?rite|bookmark)/.test(t)) return "saved";
  if (/(password|forgot|reset|login)/.test(t)) return "password";
  if (/(cancel|change)/.test(t)) return "cancel";
  if (/(agent|human|person|real|someone)/.test(t)) return "agent";
  return "__unknown__";
}

export function HelpChatModal({ open, onClose, onJumpToSection }: HelpChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      const now = Date.now();
      setMessages([
        { id: `${now}-welcome`, sender: "bot", text: "Hi there! I'm the CatchTable helper. 🙂", ts: now },
        { id: `${now}-welcome-2`, sender: "bot", text: "Pick a quick topic, or type your question below.", ts: now + 1, chips: QUICK_REPLIES },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const pushUser = (text: string) => {
    const now = Date.now();
    setMessages((m) => [...m, { id: `${now}-u`, sender: "user", text, ts: now }]);
  };
  const pushBot = (msgs: ChatMessage[]) => {
    setMessages((m) => [...m, ...msgs]);
  };

  const send = (payload: string, displayText?: string) => {
    if (displayText) pushUser(displayText);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      pushBot(botReply(payload));
    }, 650 + Math.random() * 400);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    send(heuristicPayload(text), text);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full sm:max-w-md h-[85vh] sm:h-[620px] bg-card sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 p-4"
              style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, #000))" }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[0.9375rem]" style={{ fontWeight: 700 }}>CatchTable Helper</p>
                <p className="text-white/80 text-[0.6875rem]">Online · replies in seconds</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 bg-background space-y-3">
              {messages.map((m) => (
                <ChatBubble key={m.id} msg={m} onChipClick={(chip) => send(chip.payload, chip.label)} onLinkClick={(sid) => { onJumpToSection?.(sid); onClose(); }} />
              ))}
              {typing && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-primary" /></div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer tools */}
            <div className="px-4 py-2 border-t border-border bg-card flex items-center gap-2 overflow-x-auto">
              <Button variant="outline" radius="full" size="xs" leftIcon={<Headphones className="w-3.5 h-3.5" />} onClick={() => send("agent", "Talk to a human")}>Live agent</Button>
              <Button variant="outline" radius="full" size="xs" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={() => send("book", "How do I book a table?")}>Booking</Button>
              <Button variant="outline" radius="full" size="xs" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={() => send("qrpay", "How does QR Pay work?")}>QR Pay</Button>
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="p-3 border-t border-border bg-card flex items-center gap-2">
              <button type="button" className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground transition cursor-pointer">
                <Paperclip className="w-4 h-4" />
              </button>
              <button type="button" className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground transition cursor-pointer">
                <Smile className="w-4 h-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2.5 rounded-full bg-secondary text-[0.9375rem] outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChatBubble({ msg, onChipClick, onLinkClick }: {
  msg: ChatMessage;
  onChipClick: (chip: { label: string; payload: string }) => void;
  onLinkClick: (sectionId: string) => void;
}) {
  const isUser = msg.sender === "user";
  const AvatarIcon = msg.sender === "agent" ? Headphones : msg.sender === "bot" ? Bot : UserIcon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"}`}>
        <AvatarIcon className="w-4 h-4" />
      </div>
      <div className={`max-w-[78%] space-y-1.5 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {msg.text && (
          <div
            className={`px-3.5 py-2.5 rounded-2xl text-[0.9375rem] leading-snug ${
              isUser
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-card border border-border rounded-bl-sm"
            }`}
          >
            {msg.text}
          </div>
        )}
        {msg.link && (
          <button
            onClick={() => onLinkClick(msg.link!.sectionId)}
            className="text-left px-3 py-2 rounded-xl bg-primary/10 text-primary text-[0.8125rem] hover:bg-primary/15 transition cursor-pointer inline-flex items-center gap-1"
            style={{ fontWeight: 600 }}
          >
            📖 {msg.link.label}
          </button>
        )}
        {msg.chips && msg.chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {msg.chips.map((c) => (
              <button
                key={c.payload}
                onClick={() => onChipClick(c)}
                className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-[0.8125rem] hover:bg-primary/10 transition cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
        {isUser && (
          <span className="text-[0.625rem] text-muted-foreground flex items-center gap-0.5">
            <CheckCheck className="w-3 h-3" /> Sent
          </span>
        )}
      </div>
    </motion.div>
  );
}
