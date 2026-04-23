import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Overlay } from "../ds";

export function OverlaySection() {
  const [openType, setOpenType] = useState<string | null>(null);

  const close = () => setOpenType(null);

  return (
    <SectionWrapper
      id="overlay-ds"
      title="Overlay"
      description="Backdrop overlay with configurable blur, opacity, color, and close behaviors. Used behind modals, drawers, and popovers."
    >
      <ComponentCard title="Blur Options">
        <div className="flex flex-wrap gap-3">
          {(["none", "sm", "md", "lg"] as const).map((blur) => (
            <button
              key={blur}
              onClick={() => setOpenType(`blur-${blur}`)}
              className="px-4 py-2.5 border border-border rounded-lg hover:bg-secondary cursor-pointer text-[0.8125rem]"
            >
              Blur: {blur}
            </button>
          ))}
        </div>
        {(["none", "sm", "md", "lg"] as const).map((blur) => (
          <Overlay key={blur} open={openType === `blur-${blur}`} onClose={close} blur={blur}>
            <div className="bg-card rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
              <h3 className="text-[1.125rem] mb-2">Blur: {blur}</h3>
              <p className="text-[0.8125rem] text-muted-foreground mb-4">
                The backdrop uses backdrop-blur-{blur}.
              </p>
              <button onClick={close} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 text-[0.875rem]">
                Close
              </button>
            </div>
          </Overlay>
        ))}
      </ComponentCard>

      <ComponentCard title="Opacity Levels">
        <div className="flex flex-wrap gap-3">
          {[0.2, 0.5, 0.7, 0.9].map((opacity) => (
            <button
              key={opacity}
              onClick={() => setOpenType(`opacity-${opacity}`)}
              className="px-4 py-2.5 border border-border rounded-lg hover:bg-secondary cursor-pointer text-[0.8125rem]"
            >
              Opacity: {opacity}
            </button>
          ))}
        </div>
        {[0.2, 0.5, 0.7, 0.9].map((opacity) => (
          <Overlay key={opacity} open={openType === `opacity-${opacity}`} onClose={close} opacity={opacity} blur="sm">
            <div className="bg-card rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
              <h3 className="text-[1.125rem] mb-2">Opacity: {opacity}</h3>
              <p className="text-[0.8125rem] text-muted-foreground mb-4">
                Background opacity set to {opacity * 100}%.
              </p>
              <button onClick={close} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 text-[0.875rem]">
                Close
              </button>
            </div>
          </Overlay>
        ))}
      </ComponentCard>

      <ComponentCard title="Click-to-Close Disabled">
        <button
          onClick={() => setOpenType("no-click")}
          className="px-4 py-2.5 border border-border rounded-lg hover:bg-secondary cursor-pointer text-[0.8125rem]"
        >
          Open (click overlay doesn't close)
        </button>
        <Overlay open={openType === "no-click"} onClose={close} closeOnClick={false} blur="md">
          <div className="bg-card rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <h3 className="text-[1.125rem] mb-2">Modal-like Overlay</h3>
            <p className="text-[0.8125rem] text-muted-foreground mb-4">
              Clicking the backdrop won't close this. Press Escape or click the button below.
            </p>
            <button onClick={close} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 text-[0.875rem]">
              Close
            </button>
          </div>
        </Overlay>
      </ComponentCard>

      <ComponentCard title="Visual Preview (Inline)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Default", cls: "bg-black/50" },
            { label: "Blur", cls: "bg-black/30 backdrop-blur-md" },
            { label: "Light", cls: "bg-white/60 backdrop-blur-sm" },
            { label: "Colored", cls: "bg-primary/20 backdrop-blur-sm" },
          ].map((o) => (
            <div key={o.label} className="relative rounded-xl overflow-hidden border border-border h-32">
              <div className="absolute inset-0 p-4">
                <div className="h-3 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted rounded mb-2" />
                <div className="h-8 w-full bg-muted rounded" />
              </div>
              <div className={`absolute inset-0 ${o.cls} flex items-center justify-center`}>
                <span className="text-[0.75rem] px-3 py-1 bg-card rounded-lg shadow-sm">{o.label}</span>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
