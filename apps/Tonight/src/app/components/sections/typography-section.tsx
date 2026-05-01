import { SectionWrapper, ComponentCard } from "../section-wrapper";

export function TypographySection() {
  return (
    <SectionWrapper
      id="typography"
      title="Typography"
      description="A comprehensive typographic system covering headings, body text, font weights, line heights, letter spacing, lists, blockquotes, and code."
    >
      <ComponentCard title="Type Scale">
        <div className="space-y-5">
          {[
            { label: "Display", size: "3rem", ex: "Design System" },
            { label: "H1", size: "2.5rem", ex: "Page Title" },
            { label: "H2", size: "2rem", ex: "Section Heading" },
            { label: "H3", size: "1.5rem", ex: "Subsection Heading" },
            { label: "H4", size: "1.25rem", ex: "Card Title" },
            { label: "Body LG", size: "1.125rem", ex: "Large body text for emphasis" },
            { label: "Body", size: "1rem", ex: "Default body text for content paragraphs" },
            { label: "Body SM", size: "0.875rem", ex: "Small body text for secondary content" },
            { label: "Caption", size: "0.75rem", ex: "Captions and helper text" },
            { label: "Overline", size: "0.6875rem", ex: "OVERLINE LABEL TEXT" },
          ].map((item) => (
            <div key={item.label} className="flex items-baseline gap-6 border-b border-border/40 pb-4 last:border-0">
              <div className="w-20 shrink-0">
                <span className="text-[0.6875rem] text-muted-foreground font-mono">{item.label}</span>
                <p className="text-[0.6rem] text-muted-foreground/60 font-mono">{item.size}</p>
              </div>
              <p style={{ fontSize: item.size }} className="tracking-tight leading-tight">
                {item.ex}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Font Weights">
        <div className="space-y-3 max-w-xl">
          {[
            { w: 300, label: "Light" },
            { w: 400, label: "Regular" },
            { w: 500, label: "Medium" },
            { w: 600, label: "Semibold" },
            { w: 700, label: "Bold" },
            { w: 800, label: "Extra Bold" },
          ].map((f) => (
            <div key={f.w} className="flex items-center gap-4">
              <span className="text-[0.6875rem] text-muted-foreground font-mono w-24 shrink-0">{f.w} — {f.label}</span>
              <p className="text-[1.25rem]" style={{ fontWeight: f.w }}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Line Height">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Tight (1.2)", lh: "1.2" },
            { label: "Normal (1.5)", lh: "1.5" },
            { label: "Relaxed (1.8)", lh: "1.8" },
          ].map((l) => (
            <div key={l.label} className="p-4 rounded-xl border border-border">
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">{l.label}</p>
              <p className="text-[0.875rem]" style={{ lineHeight: l.lh }}>
                Typography is the art and technique of arranging type to make written language legible,
                readable, and appealing when displayed.
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Letter Spacing">
        <div className="space-y-4 max-w-xl">
          {[
            { label: "Tighter (-0.05em)", ls: "-0.05em" },
            { label: "Tight (-0.025em)", ls: "-0.025em" },
            { label: "Normal (0)", ls: "0em" },
            { label: "Wide (0.025em)", ls: "0.025em" },
            { label: "Wider (0.05em)", ls: "0.05em" },
            { label: "Widest (0.1em)", ls: "0.1em" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-4">
              <span className="text-[0.6875rem] text-muted-foreground font-mono w-40 shrink-0">{t.label}</span>
              <p className="text-[1rem]" style={{ letterSpacing: t.ls }}>DESIGN SYSTEM</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Text Styles">
        <div className="max-w-2xl space-y-6">
          {/* Paragraph */}
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">Paragraph</p>
            <p className="text-[1rem] leading-relaxed text-foreground">
              Great design systems reduce decision fatigue. By establishing clear patterns,
              teams can focus on building great products instead of debating implementation
              details. <span className="text-primary underline cursor-pointer">Learn more about design systems.</span>
            </p>
          </div>

          {/* Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">Unordered List</p>
              <ul className="space-y-1.5 text-[0.875rem]">
                {["Consistent design tokens", "Reusable components", "Responsive layouts", "Accessible by default"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">Ordered List</p>
              <ol className="space-y-1.5 text-[0.875rem]">
                {["Install the package", "Import components", "Apply your theme", "Ship to production"].map((item, i) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[0.6875rem] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Blockquote */}
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">Blockquote</p>
            <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-[1rem] text-muted-foreground">
              "Design is not just what it looks like and feels like. Design is how it works."
              <span className="block text-[0.8125rem] mt-1 not-italic text-foreground">— Steve Jobs</span>
            </blockquote>
          </div>

          {/* Code */}
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">Inline & Block Code</p>
            <p className="text-[0.875rem] mb-3">
              Use <code className="px-1.5 py-0.5 bg-muted rounded text-[0.8125rem] font-mono text-primary">color-mix()</code> for
              opacity variants and <code className="px-1.5 py-0.5 bg-muted rounded text-[0.8125rem] font-mono text-primary">var(--primary)</code> for tokens.
            </p>
            <pre className="p-4 bg-foreground text-background rounded-xl text-[0.8125rem] font-mono overflow-x-auto">
{`:root {
  --primary: #FF385C;
  --secondary: #f7f7f7;
  --foreground: #222222;
  --radius: 0.75rem;
}`}
            </pre>
          </div>

          {/* Truncation */}
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">Text Truncation</p>
            <div className="space-y-2 max-w-sm">
              <p className="truncate text-[0.875rem] bg-muted/50 px-3 py-2 rounded-lg">
                This is a very long text that should be truncated with an ellipsis at the end of the line.
              </p>
              <p className="line-clamp-2 text-[0.875rem] bg-muted/50 px-3 py-2 rounded-lg">
                This text will be clamped to exactly two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
