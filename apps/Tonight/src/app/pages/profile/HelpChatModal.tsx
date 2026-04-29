/* In-app support chat — Full page view simulating human support */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Plus, CheckCheck, Phone } from "lucide-react";

// Custom Brand Logo
const BrandLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g transform="translate(0, 0)">
      <circle cx="20" cy="50" r="12" fill="#D93844" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M75 85C94.33 85 110 69.33 110 50C110 30.67 94.33 15 75 15C55.67 15 40 30.67 40 50C40 69.33 55.67 85 75 85ZM75 62C81.627 62 87 56.627 87 50C87 43.373 81.627 38 75 38C68.373 38 63 43.373 63 50C63 56.627 68.373 62 75 62Z"
        fill="#D93844"
      />
    </g>
  </svg>
);

export type Sender = "agent" | "user";

export interface ChatMessage {
  id: string;
  sender: Sender;
  text?: string;
  options?: { label: string; payload: string }[];
  ts: number;
}

// Upgraded ChatSession with topic and ticketId to prevent monotonous lists
export interface ChatSession {
  id: string;
  date: string;
  status: "Open" | "Resolved";
  topic: string;
  ticketId: string;
  lastMessage: string;
  messages: ChatMessage[];
}

interface HelpChatScreenProps {
  session: ChatSession | null;
  onClose: () => void;
  onUpdateSession: (id: string, messages: ChatMessage[]) => void;
}

const HUMAN_QUICK_REPLIES: { label: string; payload: string }[] = [
  { label: "I want to change my reservation", payload: "change" },
  { label: "I have a question about QR Pay", payload: "qrpay" },
  { label: "I need to report an issue", payload: "report" },
  { label: "I'd rather type out my issue", payload: "type" },
];

function agentReply(payload: string): ChatMessage[] {
  const now = Date.now();
  const base = (text: string, extras: Partial<ChatMessage> = {}): ChatMessage => ({
    id: `${now}-${Math.random()}`, sender: "agent", text, ts: now, ...extras,
  });
  
  switch (payload) {
    case "change":
      return [
        base("Okay, it seems like you want to make a change to your trip. Do any of these look right?", {
          options: [
            { label: "Change dates or number of guests", payload: "change_details" },
            { label: "Change the name on the reservation", payload: "change_name" },
            { label: "Switch to a different listing", payload: "switch" },
            { label: "Host isn't responding", payload: "host" },
            { label: "I need help with something else", payload: "type" }
          ]
        })
      ];
    case "qrpay":
      return [
        base("I can help with QR Pay! It allows you to pay your bill directly from your phone."),
        base("Are you having trouble scanning the code, or did a payment fail?", {
          options: [
            { label: "Camera won't scan", payload: "camera" },
            { label: "Payment failed/declined", payload: "failed" },
            { label: "Just asking how it works", payload: "type" }
          ]
        })
      ];
    default:
      return [
        base("I'm here to help. Could you give me a few more details about what you need assistance with?"),
      ];
  }
}

