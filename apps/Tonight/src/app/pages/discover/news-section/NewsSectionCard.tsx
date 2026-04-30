import { useCallback, useEffect, useState } from "react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { DragScrollContainer } from "../../shared/DragScrollContainer";
import { SectionHeader } from "../SaveButtons";
import { DSBadge } from "../../../components/ds/Badge";
import { Newspaper, Clock, RefreshCw, AlertCircle, ChevronRight } from "lucide-react";
import type { NewsItem } from "./types";
import { CATEGORY_COLOR, fetchNews, timeAgo } from "./newsUtils";

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

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <SectionHeader title="News & Stories" action="View All" onAction={onViewAll} />
      {lastFetched && !loading && !error && (
        <div className="mb-2 -mt-1 flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
          <Newspaper className="h-3 w-3" />
          <span>Live · updated {timeAgo(lastFetched.toISOString())}</span>
        </div>
      )}

      {loading && (
        <DragScrollContainer className="flex gap-3 pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-64 shrink-0 overflow-hidden rounded-2xl border border-border">
              <div className="h-36 animate-pulse bg-secondary" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
                <div className="h-3.5 w-full animate-pulse rounded bg-secondary" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          ))}
        </DragScrollContainer>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem]" style={{ fontWeight: 600 }}>Couldn't load news</p>
            <p className="truncate text-[0.6875rem] text-muted-foreground">{error}</p>
          </div>
          <button onClick={load} className="flex items-center gap-1 rounded-full bg-destructive px-3 py-1.5 text-[0.75rem] text-white" style={{ fontWeight: 600 }}>
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <DragScrollContainer className="flex gap-3 pb-1">
          {items.map((n, idx) => (
            <article key={n.id} onClick={() => onSelect(n.id)} className={`group ${idx === 0 ? "w-72" : "w-64"} shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40`}>
              <div className={`relative overflow-hidden ${idx === 0 ? "h-40" : "h-36"}`}>
                <ImageWithFallback src={n.image} alt={n.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute left-2 top-2">
                  <DSBadge variant="solid" color={CATEGORY_COLOR[n.category]} size="sm">{n.category}</DSBadge>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-[0.6875rem] text-white">
                  <Clock className="h-3 w-3" />
                  <span>{timeAgo(n.publishedAt)}</span>
                  <span className="opacity-60">·</span>
                  <span>{n.readMinutes} min read</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-[0.875rem] leading-snug" style={{ fontWeight: 600 }}>{n.title}</h3>
                <p className="mt-1 line-clamp-2 text-[0.75rem] text-muted-foreground">{n.summary}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <ImageWithFallback src={n.authorAvatar} alt={n.author} className="h-5 w-5 rounded-full object-cover" />
                  <span className="truncate text-[0.6875rem] text-muted-foreground">{n.author}</span>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </article>
          ))}
          <button onClick={onViewAll} className="group flex w-44 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card transition hover:border-primary/60 hover:bg-primary/5" aria-label="View all news">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><ChevronRight className="h-6 w-6" /></span>
            <span className="text-[0.8125rem]" style={{ fontWeight: 600 }}>View All</span>
            <span className="text-[0.6875rem] text-muted-foreground">Browse stories</span>
          </button>
        </DragScrollContainer>
      )}
    </div>
  );
}
