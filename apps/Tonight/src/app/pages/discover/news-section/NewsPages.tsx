import { useState } from "react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { DSBadge } from "../../../components/ds/Badge";
import { ArrowLeft, Clock, RefreshCw, ChevronRight } from "lucide-react";
import type { NewsItem } from "./types";
import { MOCK_NEWS } from "./newsData";
import { CATEGORY_COLOR, fetchNews, timeAgo } from "./newsUtils";

export function NewsDetailPage({ item, onBack, onSelect }: { item: NewsItem; onBack: () => void; onSelect?: (id: string) => void }) {
  const related = MOCK_NEWS.filter((n) => n.id !== item.id).slice(0, 3);
  return (
    <div className="pb-8">
      <div className="sticky top-0 z-20 -mx-4 -mt-6 mb-3 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary" aria-label="Back"><ArrowLeft className="h-5 w-5" /></button>
        <h2 className="flex-1 truncate text-[0.9375rem]" style={{ fontWeight: 600 }}>News & Stories</h2>
      </div>
      <article className="mx-auto max-w-2xl">
        <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
          <ImageWithFallback src={item.image} alt={item.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-3 top-3"><DSBadge variant="solid" color={CATEGORY_COLOR[item.category]} size="sm">{item.category}</DSBadge></div>
        </div>
        <h1 className="mt-5 text-[1.5rem] leading-tight sm:text-[1.75rem]" style={{ fontWeight: 700 }}>{item.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <ImageWithFallback src={item.authorAvatar} alt={item.author} className="h-10 w-10 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-[0.875rem]" style={{ fontWeight: 600 }}>{item.author}</p>
            <p className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground"><Clock className="h-3 w-3" /> {timeAgo(item.publishedAt)} · {item.readMinutes} min read</p>
          </div>
        </div>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">{item.summary}</p>
        <p className="mt-4 whitespace-pre-line text-[0.9375rem] leading-[1.7]">{item.body}</p>
        <div className="mt-6 flex flex-wrap gap-2">{item.tags.map((t) => (<span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-[0.75rem]" style={{ fontWeight: 500 }}>#{t}</span>))}</div>
        {related.length > 0 && (
          <div className="mt-10 border-t border-border pt-6">
            <h3 className="mb-3 text-[1rem]" style={{ fontWeight: 700 }}>More Stories</h3>
            <div className="space-y-3">
              {related.map((n) => (
                <button key={n.id} onClick={() => onSelect?.(n.id)} className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-secondary/30">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl"><ImageWithFallback src={n.image} alt={n.title} className="h-full w-full object-cover" /></div>
                  <div className="min-w-0 flex-1"><p className="line-clamp-2 text-[0.8125rem]" style={{ fontWeight: 600 }}>{n.title}</p><p className="mt-0.5 text-[0.6875rem] text-muted-foreground">{n.category} · {timeAgo(n.publishedAt)}</p></div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
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
      <div className="sticky top-0 z-20 -mx-4 -mt-6 mb-3 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary" aria-label="Back"><ArrowLeft className="h-5 w-5" /></button>
        <h2 className="flex-1 text-[1rem]" style={{ fontWeight: 700 }}>News & Stories</h2>
        <button onClick={refresh} disabled={loading} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-50" aria-label="Refresh"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visible.map((n) => (
          <article key={n.id} onClick={() => onSelect(n.id)} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40">
            <div className="relative h-44 overflow-hidden">
              <ImageWithFallback src={n.image} alt={n.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute left-2 top-2"><DSBadge variant="solid" color={CATEGORY_COLOR[n.category]} size="sm">{n.category}</DSBadge></div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-[0.6875rem] text-white"><Clock className="h-3 w-3" /><span>{timeAgo(n.publishedAt)}</span><span className="opacity-60">·</span><span>{n.readMinutes} min read</span></div>
            </div>
            <div className="p-3.5">
              <h3 className="line-clamp-2 text-[0.9375rem] leading-snug" style={{ fontWeight: 600 }}>{n.title}</h3>
              <p className="mt-1 line-clamp-2 text-[0.8125rem] text-muted-foreground">{n.summary}</p>
              <div className="mt-3 flex items-center gap-2"><ImageWithFallback src={n.authorAvatar} alt={n.author} className="h-5 w-5 rounded-full object-cover" /><span className="truncate text-[0.75rem] text-muted-foreground">{n.author}</span><ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></div>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 && <div className="py-12 text-center text-[0.875rem] text-muted-foreground">No stories yet.</div>}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button onClick={loadMore} disabled={loadingMore} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 transition hover:border-primary/50 hover:bg-primary/5 disabled:opacity-60" style={{ fontWeight: 600 }}>
            {loadingMore ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4 rotate-90" />}
            <span className="text-[0.875rem]">{loadingMore ? "Loading…" : "Show more"}</span>
          </button>
        </div>
      )}
      {!hasMore && items.length > 4 && <p className="mt-6 text-center text-[0.75rem] text-muted-foreground">You've reached the end.</p>}
    </div>
  );
}
