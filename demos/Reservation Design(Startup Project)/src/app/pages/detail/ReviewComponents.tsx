/* Review-related components: ReviewCard, RatingBreakdown, WriteReviewModal */
import { useState } from "react";
import { Star, ThumbsUp, X, Send } from "lucide-react";
import { Button } from "../../components/ds/Button";
import type { ReviewEntry } from "./restaurantDetailData";
import { REVIEW_DATA } from "./restaurantDetailData";

const SUB_CATEGORIES: { key: "taste" | "ambience" | "service" | "value"; label: string; emoji: string }[] = [
  { key: "taste", label: "Taste", emoji: "🍴" },
  { key: "ambience", label: "Ambience", emoji: "✨" },
  { key: "service", label: "Service", emoji: "🤝" },
  { key: "value", label: "Value", emoji: "💰" },
];

function avgOf(key: "taste" | "ambience" | "service" | "value"): number {
  const nums = REVIEW_DATA.map((r) => r[key]).filter((v): v is number => typeof v === "number");
  if (!nums.length) return 0;
  return +(nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(1);
}

export function ReviewCard({ review }: { review: ReviewEntry }) {
  const [helpful, setHelpful] = useState(false);
  return (
    <div className="p-4 rounded-xl border border-border bg-card/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[0.8125rem]" style={{ fontWeight: 600 }}>
            {review.name[0]}
          </div>
          <div>
            <p className="text-[0.8125rem]" style={{ fontWeight: 500 }}>{review.name}</p>
            <p className="text-[0.6875rem] text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "fill-warning text-warning" : "text-border"}`} />
          ))}
        </div>
      </div>
      {/* Sub-ratings inline — only show categories the reviewer rated */}
      {SUB_CATEGORIES.some((c) => typeof review[c.key] === "number") && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
          {SUB_CATEGORIES.map((c) => {
            const v = review[c.key];
            if (typeof v !== "number") return null;
            return (
              <span key={c.key} className="text-[0.6875rem] text-muted-foreground flex items-center gap-1">
                {c.emoji} {c.label} <span style={{ fontWeight: 600 }} className="text-foreground">{v}</span>
              </span>
            );
          })}
        </div>
      )}
      <p className="text-[0.8125rem] text-muted-foreground">{review.text}</p>
      <button
        onClick={() => setHelpful(!helpful)}
        className={`mt-2 flex items-center gap-1 text-[0.6875rem] px-2 py-1 rounded-full transition cursor-pointer ${helpful ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary"}`}
      >
        <ThumbsUp className="w-3 h-3" /> Helpful{helpful ? " ✓" : ""}
      </button>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-border bg-card/50 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary" />
          <div className="space-y-1.5">
            <div className="h-3 w-24 bg-secondary rounded" />
            <div className="h-2 w-16 bg-secondary rounded" />
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, j) => (<div key={j} className="w-3.5 h-3.5 rounded-sm bg-secondary" />))}
        </div>
      </div>
      <div className="flex gap-2 mb-2">
        <div className="h-2.5 w-14 bg-secondary rounded" />
        <div className="h-2.5 w-16 bg-secondary rounded" />
        <div className="h-2.5 w-12 bg-secondary rounded" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-secondary rounded" />
        <div className="h-3 w-[85%] bg-secondary rounded" />
        <div className="h-3 w-[60%] bg-secondary rounded" />
      </div>
    </div>
  );
}

