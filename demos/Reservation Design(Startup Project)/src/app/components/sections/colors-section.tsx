import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Copy, Check } from "lucide-react";

const colorGroups = [
  {
    label: "Brand",
    colors: [
      { name: "Primary", bg: "bg-primary", fg: "text-primary-foreground", var: "--primary" },
      { name: "Primary FG", bg: "bg-primary-foreground", fg: "text-primary", var: "--primary-foreground" },
      { name: "Secondary", bg: "bg-secondary", fg: "text-secondary-foreground", var: "--secondary" },
      { name: "Accent", bg: "bg-accent", fg: "text-accent-foreground", var: "--accent" },
    ],
  },
  {
    label: "Semantic",
    colors: [
      { name: "Success", bg: "bg-success", fg: "text-success-foreground", var: "--success" },
      { name: "Warning", bg: "bg-warning", fg: "text-warning-foreground", var: "--warning" },
      { name: "Destructive", bg: "bg-destructive", fg: "text-destructive-foreground", var: "--destructive" },
      { name: "Info", bg: "bg-info", fg: "text-info-foreground", var: "--info" },
    ],
  },
  {
    label: "Neutral",
    colors: [
      { name: "Background", bg: "bg-background", fg: "text-foreground", var: "--background" },
      { name: "Foreground", bg: "bg-foreground", fg: "text-background", var: "--foreground" },
      { name: "Muted", bg: "bg-muted", fg: "text-muted-foreground", var: "--muted" },
      { name: "Muted FG", bg: "bg-muted-foreground", fg: "text-background", var: "--muted-foreground" },
      { name: "Card", bg: "bg-card", fg: "text-card-foreground", var: "--card" },
      { name: "Border", bg: "bg-border", fg: "text-foreground", var: "--border" },
    ],
  },
];

const opacityScale = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const gradients = [
  { name: "Sunrise", cls: "from-primary to-warning" },
  { name: "Ocean", cls: "from-info to-success" },
  { name: "Berry", cls: "from-primary to-[#8b5cf6]" },
  { name: "Sunset", cls: "from-warning to-destructive" },
  { name: "Forest", cls: "from-success to-info" },
  { name: "Midnight", cls: "from-foreground to-muted-foreground" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1 rounded hover:bg-secondary/80 cursor-pointer"
      title="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
    </button>
  );
}

export function ColorsSection() {
  return (
    <SectionWrapper
      id="colors"
      title="Colors"
      description="A comprehensive color system with CSS custom properties. Includes brand, semantic, neutral palettes, opacity scales, and gradients."
    >
      {colorGroups.map((group) => (
        <ComponentCard key={group.label} title={group.label}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {group.colors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div
                  className={`${color.bg} ${color.fg} h-20 rounded-xl flex items-end p-3 border border-border/30 relative group`}
                >
                  <span className="text-[0.75rem]">{color.name}</span>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={`var(${color.var})`} />
                  </div>
                </div>
                <p className="text-[0.6875rem] text-muted-foreground font-mono flex items-center gap-1">
                  var({color.var})
                </p>
              </div>
            ))}
          </div>
        </ComponentCard>
      ))}

      <ComponentCard title="Primary Opacity Scale">
        <div className="flex flex-wrap gap-3">
          {opacityScale.map((o) => (
            <div key={o} className="flex flex-col items-center gap-1.5">
              <div
                className="w-14 h-14 rounded-xl border border-border/20"
                style={{ backgroundColor: `color-mix(in srgb, var(--primary) ${o}%, transparent)` }}
              />
              <span className="text-[0.6875rem] text-muted-foreground font-mono">{o}%</span>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Contrast Pairings">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { bg: "bg-primary", fg: "text-primary-foreground", label: "Primary / Primary FG" },
            { bg: "bg-background", fg: "text-foreground", label: "Background / Foreground" },
            { bg: "bg-card", fg: "text-card-foreground", label: "Card / Card FG" },
            { bg: "bg-secondary", fg: "text-secondary-foreground", label: "Secondary / Secondary FG" },
            { bg: "bg-muted", fg: "text-muted-foreground", label: "Muted / Muted FG" },
            { bg: "bg-destructive", fg: "text-destructive-foreground", label: "Destructive / Destructive FG" },
          ].map((pair) => (
            <div key={pair.label} className={`${pair.bg} ${pair.fg} p-4 rounded-xl border border-border/20`}>
              <p className="text-[0.9375rem] mb-1">Aa Bb Cc</p>
              <p className="text-[0.6875rem] opacity-80">{pair.label}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Gradients">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gradients.map((g) => (
            <div key={g.name} className="space-y-2">
              <div className={`h-24 rounded-xl bg-gradient-to-r ${g.cls}`} />
              <p className="text-[0.75rem] text-muted-foreground">{g.name}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Surface Hierarchy">
        <div className="p-6 bg-background rounded-xl border border-border space-y-4">
          <p className="text-[0.75rem] text-muted-foreground font-mono">Layer 0 — Background</p>
          <div className="p-5 bg-card rounded-xl border border-border space-y-4">
            <p className="text-[0.75rem] text-muted-foreground font-mono">Layer 1 — Card</p>
            <div className="p-4 bg-secondary rounded-xl space-y-3">
              <p className="text-[0.75rem] text-muted-foreground font-mono">Layer 2 — Secondary</p>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-[0.75rem] text-muted-foreground font-mono">Layer 3 — Muted</p>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
