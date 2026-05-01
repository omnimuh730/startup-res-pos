import { SectionWrapper, ComponentCard } from "../section-wrapper";

export function LayoutSection() {
  return (
    <SectionWrapper
      id="layout"
      title="Layout & Spacing"
      description="Grid systems, flexbox utilities, and spacing scales for consistent layouts."
    >
      <ComponentCard title="Grid System">
        <div className="space-y-6">
          <div>
            <p className="text-[0.75rem] text-muted-foreground mb-2 font-mono">12-column grid</p>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-10 rounded-md bg-primary/15 flex items-center justify-center text-[0.6875rem] text-primary">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[0.75rem] text-muted-foreground mb-2 font-mono">Responsive columns</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {["col-1", "col-2", "col-3", "col-4"].map((c) => (
                <div key={c} className="h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[0.8125rem] text-primary">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Spacing Scale">
        <div className="space-y-3">
          {[
            { label: "4px (1)", size: "w-1" },
            { label: "8px (2)", size: "w-2" },
            { label: "12px (3)", size: "w-3" },
            { label: "16px (4)", size: "w-4" },
            { label: "24px (6)", size: "w-6" },
            { label: "32px (8)", size: "w-8" },
            { label: "48px (12)", size: "w-12" },
            { label: "64px (16)", size: "w-16" },
            { label: "96px (24)", size: "w-24" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <span className="text-[0.75rem] text-muted-foreground font-mono w-24 shrink-0">{s.label}</span>
              <div className={`${s.size} h-3 rounded-full bg-primary`} />
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Flex Layouts">
        <div className="space-y-4">
          <div>
            <p className="text-[0.75rem] text-muted-foreground mb-2 font-mono">flex justify-between</p>
            <div className="flex justify-between gap-3 p-3 rounded-lg border border-dashed border-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-10 rounded bg-primary/15 flex items-center justify-center text-[0.75rem] text-primary">{i}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[0.75rem] text-muted-foreground mb-2 font-mono">flex items-center gap-4</p>
            <div className="flex items-center gap-4 p-3 rounded-lg border border-dashed border-border">
              <div className="w-12 h-8 rounded bg-primary/15" />
              <div className="w-20 h-12 rounded bg-primary/15" />
              <div className="w-16 h-6 rounded bg-primary/15" />
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Border Radius">
        <div className="flex flex-wrap gap-6 items-end">
          {[
            { label: "none", cls: "rounded-none" },
            { label: "sm", cls: "rounded-sm" },
            { label: "md", cls: "rounded-md" },
            { label: "lg", cls: "rounded-lg" },
            { label: "xl", cls: "rounded-xl" },
            { label: "2xl", cls: "rounded-2xl" },
            { label: "full", cls: "rounded-full" },
          ].map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 bg-primary/15 border border-primary/30 ${r.cls}`} />
              <span className="text-[0.6875rem] text-muted-foreground font-mono">{r.label}</span>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Shadows">
        <div className="flex flex-wrap gap-6 items-end">
          {[
            { label: "sm", cls: "shadow-sm" },
            { label: "default", cls: "shadow" },
            { label: "md", cls: "shadow-md" },
            { label: "lg", cls: "shadow-lg" },
            { label: "xl", cls: "shadow-xl" },
            { label: "2xl", cls: "shadow-2xl" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div className={`w-20 h-20 bg-card rounded-xl ${s.cls}`} />
              <span className="text-[0.6875rem] text-muted-foreground font-mono">{s.label}</span>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
