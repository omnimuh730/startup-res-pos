import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Heart, Star, MapPin, ArrowRight } from "lucide-react";

export function CardsSection({
  images,
}: {
  images: { card1: string; card2: string; card3: string };
}) {
  return (
    <SectionWrapper
      id="cards"
      title="Cards & Boxes"
      description="Flexible card layouts for content presentation. Built with composable patterns."
    >
      <ComponentCard title="Content Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Listing Card */}
          <div className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="relative aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src={images.card1}
                alt="Mountain cabin"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[0.9375rem]">Mountain Retreat</h4>
                <div className="flex items-center gap-1 text-[0.8125rem]">
                  <Star className="w-3.5 h-3.5 fill-foreground" /> 4.92
                </div>
              </div>
              <p className="text-[0.8125rem] text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Aspen, Colorado
              </p>
              <p className="text-[0.9375rem] mt-2">
                <span className="text-foreground">$185</span>{" "}
                <span className="text-muted-foreground">/ night</span>
              </p>
            </div>
          </div>

          {/* Feature Card */}
          <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-[1.0625rem] mb-2">Premium Quality</h4>
            <p className="text-[0.875rem] text-muted-foreground mb-4">
              Every component is crafted with attention to detail, ensuring pixel-perfect results.
            </p>
            <button className="inline-flex items-center gap-1 text-[0.875rem] text-primary hover:underline cursor-pointer">
              Learn more <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Gradient Card */}
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 flex flex-col justify-between min-h-[280px]">
            <div>
              <p className="text-[0.75rem] uppercase tracking-wider opacity-80 mb-2">Featured</p>
              <h3 className="text-[1.5rem] tracking-tight">Start Building Today</h3>
            </div>
            <div>
              <p className="text-[0.875rem] opacity-90 mb-4">
                Get started with our design system and ship faster.
              </p>
              <button className="px-5 py-2.5 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors cursor-pointer text-[0.875rem]">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Box Variants">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card">
            <p className="text-[0.75rem] text-muted-foreground mb-1">Default Box</p>
            <p className="text-[0.875rem]">Standard bordered container</p>
          </div>
          <div className="p-5 rounded-xl bg-secondary">
            <p className="text-[0.75rem] text-muted-foreground mb-1">Filled Box</p>
            <p className="text-[0.875rem]">Background filled variant</p>
          </div>
          <div className="p-5 rounded-xl shadow-md bg-card">
            <p className="text-[0.75rem] text-muted-foreground mb-1">Elevated Box</p>
            <p className="text-[0.875rem]">Shadow elevated style</p>
          </div>
          <div className="p-5 rounded-xl border-2 border-primary/20 bg-primary/5">
            <p className="text-[0.75rem] text-primary mb-1">Accent Box</p>
            <p className="text-[0.875rem]">Primary accent border</p>
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
