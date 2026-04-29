import { useEffect, useState, useCallback } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { DragScrollContainer } from "../shared/DragScrollContainer";
import { SectionHeader } from "./SaveButtons";
import { DSBadge } from "../../components/ds/Badge";
import { Newspaper, Clock, RefreshCw, AlertCircle, ArrowLeft, Share2, ChevronRight } from "lucide-react";

export type NewsItem = {
  id: string;
  category: "Trending" | "New Opening" | "Award" | "Event" | "Chef" | "Guide";
  title: string;
  summary: string;
  body: string;
  image: string;
  author: string;
  authorAvatar: string;
  publishedAt: string; // ISO
  readMinutes: number;
  tags: string[];
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "n-101",
    category: "Award",
    title: "Three Bay Area Restaurants Earn Their First Michelin Star",
    summary: "The 2026 Michelin Guide spotlights bold new voices in California fine dining.",
    body: "The 2026 California Michelin Guide unveiled today recognizes three first-time stars across the Bay Area. Inspectors highlighted impeccable seasonal sourcing, technically refined plating and a renewed focus on hospitality. Reservations have already surged 480% in the first 12 hours after the announcement, with most restaurants booked solid through the next eight weeks.",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
    author: "Maya Tanaka",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    publishedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    readMinutes: 4,
    tags: ["Michelin", "Fine Dining", "Bay Area"],
  },
  {
    id: "n-102",
    category: "New Opening",
    title: "Chef Daniel Park Opens Hansik Tasting Counter in Hayes Valley",
    summary: "A 12-seat omakase-style Korean counter brings rare regional dishes to the city.",
    body: "After three years cooking in Seoul and Busan, chef Daniel Park returns with Hansik Counter — a 12-seat tasting room dedicated to lesser-known regional Korean cooking. The 14-course menu draws on hand-foraged seaweeds, slow-aged kimchi, and a brassware-only service tradition. Booking opens Friday at 10 AM and is expected to fill quickly.",
    image: "https://images.unsplash.com/photo-1590189599125-67138c6509ef?w=800&h=600&fit=crop",
    author: "Jin Lee",
    authorAvatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    readMinutes: 3,
    tags: ["Opening", "Korean", "Tasting Menu"],
  },
  {
    id: "n-103",
    category: "Trending",
    title: "Why Everyone Is Suddenly Obsessed with Hand-Pulled Knife Noodles",
    summary: "The texture-forward dish is breaking out of regional menus and into the mainstream.",
    body: "From Flushing to Oakland, knife-cut and hand-pulled noodles are dominating social feeds — and reservation queues. Chefs cite a renewed appetite for craft and visible technique post-pandemic. We round up six counters where the dough hits the table within minutes of being shaped.",
    image: "https://images.unsplash.com/photo-1731460202531-bf8389d565f7?w=800&h=600&fit=crop",
    author: "Renee Cho",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    readMinutes: 5,
    tags: ["Trending", "Noodles", "Asian"],
  },
  {
    id: "n-104",
    category: "Event",
    title: "Spring Truffle Week Returns with 38 Participating Restaurants",
    summary: "April 28 – May 5: prix-fixe truffle menus from $65 across the city.",
    body: "Spring Truffle Week kicks off next Monday with a record 38 participating restaurants. Diners can book curated three-course menus starting at $65, and the festival pass unlocks priority seating at flagship Italian, French, and modern American kitchens.",
    image: "https://images.unsplash.com/photo-1681270507609-e2a5f21969b0?w=800&h=600&fit=crop",
    author: "Marco Bellini",
    authorAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    readMinutes: 2,
    tags: ["Event", "Truffle", "Festival"],
  },
  {
    id: "n-105",
    category: "Chef",
    title: "Pastry Chef Aiko Sato Wins National Dessert of the Year",
    summary: "Her yuzu-pine ice cream sweeps the judges at the 2026 Pastry Awards.",
    body: "Aiko Sato of Patisserie Ume took home the National Dessert of the Year for her yuzu-pine ice cream — a dish nine months in development. Judges praised the layered aromatics and balance of acidity. Tasting menu seats featuring the dish are released every Sunday at midnight.",
    image: "https://images.unsplash.com/photo-1657502996869-6ccd568b9d41?w=800&h=600&fit=crop",
    author: "Hannah Wright",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    readMinutes: 3,
    tags: ["Pastry", "Award", "Dessert"],
  },
  {
    id: "n-106",
    category: "Guide",
    title: "12 Patios Worth Booking Before Summer Hits",
    summary: "Our updated 2026 patio guide ranks the best al fresco dining in the city.",
    body: "We walked, dined and lingered through every notable patio in town. The 2026 list balances skyline views, tree-lined courtyards and sea-breeze terraces. Each pick links to live availability so you can book your table before the crowds arrive.",
    image: "https://images.unsplash.com/photo-1598990386084-8af4dd12b3b4?w=800&h=600&fit=crop",
    author: "Chris Donovan",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    readMinutes: 6,
    tags: ["Guide", "Outdoor", "Summer"],
  },
];

