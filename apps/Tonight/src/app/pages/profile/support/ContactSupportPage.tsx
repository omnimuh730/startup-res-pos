import { useState } from "react";
import { ArrowLeft, MessageCircle, Plus, Trash2, X } from "lucide-react";
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { SupportChatView, type ChatSession } from "./SupportChat";

// Re-using the Custom Logo for consistency
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

export function ContactSupportPage({ onBack }: { onBack: () => void }) {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "chat-1",
      date: "Oct 24",
      status: "Resolved",
      topic: "Reservation Modification",
      ticketId: "#REQ-8921",
      lastMessage: "Okay, it seems like you want to make a change to your trip...",
      messages: [
        { id: "m1", sender: "agent", text: "Hi Sam, let's get you help.", ts: Date.now() - 100000 },
        { id: "m2", sender: "user", text: "I want to change my reservation", ts: Date.now() - 50000 },
        { id: "m3", sender: "agent", text: "Okay, it seems like you want to make a change to your trip...", ts: Date.now() }
      ]
    },
    {
      id: "chat-2",
      date: "Oct 22",
      status: "Resolved",
      topic: "QR Pay Issue",
      ticketId: "#REQ-8744",
      lastMessage: "Your refund has been processed successfully.",
      messages: []
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleUpdateSession = (id: string, messages: any[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        const lastMsg = messages[messages.length - 1];
        let lastText = lastMsg.text || "Sent an option";
        let updatedTopic = s.topic;
        if (s.topic === "New Request" && lastMsg.sender === "user") {
          updatedTopic = lastMsg.text?.slice(0, 30) || "General Query";
        }
        return { ...s, messages, lastMessage: lastText, status: "Open", topic: updatedTopic };
      }
      return s;
    }));
  };

  const handleNewChat = () => {
    const randomTicket = `#REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      date: "Today",
      status: "Open",
      topic: "New Request",
      ticketId: randomTicket,
      lastMessage: "Started a new conversation...",
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
      setSessionToDelete(null);
    }
  };

  const activeSession = activeSessionId ? sessions.find(s => s.id === activeSessionId) || null : null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[250] flex flex-col bg-white font-sans" style={{ bottom: "var(--app-bottom-chrome-height, 0px)" }}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white border-b border-black/[0.04] shrink-0">
        <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[1.125rem] font-bold text-black absolute left-1/2 -translate-x-1/2">
          Support Inbox
        </h1>
        <div className="w-10" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        <div>
          <h2 className="text-[1.375rem] font-bold text-black mb-4 tracking-tight">Your conversations</h2>
          
          {sessions.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
              <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-[0.9375rem] font-medium text-black">No recent support chats</p>
              <p className="text-[0.8125rem] text-gray-500 mt-1">When you contact support, your history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <SwipeableChatItem 
                  key={session.id} 
                  session={session} 
                  onClick={(id) => setActiveSessionId(id)}
                  onDeleteRequest={(id) => setSessionToDelete(id)}
                />
              ))}
            </div>
          )}

          <button 
            onClick={handleNewChat}
            className="mt-6 w-full py-3.5 rounded-2xl bg-black text-white font-bold text-[0.9375rem] flex items-center justify-center gap-2 hover:bg-gray-900 transition active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Start a new conversation
          </button>
        </div>
      </div>

      {/* Full screen active chat */}
      {activeSessionId && (
        <SupportChatView
          session={activeSession}
          onClose={() => setActiveSessionId(null)}
          onUpdateSession={handleUpdateSession}
        />
      )}

      {/* Deletion Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setSessionToDelete(null)}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-sm bg-white rounded-[1.75rem] p-6 shadow-2xl z-10"
          >
            <button 
              onClick={() => setSessionToDelete(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-black transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-[1.25rem] font-bold text-black mb-2 tracking-tight">Delete conversation?</h3>
            <p className="text-[0.9375rem] text-gray-500 leading-relaxed mb-8">
              This action cannot be undone. Are you sure you want to permanently remove this chat history?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setSessionToDelete(null)} 
                className="flex-1 py-3.5 rounded-[1rem] bg-gray-100 text-black font-bold text-[0.9375rem] hover:bg-gray-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3.5 rounded-[1rem] bg-red-500 text-white font-bold text-[0.9375rem] hover:bg-red-600 shadow-sm transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Sub-component handling the Super Smooth Swipe-to-Delete physics
function SwipeableChatItem({ 
  session, 
  onClick, 
  onDeleteRequest 
}: { 
  session: ChatSession; 
  onClick: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const ACTION_WIDTH = -88; // Width of the delete button

  // Dynamically map values based on drag progress for an ultra-smooth feel.
  // The background opacity starts at 0, COMPLETELY removing the bleed issue.
  const actionOpacity = useTransform(x, [-10, -40], [0, 1]);
  const iconScale = useTransform(x, [-40, ACTION_WIDTH], [0.7, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Detect if user swiped far enough or flicked fast enough
    if (offset < -40 || velocity < -400) {
      controls.start({ x: ACTION_WIDTH });
      setIsOpen(true);
    } else {
      controls.start({ x: 0 });
      setIsOpen(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isOpen) {
      // If open, tapping the card snaps it closed instead of opening the chat
      e.preventDefault();
      controls.start({ x: 0 });
      setIsOpen(false);
    } else {
      onClick(session.id);
    }
  };

  return (
    <div className="relative w-full rounded-[1.25rem] bg-transparent touch-pan-y">
      
      {/* Background Action Layer (Fades in dynamically) */}
      <motion.div 
        style={{ opacity: actionOpacity }}
        className="absolute inset-0 bg-red-500 rounded-[1.25rem] flex justify-end overflow-hidden"
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(session.id);
          }}
          className="w-[88px] h-full flex items-center justify-center cursor-pointer active:bg-red-600 transition-colors"
        >
          <motion.div style={{ scale: iconScale }}>
            <Trash2 className="w-6 h-6 text-white" />
          </motion.div>
        </button>
      </motion.div>

      {/* Foreground Swipeable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: ACTION_WIDTH - 20, right: 0 }} // -20 allows playful overpull
        dragElastic={0.15}
        style={{ x }}
        animate={controls}
        transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }} // Tuned for native iOS-like snap
        onDragEnd={handleDragEnd}
        onClick={handleCardClick}
        className="relative z-10 flex items-start gap-4 p-4 w-full rounded-[1.25rem] border border-black/[0.06] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] cursor-pointer"
      >
        {/* Status indicator line on the left edge */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-[1.25rem] ${session.status === 'Open' ? 'bg-black' : 'bg-transparent'}`} />

        {/* Brand Logo Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-50 border border-black/[0.04] flex items-center justify-center shrink-0">
          <BrandLogo className="w-10 h-10 grayscale-[0.2]" />
        </div>

        {/* Message Details */}
        <div className="flex-1 min-w-0 pt-0.5 pointer-events-none">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-black text-[0.9375rem] truncate pr-2 leading-tight">
              {session.topic}
            </h3>
            <span className="text-[0.75rem] text-gray-500 font-medium whitespace-nowrap pt-0.5">
              {session.date}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[0.625rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md leading-none ${
              session.status === 'Open' 
                ? 'bg-[#E5F6ED] text-[#008A44]' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {session.status}
            </span>
            <span className="text-[0.75rem] text-gray-400 font-medium tracking-wide">
              {session.ticketId}
            </span>
          </div>
          
          <p className="text-[0.875rem] text-gray-500 truncate leading-snug">
            {session.lastMessage}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
