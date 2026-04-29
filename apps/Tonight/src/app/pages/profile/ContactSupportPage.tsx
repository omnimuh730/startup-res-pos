/* Contact Support — Inbox page showing chat history + other contact options */
import { useState } from "react";
import { ArrowLeft, Phone, MessageCircle, Plus, Trash2 } from "lucide-react";
import { HelpChatModal, type ChatSession } from "./HelpChatModal";

export function ContactSupportPage({ onBack }: { onBack: () => void }) {
  
  // Mock history state
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "chat-1",
      date: "Oct 24",
      status: "Closed",
      lastMessage: "Okay, it seems like you want to make a change to your trip...",
      messages: [
        { id: "m1", sender: "agent", text: "Hi Sam, let's get you help.", ts: Date.now() - 100000 },
        { id: "m2", sender: "user", text: "I want to change my reservation", ts: Date.now() - 50000 },
        { id: "m3", sender: "agent", text: "Okay, it seems like you want to make a change to your trip...", ts: Date.now() }
      ]
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const handleUpdateSession = (id: string, messages: any[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        const lastMsg = messages[messages.length - 1];
        let lastText = lastMsg.text || "Sent an option";
        return { ...s, messages, lastMessage: lastText, status: "Open" };
      }
      return s;
    }));
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      date: "Today",
      status: "Open",
      lastMessage: "Started a new conversation",
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const activeSession = activeSessionId ? sessions.find(s => s.id === activeSessionId) || null : null;

  return (
    <div className="fixed inset-0 z-[250] bg-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white/95 backdrop-blur-md shrink-0">
        <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[1.125rem] font-bold text-black absolute left-1/2 -translate-x-1/2">
          Support Inbox
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        
        {/* Support History List */}
        <div>
          <h2 className="text-[1.375rem] font-bold text-black mb-4 tracking-tight">Your conversations</h2>
          
          {sessions.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
              <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-[0.9375rem] font-medium text-black">No recent support chats</p>
              <p className="text-[0.8125rem] text-gray-500 mt-1">When you contact support, your history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className="flex items-start gap-4 p-4 rounded-[1.25rem] border border-black/[0.04] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                    <span className="font-bold text-[0.875rem]">CT</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-black text-[0.9375rem]">Support Team</h3>
                      <span className="text-[0.75rem] text-gray-500 font-medium whitespace-nowrap">{session.date}</span>
                    </div>
                    <p className="text-[0.875rem] text-gray-500 truncate">{session.lastMessage}</p>
                  </div>
                  
                  {/* Delete button appears on group hover */}
                  <button 
                    onClick={(e) => handleDeleteChat(e, session.id)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shrink-0 self-center hover:bg-red-100"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={handleNewChat}
            className="mt-4 w-full py-3.5 rounded-[1rem] bg-black text-white font-bold text-[0.9375rem] flex items-center justify-center gap-2 hover:bg-gray-800 transition active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Report a problem
          </button>
        </div>

        <hr className="border-t border-gray-100" />

        {/* Other Contact Methods */}
        <div>
          <h2 className="text-[1.375rem] font-bold text-black mb-4 tracking-tight">More ways to reach us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <button className="flex items-center gap-4 p-5 rounded-[1.25rem] border border-black/[0.04] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition cursor-pointer text-left">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600">
                <Phone className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-black text-[1rem]">Call Us</h3>
                <p className="text-[0.8125rem] text-gray-500 mt-0.5">24 hours · 7 days a week/7</p>
              </div>
            </button>
            
          </div>
        </div>
      </div>

      {/* Render full screen chat if active */}
      {activeSessionId && (
        <HelpChatModal
          session={activeSession}
          onClose={() => setActiveSessionId(null)}
          onUpdateSession={handleUpdateSession}
        />
      )}
    </div>
  );
}