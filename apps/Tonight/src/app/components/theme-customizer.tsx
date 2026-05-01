import { useState } from "react";
import { Paintbrush, RotateCcw, X, ChevronDown, ChevronUp } from "lucide-react";

interface ThemeColor {
  key: string;
  label: string;
  cssVar: string;
}

const themeColors: ThemeColor[] = [
  { key: "primary", label: "Primary", cssVar: "--primary" },
  { key: "primary-fg", label: "Primary Foreground", cssVar: "--primary-foreground" },
  { key: "secondary", label: "Secondary", cssVar: "--secondary" },
  { key: "secondary-fg", label: "Secondary Foreground", cssVar: "--secondary-foreground" },
  { key: "background", label: "Background", cssVar: "--background" },
  { key: "foreground", label: "Foreground", cssVar: "--foreground" },
  { key: "card", label: "Card", cssVar: "--card" },
  { key: "card-fg", label: "Card Foreground", cssVar: "--card-foreground" },
  { key: "muted", label: "Muted", cssVar: "--muted" },
  { key: "muted-fg", label: "Muted Foreground", cssVar: "--muted-foreground" },
  { key: "accent", label: "Accent", cssVar: "--accent" },
  { key: "accent-fg", label: "Accent Foreground", cssVar: "--accent-foreground" },
  { key: "destructive", label: "Destructive", cssVar: "--destructive" },
  { key: "destructive-fg", label: "Destructive Foreground", cssVar: "--destructive-foreground" },
  { key: "border", label: "Border", cssVar: "--border" },
  { key: "success", label: "Success", cssVar: "--success" },
  { key: "success-fg", label: "Success Foreground", cssVar: "--success-foreground" },
  { key: "warning", label: "Warning", cssVar: "--warning" },
  { key: "warning-fg", label: "Warning Foreground", cssVar: "--warning-foreground" },
  { key: "info", label: "Info", cssVar: "--info" },
  { key: "info-fg", label: "Info Foreground", cssVar: "--info-foreground" },
];

const presets: Record<string, Record<string, string>> = {
  Airbnb: {
    "--primary": "#FF385C",
    "--primary-foreground": "#ffffff",
    "--secondary": "#f7f7f7",
    "--secondary-foreground": "#222222",
    "--background": "#ffffff",
    "--foreground": "#222222",
    "--card": "#ffffff",
    "--card-foreground": "#222222",
    "--muted": "#f7f7f7",
    "--muted-foreground": "#717171",
    "--accent": "#f0efe9",
    "--accent-foreground": "#222222",
    "--destructive": "#C13515",
    "--destructive-foreground": "#ffffff",
    "--border": "#DDDDDD",
    "--success": "#008A05",
    "--success-foreground": "#ffffff",
    "--warning": "#E07912",
    "--warning-foreground": "#ffffff",
    "--info": "#428BFF",
    "--info-foreground": "#ffffff",
  },
  Ocean: {
    "--primary": "#0066FF",
    "--primary-foreground": "#ffffff",
    "--secondary": "#EBF4FF",
    "--secondary-foreground": "#1a1a2e",
    "--background": "#ffffff",
    "--foreground": "#1a1a2e",
    "--card": "#ffffff",
    "--card-foreground": "#1a1a2e",
    "--muted": "#f0f4f8",
    "--muted-foreground": "#64748b",
    "--accent": "#e0f2fe",
    "--accent-foreground": "#1a1a2e",
    "--destructive": "#dc2626",
    "--destructive-foreground": "#ffffff",
    "--border": "#e2e8f0",
    "--success": "#059669",
    "--success-foreground": "#ffffff",
    "--warning": "#d97706",
    "--warning-foreground": "#ffffff",
    "--info": "#2563eb",
    "--info-foreground": "#ffffff",
  },
  Forest: {
    "--primary": "#16a34a",
    "--primary-foreground": "#ffffff",
    "--secondary": "#f0fdf4",
    "--secondary-foreground": "#1a2e1a",
    "--background": "#ffffff",
    "--foreground": "#1a2e1a",
    "--card": "#ffffff",
    "--card-foreground": "#1a2e1a",
    "--muted": "#f0fdf4",
    "--muted-foreground": "#4b6043",
    "--accent": "#dcfce7",
    "--accent-foreground": "#1a2e1a",
    "--destructive": "#dc2626",
    "--destructive-foreground": "#ffffff",
    "--border": "#d1d5db",
    "--success": "#15803d",
    "--success-foreground": "#ffffff",
    "--warning": "#ca8a04",
    "--warning-foreground": "#ffffff",
    "--info": "#2563eb",
    "--info-foreground": "#ffffff",
  },
  Midnight: {
    "--primary": "#8b5cf6",
    "--primary-foreground": "#ffffff",
    "--secondary": "#1e1b4b",
    "--secondary-foreground": "#e0e7ff",
    "--background": "#0f0b2a",
    "--foreground": "#e2e8f0",
    "--card": "#1a1438",
    "--card-foreground": "#e2e8f0",
    "--muted": "#1e1b4b",
    "--muted-foreground": "#94a3b8",
    "--accent": "#312e81",
    "--accent-foreground": "#e0e7ff",
    "--destructive": "#ef4444",
    "--destructive-foreground": "#ffffff",
    "--border": "#334155",
    "--input-background": "#1e1b4b",
    "--success": "#22c55e",
    "--success-foreground": "#ffffff",
    "--warning": "#f59e0b",
    "--warning-foreground": "#ffffff",
    "--info": "#60a5fa",
    "--info-foreground": "#ffffff",
  },
};

