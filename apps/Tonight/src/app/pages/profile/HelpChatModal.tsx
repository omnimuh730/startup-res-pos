/* In-app support chat — Full page view simulating human support */
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Send, Plus, CheckCheck } from "lucide-react";

export type Sender = "agent" | "user";

export interface ChatMessage {
  id: string;
  sender: Sender;
  text?: string;
  options?: { label: string; payload: string }[];
  ts: number;
}

export interface ChatSession {
  id: string;
  date: string;
  status: "Open" | "Closed";
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

// Simulated human agent responses
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

  // Load session or initialize a new one
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

  // Auto-scroll to bottom
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
    if (payload === "type") return; // Let user type freely
    
    setTyping(true);
    // Simulate human typing delay
    setTimeout(() => {
      setTyping(false);
      pushAgent(updatedMsgs, agentReply(payload));
    }, 1200 + Math.random() * 800);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    send(text, text); // Treat raw text as unknown payload
  };

  if (!session) return null;

  return (
    // Fixed full screen container with solid white background (No modal overlay!)
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
      className="fixed inset-0 z-[300] bg-white flex flex-col font-sans"
    >
      {/* Header - Airbnb Style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04] bg-white shrink-0">
        <button onClick={onClose} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center text-black transition cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center justify-center">
          <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center mb-1">
            <span className="font-bold text-[0.625rem] tracking-wider">CT</span>
          </div>
          <span className="text-[0.6875rem] font-bold text-black tracking-tight">Support Team</span>
        </div>

        <button className="text-[0.875rem] font-medium text-black px-3 py-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
          Details
        </button>
      </div>

      {/* Messages Area */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6 bg-white space-y-6 pb-8">
        <div className="text-center">
          <span className="text-[0.6875rem] font-bold text-gray-500 tracking-tight">Today</span>
        </div>
        
        {messages.map((m, idx) => {
          // Only show avatar for the last message in a consecutive block from the agent
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
          <div className="flex flex-col items-start">
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="font-bold text-[0.625rem] tracking-wider">CT</span>
              </div>
              <div className="bg-[#f1f1f1] px-4 py-3.5 rounded-2xl rounded-bl-sm flex gap-1 items-center h-[2.875rem]">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
            <span className="text-[0.6875rem] text-gray-500 mt-1.5 ml-10">Support Team is typing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-black/[0.06] bg-white shrink-0" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
        <form onSubmit={onSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
          <button type="button" className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-black transition cursor-pointer shrink-0">
            <Plus className="w-5 h-5" />
          </button>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 bg-white text-[0.9375rem] text-black outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-400"
          />
          
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white disabled:opacity-30 disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer transition shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// Sub-component for rendering individual messages
function ChatBubble({ msg, showAvatar, onOptionClick }: {
  msg: ChatMessage;
  showAvatar?: boolean;
  onOptionClick: (opt: { label: string; payload: string }) => void;
}) {
  const isUser = msg.sender === "user";
  
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        
        {/* Agent Avatar Spacer/Renderer */}
        {!isUser && (
          <div className="w-8 h-8 shrink-0 flex items-end justify-center">
            {showAvatar && (
               <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
                 <span className="font-bold text-[0.625rem] tracking-wider">CT</span>
               </div>
            )}
          </div>
        )}

        <div className="space-y-1.5 w-full">
          {msg.text && (
            <div
              className={`px-4 py-3 rounded-[1.25rem] text-[0.9375rem] leading-relaxed ${
                isUser
                  ? "bg-[#222222] text-white rounded-br-sm shadow-sm"
                  : "bg-[#f1f1f1] text-black rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          )}
          
          {/* Stacked Options (Airbnb Style) */}
          {msg.options && msg.options.length > 0 && (
            <div className="flex flex-col rounded-[1rem] border border-gray-200 overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] mt-2">
              {msg.options.map((opt, i) => (
                <button
                  key={opt.payload}
                  onClick={() => onOptionClick(opt)}
                  className={`px-4 py-4 text-left text-[0.9375rem] text-black hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer ${
                    i > 0 ? "border-t border-gray-200" : ""
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
        <span className="text-[0.625rem] text-gray-400 mt-1.5 flex items-center gap-0.5 font-medium mr-1">
          <CheckCheck className="w-3 h-3" /> {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
      {!isUser && showAvatar && !msg.options && (
        <span className="text-[0.6875rem] text-gray-400 mt-1 ml-10">Support Team {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      )}
    </div>
  );
}