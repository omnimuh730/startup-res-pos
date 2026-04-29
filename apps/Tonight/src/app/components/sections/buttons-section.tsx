import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Heart, ArrowRight, Plus, Loader2, Download, Trash2 } from "lucide-react";

export function ButtonsSection() {
  return (
    <SectionWrapper
      id="buttons"
      title="Buttons"
      description="Versatile button components with multiple variants, sizes, and states."
    >
      <ComponentCard title="Variants">
        <div className="flex flex-wrap gap-3 items-center">
          <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Primary
          </button>
          <button className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer">
            Secondary
          </button>
          <button className="px-6 py-2.5 bg-transparent text-foreground border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer">
            Outline
          </button>
          <button className="px-6 py-2.5 text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer">
            Ghost
          </button>
          <button className="px-6 py-2.5 text-primary hover:underline underline-offset-4 cursor-pointer">
            Link
          </button>
          <button className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Destructive
          </button>
        </div>
      </ComponentCard>

      <ComponentCard title="Sizes">
        <div className="flex flex-wrap gap-3 items-center">
          <button className="px-3 py-1 text-[0.75rem] bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity cursor-pointer">
            Small
          </button>
          <button className="px-5 py-2 text-[0.875rem] bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Medium
          </button>
          <button className="px-8 py-3 text-[1rem] bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Large
          </button>
          <button className="px-10 py-4 text-[1.0625rem] bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
            X-Large
          </button>
        </div>
      </ComponentCard>

      <ComponentCard title="With Icons">
        <div className="flex flex-wrap gap-3 items-center">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            <Heart className="w-4 h-4" /> Favorite
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            <Download className="w-4 h-4" /> Download
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </ComponentCard>

      <ComponentCard title="Icon Buttons">
        <div className="flex flex-wrap gap-3 items-center">
          <button className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
            <Plus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
            <Heart className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
            <Plus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </ComponentCard>

      <ComponentCard title="States">
        <div className="flex flex-wrap gap-3 items-center">
          <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg cursor-pointer">
            Default
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/70 text-primary-foreground rounded-lg cursor-not-allowed">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading
          </button>
          <button className="px-6 py-2.5 bg-primary/40 text-primary-foreground/60 rounded-lg cursor-not-allowed" disabled>
            Disabled
          </button>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