// Mock server fetch with realistic latency + occasional failure for the demo
function fetchNews(): Promise<NewsItem[]> {
  return new Promise((resolve, reject) => {
    const delay = 700 + Math.random() * 700;
    setTimeout(() => {
      // Simulate the very rare hiccup once in a while; default to success.
      if (Math.random() < 0.05) reject(new Error("Network timeout"));
      else resolve(MOCK_NEWS);
    }, delay);
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const CATEGORY_COLOR: Record<NewsItem["category"], "primary" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
  "Trending": "destructive",
  "New Opening": "success",
  "Award": "warning",
  "Event": "info",
  "Chef": "primary",
  "Guide": "secondary",
};

export function NewsSection({ onSelect, onViewAll }: { onSelect: (id: string) => void; onViewAll: () => void }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchNews()
      .then((data) => {
        setItems(data);
        setLastFetched(new Date());
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader
        title="News & Stories"
        action="View All"
        onAction={onViewAll}
      />
      {lastFetched && !loading && !error && (
        <div className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground mb-2 -mt-1">
          <Newspaper className="w-3 h-3" />
          <span>Live · updated {timeAgo(lastFetched.toISOString())}</span>
        </div>
      )}

      {loading && (
        <DragScrollContainer className="flex gap-3 pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-64 rounded-2xl border border-border overflow-hidden">
              <div className="h-36 bg-secondary animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-16 bg-secondary rounded animate-pulse" />
                <div className="h-3.5 w-full bg-secondary rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-secondary rounded animate-pulse" />
              </div>
            </div>
          ))}
        </DragScrollContainer>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[0.8125rem]" style={{ fontWeight: 600 }}>Couldn't load news</p>
            <p className="text-[0.6875rem] text-muted-foreground truncate">{error}</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-destructive text-white text-[0.75rem]"
            style={{ fontWeight: 600 }}
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <DragScrollContainer className="flex gap-3 pb-1">
          {items.map((n, idx) => (
            <article
              key={n.id}
              onClick={() => onSelect(n.id)}
              className={`shrink-0 ${idx === 0 ? "w-72" : "w-64"} rounded-2xl border border-border bg-card overflow-hidden cursor-pointer hover:border-primary/40 transition group`}
            >
              <div className={`relative ${idx === 0 ? "h-40" : "h-36"} overflow-hidden`}>
                <ImageWithFallback src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2 left-2">
                  <DSBadge variant="solid" color={CATEGORY_COLOR[n.category]} size="sm">{n.category}</DSBadge>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-white text-[0.6875rem]">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo(n.publishedAt)}</span>
                  <span className="opacity-60">·</span>
                  <span>{n.readMinutes} min read</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-[0.875rem] leading-snug line-clamp-2" style={{ fontWeight: 600 }}>{n.title}</h3>
                <p className="text-[0.75rem] text-muted-foreground mt-1 line-clamp-2">{n.summary}</p>
                <div className="flex items-center gap-2 mt-2.5">
                  <ImageWithFallback src={n.authorAvatar} alt={n.author} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-[0.6875rem] text-muted-foreground truncate">{n.author}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </article>
          ))}
          <button
            onClick={onViewAll}
            className="shrink-0 w-44 rounded-2xl border-2 border-dashed border-border bg-card hover:border-primary/60 hover:bg-primary/5 transition cursor-pointer flex flex-col items-center justify-center gap-2 group"
            aria-label="View all news"
          >
            <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
              <ChevronRight className="w-6 h-6" />
            </span>
            <span className="text-[0.8125rem]" style={{ fontWeight: 600 }}>View All</span>
            <span className="text-[0.6875rem] text-muted-foreground">Browse stories</span>
          </button>
        </DragScrollContainer>
      )}
    </div>
  );
}

