import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Rating } from "../ds";
import { Heart } from "lucide-react";

export function RatingSection() {
  const [controlled, setControlled] = useState(3);

  return (
    <SectionWrapper
      id="rating-ds"
      title="Rating"
      description="Interactive star rating component with half-star support, sizes, readonly mode, custom icons, and value display."
    >
      <ComponentCard title="Interactive (Default)">
        <div className="space-y-4">
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">Click to rate</p>
            <Rating defaultValue={3} showValue />
          </div>
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">Half-star support</p>
            <Rating defaultValue={3.5} allowHalf showValue />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Controlled">
        <div className="space-y-3">
          <Rating value={controlled} onChange={setControlled} showValue />
          <p className="text-[0.8125rem] text-muted-foreground">
            Current value: <span className="text-foreground">{controlled}</span>
          </p>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setControlled(v)}
                className={`px-2.5 py-1 rounded-lg text-[0.75rem] border cursor-pointer ${
                  controlled === v ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Sizes">
        <div className="space-y-4">
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <div key={size} className="flex items-center gap-4">
              <span className="text-[0.6875rem] text-muted-foreground font-mono w-8">{size}</span>
              <Rating defaultValue={4} size={size} showValue />
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Read-Only">
        <div className="space-y-3">
          <Rating value={4.5} readonly allowHalf showValue showCount count={128} size="md" />
          <Rating value={3.8} readonly allowHalf showValue showCount count={42} size="md" />
          <Rating value={5} readonly showValue showCount count={1024} size="md" />
        </div>
      </ComponentCard>

      <ComponentCard title="Custom Colors">
        <div className="space-y-3">
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-1">Default (primary)</p>
            <Rating defaultValue={4} />
          </div>
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-1">Success green</p>
            <Rating defaultValue={4} color="var(--success)" />
          </div>
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-1">Warning amber</p>
            <Rating defaultValue={4} color="var(--warning)" />
          </div>
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-1">Custom gold</p>
            <Rating defaultValue={4} color="#FFB800" emptyColor="#E5E5E5" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Custom Max & Labels">
        <div className="space-y-3">
          <Rating defaultValue={7} max={10} showValue label="Score:" />
          <Rating defaultValue={2} max={3} showValue label="Difficulty:" />
        </div>
      </ComponentCard>

      <ComponentCard title="Disabled">
        <Rating value={3} disabled showValue />
      </ComponentCard>

      <ComponentCard title="In Context — Review Cards">
        <div className="max-w-md space-y-4">
          {[
            { name: "Sarah M.", rating: 5, text: "Absolutely wonderful experience! Would highly recommend.", date: "2 days ago" },
            { name: "James K.", rating: 4.5, text: "Great stay overall. The view was spectacular.", date: "1 week ago" },
            { name: "Lisa R.", rating: 3, text: "Decent place but could use some improvements.", date: "2 weeks ago" },
          ].map((review) => (
            <div key={review.name} className="p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[0.75rem] text-primary">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-[0.8125rem]">{review.name}</p>
                    <p className="text-[0.6875rem] text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <Rating value={review.rating} readonly allowHalf size="sm" showValue />
              </div>
              <p className="text-[0.8125rem] text-muted-foreground">{review.text}</p>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