export function HelpChatModal({ session, onClose, onUpdateSession }: HelpChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session && session.messages.length > 0) {
      setMessages(session.messages);
    } else if (messages.length === 0) {
      const now = Date.now();
      const initialMsgs: ChatMessage[] = [
        { id: `${now}-1`, sender: "agent", text: "Hi there, let's get you help. We're going to ask you some questions and then connect you with a member of our team.", ts: now },
        { id: `${now}-2`, sender: "agent", text: "How can we help with your account today? Select an option below or type out your issue.", ts: now + 1, options: HUMAN_QUICK_REPLIES },
      ];
      setMessages(initialMsgs);
      if (session) onUpdateSession(session.id, initialMsgs);
    }
  }, [session]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typing]);

  const pushUser = (text: string) => {
    const now = Date.now();
    const newMsgs = [...messages, { id: `${now}-u`, sender: "user" as const, text, ts: now }];
    setMessages(newMsgs);
    if (session) onUpdateSession(session.id, newMsgs);
    return newMsgs;
  };

  const pushAgent = (currentMsgs: ChatMessage[], newAgentMsgs: ChatMessage[]) => {
    const combined = [...currentMsgs, ...newAgentMsgs];
    setMessages(combined);
    if (session) onUpdateSession(session.id, combined);
  };

  const send = (payload: string, displayText?: string) => {
    const updatedMsgs = displayText ? pushUser(displayText) : messages;
    setInput("");
    if (payload === "type") return; 
    
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      pushAgent(updatedMsgs, agentReply(payload));
    }, 1200 + Math.random() * 800);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    send(text, text);
  };

  if (!session) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
      className="fixed inset-0 z-[300] bg-white flex flex-col font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-black/[0.04] bg-white shrink-0 shadow-sm relative z-10">
        <button onClick={onClose} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-50 flex items-center justify-center text-black transition cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Header Branding + Phone Number */}
        <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2">
        <p className="text-[1.25rem] font-medium text-black">
             Support Team
             </p>
          <a href="tel:+18001234567" className="group flex items-center gap-1 mt-1 text-[0.6875rem] text-gray-500 font-medium hover:text-[#D93844] transition-colors cursor-pointer">
            <Phone className="w-2.5 h-2.5 group-hover:text-[#D93844] transition-colors" />
            +1 (800) 123-4567
          </a>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6 bg-white space-y-6 pb-8">
        <div className="text-center">
          <span className="text-[0.875rem] font-bold text-gray-500 tracking-tight">Today</span>
        </div>
        
        {messages.map((m, idx) => {
          const isAgent = m.sender === "agent";
          const nextMessage = messages[idx + 1];
          const isLastInGroup = isAgent && (!nextMessage || nextMessage.sender !== "agent");

          return (
            <ChatBubble 
              key={m.id} 
              msg={m} 
              showAvatar={isLastInGroup}
              onOptionClick={(opt) => send(opt.payload, opt.label)} 
            />
          );
        })}
        
        {/* Typing indicator */}
        {typing && (
          <div className="flex flex-col items-start mt-2">
            <div className="flex items-end gap-3 max-w-[85%]">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm mb-1">
                <BrandLogo className="w-12 h-12" />
              </div>
              <div className="bg-[#f3f4f6] px-4 py-3.5 rounded-2xl rounded-bl-sm flex gap-1 items-center h-[2.875rem]">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
            <span className="text-[0.6875rem] text-gray-400 mt-1.5 ml-11">Support Team is typing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-black/[0.06] bg-white shrink-0" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
        <form onSubmit={onSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
          <button type="button" className="w-[38px] h-[38px] shrink-0 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-black transition cursor-pointer shadow-sm">
            <Plus className="w-5 h-5" strokeWidth={2} />
          </button>
          
          <div className="flex-1 relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              className="w-full pl-4 pr-12 py-[10px] bg-white border border-gray-300 rounded-full text-[0.9375rem] text-black outline-none focus:border-black/30 transition-colors placeholder:text-gray-400 shadow-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className={`absolute right-1.5 w-[30px] h-[30px] flex items-center justify-center rounded-full transition-all cursor-pointer ${
                input.trim() ? 'bg-black text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:text-black'
              }`}
            >
              <Send className="w-4 h-4 ml-[-2px]" strokeWidth={2} /> 
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function ChatBubble({ msg, showAvatar, onOptionClick }: {
  msg: ChatMessage;
  showAvatar?: boolean;
  onOptionClick: (opt: { label: string; payload: string }) => void;
}) {
  const isUser = msg.sender === "user";
  
  return (
    <div className={`flex flex-col mt-2 ${isUser ? "items-end" : "items-start"}`}>
      <div className={`flex items-end gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        
        {/* Agent Avatar */}
        {!isUser && (
          <div className="w-12 h-12 shrink-0 flex items-end justify-center mb-1">
            {showAvatar && (
               <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                 <BrandLogo className="w-12 h-12" />
               </div>
            )}
          </div>
        )}

        <div className="space-y-1.5 w-full">
          {msg.text && (
            <div
              className={`px-4 py-3 rounded-[1.25rem] text-[0.9375rem] leading-relaxed shadow-sm ${
                isUser
                  ? "bg-[#1A1A1A] text-white rounded-br-sm"
                  : "bg-[#f3f4f6] text-black rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          )}
          
          {/* Stacked Options */}
          {msg.options && msg.options.length > 0 && (
            <div className="flex flex-col bg-white border border-black/[0.08] rounded-2xl overflow-hidden mt-2 shadow-sm">
              {msg.options.map((opt, i) => (
                <button
                  key={opt.payload}
                  onClick={() => onOptionClick(opt)}
                  className={`px-4 py-3.5 text-left font-medium text-[0.9375rem] text-black hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer ${
                    i > 0 ? "border-t border-black/[0.06]" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Time / Status */}
      {isUser && (
        <span className="text-[0.6875rem] text-gray-400 mt-1 flex items-center gap-1 font-medium mr-2">
          <CheckCheck className="w-[14px] h-[14px]" /> {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
      {!isUser && showAvatar && !msg.options && (
        <span className="text-[0.6875rem] text-gray-400 mt-1.5 ml-11">Support Team {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      )}
    </div>
  );
}