export function NewsDetailPage({ item, onBack, onSelect }: { item: NewsItem; onBack: () => void; onSelect?: (id: string) => void }) {
  const related = MOCK_NEWS.filter((n) => n.id !== item.id).slice(0, 3);
  return (
    <div className="pb-8">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 -mt-6 mb-3 flex items-center gap-3 border-b border-border">
        <button onClick={onBack} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[0.9375rem] truncate flex-1" style={{ fontWeight: 600 }}>News & Stories</h2>
      </div>

      <article className="max-w-2xl mx-auto">
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
          <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <DSBadge variant="solid" color={CATEGORY_COLOR[item.category]} size="sm">{item.category}</DSBadge>
          </div>
        </div>

        <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-tight mt-5" style={{ fontWeight: 700 }}>{item.title}</h1>

        <div className="flex items-center gap-3 mt-4">
          <ImageWithFallback src={item.authorAvatar} alt={item.author} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-[0.875rem]" style={{ fontWeight: 600 }}>{item.author}</p>
            <p className="text-[0.75rem] text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {timeAgo(item.publishedAt)} · {item.readMinutes} min read
            </p>
          </div>
        </div>

        <p className="text-[1.0625rem] text-muted-foreground mt-5 leading-relaxed">{item.summary}</p>
        <p className="text-[0.9375rem] mt-4 leading-[1.7] whitespace-pre-line">{item.body}</p>

        <div className="flex flex-wrap gap-2 mt-6">
          {item.tags.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-secondary text-[0.75rem]" style={{ fontWeight: 500 }}>#{t}</span>
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <h3 className="text-[1rem] mb-3" style={{ fontWeight: 700 }}>More Stories</h3>
            <div className="space-y-3">
              {related.map((n) => (
                <button key={n.id} onClick={() => onSelect?.(n.id)} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/30 transition text-left">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <ImageWithFallback src={n.image} alt={n.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.8125rem] line-clamp-2" style={{ fontWeight: 600 }}>{n.title}</p>
                    <p className="text-[0.6875rem] text-muted-foreground mt-0.5">{n.category} · {timeAgo(n.publishedAt)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

export function NewsListPage({ onBack, onSelect }: { onBack: () => void; onSelect: (id: string) => void }) {
  const [items, setItems] = useState<NewsItem[]>(MOCK_NEWS);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loadingMore, setLoadingMore] = useState(false);

  const refresh = () => {
    setLoading(true);
    fetchNews().then((data) => { setItems(data); setVisibleCount(4); }).finally(() => setLoading(false));
  };

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => { setVisibleCount((v) => Math.min(items.length, v + 4)); setLoadingMore(false); }, 600);
  };

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 -mt-6 mb-3 flex items-center gap-3 border-b border-border">
        <button onClick={onBack} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[1rem] flex-1" style={{ fontWeight: 700 }}>News & Stories</h2>
        <button onClick={refresh} disabled={loading} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center disabled:opacity-50" aria-label="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {visible.map((n) => (
          <article
            key={n.id}
            onClick={() => onSelect(n.id)}
            className="rounded-2xl border border-border bg-card overflow-hidden cursor-pointer hover:border-primary/40 transition group"
          >
            <div className="relative h-44 overflow-hidden">
              <ImageWithFallback src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 left-2">
                <DSBadge variant="solid" color={CATEGORY_COLOR[n.category]} size="sm">{n.category}</DSBadge>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-white text-[0.6875rem]">
                <Clock className="w-3 h-3" />
                <span>{timeAgo(n.publishedAt)}</span>
                <span className="opacity-60">·</span>
                <span>{n.readMinutes} min read</span>
              </div>
            </div>
            <div className="p-3.5">
              <h3 className="text-[0.9375rem] leading-snug line-clamp-2" style={{ fontWeight: 600 }}>{n.title}</h3>
              <p className="text-[0.8125rem] text-muted-foreground mt-1 line-clamp-2">{n.summary}</p>
              <div className="flex items-center gap-2 mt-3">
                <ImageWithFallback src={n.authorAvatar} alt={n.author} className="w-5 h-5 rounded-full object-cover" />
                <span className="text-[0.75rem] text-muted-foreground truncate">{n.author}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-[0.875rem]">No stories yet.</div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition disabled:opacity-60"
            style={{ fontWeight: 600 }}
          >
            {loadingMore ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4 rotate-90" />}
            <span className="text-[0.875rem]">{loadingMore ? "Loading…" : "Show more"}</span>
          </button>
        </div>
      )}

      {!hasMore && items.length > 4 && (
        <p className="text-center text-[0.75rem] text-muted-foreground mt-6">You've reached the end.</p>
      )}
    </div>
  );
}
