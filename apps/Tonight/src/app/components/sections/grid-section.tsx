import { SectionWrapper, ComponentCard } from "../section-wrapper";

export function GridSection() {
  return (
    <SectionWrapper
      id="grid"
      title="Grid System"
      description="Comprehensive grid layouts including 12-column grids, responsive breakpoints, auto-fit, masonry-style, and asymmetric layouts."
    >
      <ComponentCard title="12-Column Grid">
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-10 rounded-md bg-primary/15 flex items-center justify-center text-[0.6875rem] text-primary font-mono">
                {i + 1}
              </div>
            ))}
          </div>
          {/* Column span examples */}
          {[
            { spans: [12], label: "col-span-12" },
            { spans: [6, 6], label: "col-span-6 x2" },
            { spans: [4, 4, 4], label: "col-span-4 x3" },
            { spans: [3, 3, 3, 3], label: "col-span-3 x4" },
            { spans: [8, 4], label: "col-span-8 + col-span-4" },
            { spans: [3, 6, 3], label: "col-span-3 + 6 + 3" },
            { spans: [2, 8, 2], label: "col-span-2 + 8 + 2" },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-12 gap-2">
              {row.spans.map((span, i) => (
                <div
                  key={i}
                  className="h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-[0.6rem] text-primary font-mono"
                  style={{ gridColumn: `span ${span}` }}
                >
                  {span}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Responsive Breakpoints">
        <div className="space-y-4">
          <p className="text-[0.8125rem] text-muted-foreground">Resize the browser to see the grid adapt.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15 flex items-center justify-center">
                <span className="text-[0.8125rem] text-primary">{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { label: "sm", desc: "640px", cols: "2 cols" },
              { label: "md", desc: "768px", cols: "3 cols" },
              { label: "lg", desc: "1024px", cols: "4 cols" },
              { label: "xl", desc: "1280px", cols: "6 cols" },
            ].map((bp) => (
              <div key={bp.label} className="px-3 py-1.5 rounded-lg bg-muted text-[0.6875rem] font-mono">
                <span className="text-primary">{bp.label}</span>
                <span className="text-muted-foreground"> ({bp.desc}) — {bp.cols}</span>
              </div>
            ))}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Auto-Fit Grid">
        <p className="text-[0.8125rem] text-muted-foreground mb-3">Automatically fills available space with minimum column width.</p>
        <div
          className="gap-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-secondary border border-border flex items-center justify-center">
              <span className="text-[0.875rem] text-muted-foreground">Item {i + 1}</span>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Asymmetric / Dashboard Layout">
        <div className="grid grid-cols-4 grid-rows-3 gap-3 h-[320px]">
          <div className="col-span-2 row-span-2 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[0.875rem] text-primary">
            Main Content
          </div>
          <div className="col-span-2 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-[0.8125rem] text-success">
            Widget A
          </div>
          <div className="rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-[0.8125rem] text-warning">
            Widget B
          </div>
          <div className="rounded-xl bg-info/10 border border-info/20 flex items-center justify-center text-[0.8125rem] text-info">
            Widget C
          </div>
          <div className="col-span-2 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-[0.8125rem] text-destructive">
            Footer Widget
          </div>
          <div className="col-span-2 rounded-xl bg-muted border border-border flex items-center justify-center text-[0.8125rem] text-muted-foreground">
            Sidebar
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Gap Scale">
        <div className="space-y-4">
          {[
            { label: "gap-1 (4px)", cls: "gap-1" },
            { label: "gap-2 (8px)", cls: "gap-2" },
            { label: "gap-3 (12px)", cls: "gap-3" },
            { label: "gap-4 (16px)", cls: "gap-4" },
            { label: "gap-6 (24px)", cls: "gap-6" },
          ].map((g) => (
            <div key={g.label}>
              <span className="text-[0.6875rem] text-muted-foreground font-mono block mb-1">{g.label}</span>
              <div className={`grid grid-cols-6 ${g.cls}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 rounded bg-primary/15" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Holy Grail Layout">
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="bg-primary/10 p-3 text-center text-[0.8125rem] text-primary border-b border-border">Header</div>
          <div className="flex min-h-[200px]">
            <div className="w-32 bg-muted p-3 text-center text-[0.8125rem] text-muted-foreground border-r border-border flex items-center justify-center">
              Nav
            </div>
            <div className="flex-1 p-4 flex items-center justify-center text-[0.875rem] text-muted-foreground">
              Main Content Area
            </div>
            <div className="w-32 bg-muted p-3 text-center text-[0.8125rem] text-muted-foreground border-l border-border flex items-center justify-center">
              Aside
            </div>
          </div>
          <div className="bg-foreground/5 p-3 text-center text-[0.8125rem] text-muted-foreground border-t border-border">Footer</div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