export function RatingBreakdown({ rating, reviews }: { rating: number; reviews: number }) {
  const distribution = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 1 },
  ];
  const barColors = ["bg-success", "bg-warning", "bg-destructive", "bg-destructive", "bg-destructive"];

  const subAverages = SUB_CATEGORIES.map((c) => ({ label: `${c.emoji} ${c.label}`, value: avgOf(c.key) }));

  return (
    <div className="p-4 rounded-xl border border-border bg-card/50">
      <div className="flex items-start gap-6">
        <div className="text-center shrink-0">
          <p className="text-[2rem]" style={{ fontWeight: 700 }}>{rating}</p>
          <div className="flex gap-0.5 justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "fill-warning text-warning" : "text-border"}`} />
            ))}
          </div>
          <p className="text-[0.75rem] text-muted-foreground mt-1">{reviews.toLocaleString()} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {distribution.map((d, i) => (
            <div key={d.stars} className="flex items-center gap-2 text-[0.75rem]">
              <span className="w-3 text-right text-muted-foreground">{d.stars}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColors[i]}`} style={{ width: `${d.pct}%` }} />
              </div>
              <span className="w-8 text-right text-muted-foreground">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Sub-category averages */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {subAverages.map(({ label, value }) => (
            <div key={label} className="text-center p-2 rounded-lg bg-secondary/50">
              <p className="text-[0.6875rem] text-muted-foreground mb-0.5">{label}</p>
              <p className="text-[1rem]" style={{ fontWeight: 700 }}>{value}</p>
              <div className="flex gap-0.5 justify-center mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(value) ? "fill-warning text-warning" : "text-border"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WriteReviewModal({ restaurantName, onClose, onSubmit }: {
  restaurantName: string;
  onClose: () => void;
  onSubmit: (review: ReviewEntry) => void;
}) {
  const [name, setName] = useState("");
  const [taste, setTaste] = useState<number | null>(5);
  const [ambience, setAmbience] = useState<number | null>(5);
  const [service, setService] = useState<number | null>(5);
  const [value, setValue] = useState<number | null>(5);
  const [text, setText] = useState("");

  const rated = [taste, ambience, service, value].filter((v): v is number => typeof v === "number");
  const overallRating = rated.length ? +(rated.reduce((s, n) => s + n, 0) / rated.length).toFixed(1) : 0;
  const overallRounded = Math.round(overallRating);

  const handleSubmit = () => {
    const newReview: ReviewEntry = {
      name: name || "Anonymous",
      date: "Today",
      rating: overallRounded,
      taste, ambience, service, value, text,
    };
    onSubmit(newReview);
  };

  const StarSelector = ({ label, emoji, value, onChange }: { label: string; emoji: string; value: number | null; onChange: (v: number | null) => void }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
      <div className="flex items-center gap-2">
        <span className="text-[0.875rem]">{emoji}</span>
        <span className="text-[0.875rem]" style={{ fontWeight: 500 }}>{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} onClick={() => onChange(i + 1)} className="cursor-pointer p-0.5">
            <Star className={`w-5 h-5 transition ${value !== null && i < value ? "fill-warning text-warning" : "text-border hover:text-warning/50"}`} />
          </button>
        ))}
        <button
          onClick={() => onChange(value === null ? 5 : null)}
          className="ml-1 text-[0.6875rem] text-muted-foreground hover:text-foreground cursor-pointer underline underline-offset-2"
        >
          {value === null ? "Rate" : "Skip"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[1.0625rem]" style={{ fontWeight: 700 }}>Write a Review</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 cursor-pointer transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[0.8125rem] text-muted-foreground mb-4">{restaurantName}</p>

          {/* Overall rating (auto-calculated) */}
          <div className="text-center mb-5 p-4 rounded-xl border border-border bg-card/50">
            <p className="text-[0.75rem] text-muted-foreground mb-1">Overall Rating</p>
            <p className="text-[2rem]" style={{ fontWeight: 700 }}>{overallRating}</p>
            <div className="flex gap-0.5 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < overallRounded ? "fill-warning text-warning" : "text-border"}`} />
              ))}
            </div>
            <p className="text-[0.6875rem] text-muted-foreground mt-1">Calculated from sub-ratings</p>
          </div>

          {/* Sub-ratings */}
          <div className="space-y-2 mb-5">
            <StarSelector label="Taste" emoji="🍴" value={taste} onChange={setTaste} />
            <StarSelector label="Ambience" emoji="✨" value={ambience} onChange={setAmbience} />
            <StarSelector label="Service" emoji="🤝" value={service} onChange={setService} />
            <StarSelector label="Value" emoji="💰" value={value} onChange={setValue} />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-[0.8125rem] text-muted-foreground block mb-1.5">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/30 focus:outline-none focus:border-primary text-[0.875rem] transition" />
          </div>

          {/* Review text */}
          <div className="mb-5">
            <label className="text-[0.8125rem] text-muted-foreground block mb-1.5">Your Review</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience..." className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/30 focus:outline-none focus:border-primary text-[0.875rem] transition resize-none" rows={3} />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} className="flex-1 gap-1.5">
              <Send className="w-4 h-4" /> Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