function getCssVarValue(cssVar: string): string {
  const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return val || "#000000";
}

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [colors, setColors] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    themeColors.forEach((c) => {
      init[c.cssVar] = getCssVarValue(c.cssVar);
    });
    return init;
  });
  const [radius, setRadius] = useState(() => {
    const v = getCssVarValue("--radius");
    return parseFloat(v) || 0.75;
  });

  const applyColor = (cssVar: string, value: string) => {
    document.documentElement.style.setProperty(cssVar, value);
    setColors((prev) => ({ ...prev, [cssVar]: value }));
  };

  const applyPreset = (name: string) => {
    const preset = presets[name];
    Object.entries(preset).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    setColors((prev) => ({ ...prev, ...preset }));
  };

  const resetTheme = () => {
    themeColors.forEach((c) => {
      document.documentElement.style.removeProperty(c.cssVar);
    });
    document.documentElement.style.removeProperty("--radius");
    setRadius(0.75);
    setTimeout(() => {
      const init: Record<string, string> = {};
      themeColors.forEach((c) => {
        init[c.cssVar] = getCssVarValue(c.cssVar);
      });
      setColors(init);
    }, 50);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      >
        <Paintbrush className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
        <h3 className="text-[0.875rem]">Theme Customizer</h3>
        <div className="flex items-center gap-1">
          <button onClick={resetTheme} className="p-1.5 rounded-lg hover:bg-secondary cursor-pointer" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
        {/* Presets */}
        <div>
          <label className="text-[0.75rem] text-muted-foreground mb-2 block">Presets</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(presets).map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className="px-2 py-1.5 text-[0.7rem] rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div>
          <label className="text-[0.75rem] text-muted-foreground mb-2 block">
            Border Radius: {radius}rem
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.125"
            value={radius}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setRadius(v);
              document.documentElement.style.setProperty("--radius", `${v}rem`);
            }}
            className="w-full accent-primary"
          />
        </div>

        {/* Colors */}
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[0.75rem] text-muted-foreground mb-2 cursor-pointer"
          >
            Colors {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {expanded && (
            <div className="space-y-2">
              {themeColors.map((c) => (
                <div key={c.key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors[c.cssVar] || "#000000"}
                    onChange={(e) => applyColor(c.cssVar, e.target.value)}
                    className="w-7 h-7 rounded-md border border-border cursor-pointer shrink-0"
                  />
                  <span className="text-[0.75rem] text-foreground">{c.label}</span>
                  <span className="text-[0.65rem] text-muted-foreground ml-auto font-mono">
                    {colors[c.cssVar]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
