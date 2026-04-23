import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { User, ChevronRight, Loader2 } from "lucide-react";

export function ExtrasSection({ avatarUrl }: { avatarUrl: string }) {
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [sliderVal, setSliderVal] = useState(40);

  return (
    <SectionWrapper
      id="extras"
      title="More Components"
      description="Avatars, tooltips, sliders, skeletons, breadcrumbs, empty states, and dividers."
    >
      {/* Avatars */}
      <ComponentCard title="Avatars">
        <div className="flex flex-wrap items-end gap-4">
          {[8, 10, 12, 16].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className="rounded-full overflow-hidden" style={{ width: `${s * 4}px`, height: `${s * 4}px` }}>
                <ImageWithFallback src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-[0.6875rem] text-muted-foreground">{s * 4}px</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[0.875rem]">JD</div>
            <span className="text-[0.6875rem] text-muted-foreground">initials</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-[0.6875rem] text-muted-foreground">fallback</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full overflow-hidden border-2 border-background">
                  <ImageWithFallback src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[0.75rem] text-muted-foreground">+5</div>
            </div>
            <span className="text-[0.6875rem] text-muted-foreground">group</span>
          </div>
        </div>
      </ComponentCard>

      {/* Slider / Range */}
      <ComponentCard title="Slider / Range">
        <div className="max-w-md space-y-5">
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-[0.8125rem]">Price range</label>
              <span className="text-[0.8125rem] text-muted-foreground">${sliderVal}</span>
            </div>
            <input
              type="range" min="0" max="100" value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
              <span>$0</span><span>$100</span>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Tooltips */}
      <ComponentCard title="Tooltips">
        <div className="flex flex-wrap gap-4">
          {["Top", "Right", "Bottom", "Left"].map((dir) => (
            <div key={dir} className="relative">
              <button
                onMouseEnter={() => setTooltipVisible(dir)}
                onMouseLeave={() => setTooltipVisible(null)}
                className="px-4 py-2 text-[0.875rem] border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              >
                Hover ({dir})
              </button>
              {tooltipVisible === dir && (
                <div className={`absolute z-10 px-3 py-1.5 text-[0.75rem] bg-foreground text-background rounded-lg whitespace-nowrap ${
                  dir === "Top" ? "bottom-full left-1/2 -translate-x-1/2 mb-2" :
                  dir === "Bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2" :
                  dir === "Left" ? "right-full top-1/2 -translate-y-1/2 mr-2" :
                  "left-full top-1/2 -translate-y-1/2 ml-2"
                }`}>
                  Tooltip on {dir.toLowerCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Skeletons */}
      <ComponentCard title="Skeleton Loading">
        <div className="max-w-md space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-secondary rounded animate-pulse w-1/3" />
              <div className="h-3 bg-secondary rounded animate-pulse w-2/3" />
            </div>
          </div>
          <div className="h-32 bg-secondary rounded-xl animate-pulse" />
          <div className="flex gap-3">
            <div className="h-8 bg-secondary rounded-lg animate-pulse flex-1" />
            <div className="h-8 bg-secondary rounded-lg animate-pulse w-20" />
          </div>
        </div>
      </ComponentCard>

      {/* Loading Spinners */}
      <ComponentCard title="Loading Spinners">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <span className="text-[0.875rem] text-muted-foreground">Various spinner styles</span>
        </div>
      </ComponentCard>

      {/* Breadcrumbs */}
      <ComponentCard title="Breadcrumbs">
        <div className="space-y-4">
          <nav className="flex items-center gap-1.5 text-[0.8125rem]">
            <span className="text-muted-foreground hover:text-foreground cursor-pointer">Home</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground hover:text-foreground cursor-pointer">Components</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Breadcrumbs</span>
          </nav>
          <nav className="flex items-center gap-2 text-[0.8125rem]">
            <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground hover:text-foreground cursor-pointer">Dashboard</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground hover:text-foreground cursor-pointer">Settings</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">Profile</span>
          </nav>
        </div>
      </ComponentCard>

      {/* Empty States */}
      <ComponentCard title="Empty States">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-8 rounded-xl border border-dashed border-border text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <p className="text-[0.9375rem] mb-1">No messages yet</p>
            <p className="text-[0.8125rem] text-muted-foreground mb-4">Start a conversation to see messages here.</p>
            <button className="px-4 py-2 text-[0.8125rem] bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90">New Message</button>
          </div>
          <div className="p-8 rounded-xl border border-dashed border-border text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p className="text-[0.9375rem] mb-1">No files uploaded</p>
            <p className="text-[0.8125rem] text-muted-foreground mb-4">Drag & drop files or click to browse.</p>
            <button className="px-4 py-2 text-[0.8125rem] border border-border rounded-lg cursor-pointer hover:bg-secondary">Upload Files</button>
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
