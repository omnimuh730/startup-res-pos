import { useState } from "react";
import { ArrowLeft, Search, ChevronRight, MessageCircle, CreditCard, User, Utensils, ShieldAlert } from "lucide-react";
import { Stagger, StaggerItem } from "../../components/ds/Animate";

interface HelpCenterPageProps {
  onBack: () => void;
  topicId: string | null;
  onNavigateTopic: (id: string | null) => void;
  onContactSupport: () => void;
}

const HELP_CATEGORIES = [
  { id: "booking", title: "Reservations & Dining", icon: Utensils, articles: 12 },
  { id: "payment", title: "QR Pay & Billing", icon: CreditCard, articles: 8 },
  { id: "account", title: "Account & Profile", icon: User, articles: 6 },
  { id: "safety", title: "Safety & Accessibility", icon: ShieldAlert, articles: 4 },
];

const POPULAR_ARTICLES = [
  { id: "book", title: "How to book a table", excerpt: "Step-by-step guide to making a reservation." },
  { id: "cancel", title: "Canceling or modifying a booking", excerpt: "Learn about cancellation policies and how to change dates." },
  { id: "qrpay", title: "How does QR Pay work?", excerpt: "Pay the bill directly from your phone without waiting." },
  { id: "points", title: "Earning and using reward points", excerpt: "Details on our loyalty tier system and daily bonuses." },
];

export function HelpCenterPage({ onBack, topicId, onNavigateTopic, onContactSupport }: HelpCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // If a specific topic is selected, render the article view
  if (topicId) {
    const article = POPULAR_ARTICLES.find(a => a.id === topicId) || { title: "Help Article", excerpt: "Content for this article." };
    
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col font-sans">
        <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white/95 backdrop-blur-md shrink-0 border-b border-black/[0.04]">
          <button onClick={() => onNavigateTopic(null)} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10" /> {/* Spacer for flex centering if needed */}
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <h1 className="text-[1.75rem] font-bold text-black tracking-tight leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-[1.125rem] text-gray-500 leading-relaxed mb-8">
            {article.excerpt}
          </p>
          
          <div className="prose prose-gray max-w-none text-black">
            <p className="mb-4">
              Here is the detailed content explaining how to resolve this specific issue. To make a change, navigate to the relevant section in your profile or use the action buttons below.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Open the app and navigate to your profile.</li>
              <li>Select the specific setting you want to change.</li>
              <li>Save your preferences.</li>
            </ul>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="font-bold text-[0.875rem]">Note:</span>
              <p className="text-[0.875rem] text-gray-600 mt-1">Some changes might take up to 24 hours to reflect on your account.</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-black/[0.04] bg-white">
          <p className="text-[0.9375rem] font-bold text-black mb-3">Did this answer your question?</p>
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl border border-gray-300 font-medium text-black hover:bg-gray-50 transition cursor-pointer">Yes</button>
            <button className="flex-1 py-3 rounded-xl border border-gray-300 font-medium text-black hover:bg-gray-50 transition cursor-pointer" onClick={onContactSupport}>No, I need help</button>
          </div>
        </div>
      </div>
    );
  }

  // Main Help Center View
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white/95 backdrop-blur-md shrink-0">
        <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto pb-12">
        <Stagger stagger={0.05} className="px-6 py-4">
          
          <StaggerItem preset="fadeInUp">
            <h1 className="text-[2rem] font-bold text-black tracking-tight leading-tight mb-6">
              Hi Alex, how can we help?
            </h1>
            
            {/* Search Bar */}
            <div className="relative mb-10">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search how-tos and more"
                className="w-full pl-12 pr-4 py-4 bg-white rounded-full border border-gray-300 shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-[1rem] text-black outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow placeholder:text-gray-500 font-medium"
              />
            </div>
          </StaggerItem>

          {/* Categories Grid */}
          <StaggerItem preset="fadeInUp">
            <div className="grid grid-cols-2 gap-3 mb-10">
              {HELP_CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  className="text-left p-4 rounded-[1.25rem] bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition cursor-pointer group"
                >
                  <cat.icon className="w-6 h-6 text-black mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <h3 className="font-bold text-[0.9375rem] text-black leading-tight mb-1">{cat.title}</h3>
                  <p className="text-[0.75rem] text-gray-500">{cat.articles} articles</p>
                </button>
              ))}
            </div>
          </StaggerItem>

          {/* Top Articles List */}
          <StaggerItem preset="fadeInUp">
            <h2 className="text-[1.375rem] font-bold text-black tracking-tight mb-4">Popular topics</h2>
            <div className="bg-white rounded-[1.5rem] border border-black/[0.04] shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              {POPULAR_ARTICLES.map((article, idx) => (
                <button
                  key={article.id}
                  onClick={() => onNavigateTopic(article.id)}
                  className={`w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer ${
                    idx !== POPULAR_ARTICLES.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-[1rem] text-black mb-1">{article.title}</h3>
                    <p className="text-[0.8125rem] text-gray-500 line-clamp-1">{article.excerpt}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          </StaggerItem>

          {/* Contact Support Banner */}
          <StaggerItem preset="fadeInUp">
            <div className="mt-10">
              <button
                onClick={onContactSupport}
                className="w-full relative overflow-hidden rounded-[1.5rem] bg-black p-6 text-left hover:bg-gray-900 transition active:scale-[0.98] cursor-pointer group"
              >
                {/* Decorative background shape */}
                <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/[0.08] group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span className="text-[0.8125rem] font-bold uppercase tracking-wider text-white/80">Support</span>
                    </div>
                    <h3 className="text-[1.25rem] font-bold text-white mb-1 tracking-tight">Need more help?</h3>
                    <p className="text-[0.875rem] text-gray-300 leading-snug">Chat with a human agent, email us, or give us a call.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-sm">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            </div>
          </StaggerItem>

        </Stagger>
      </div>
    </div>
  );
}