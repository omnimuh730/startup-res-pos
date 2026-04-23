import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Ribbon, RibbonContainer } from "../ds";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function RibbonSection({ images }: { images: Record<string, string> }) {
  return (
    <SectionWrapper
      id="ribbon-ds"
      title="Ribbon"
      description="Decorative ribbon overlays for cards and containers. Supports diagonal, flat, and bookmark variants with multiple positions and colors."
    >
      <ComponentCard title="Diagonal Variant">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((pos) => (
            <RibbonContainer key={pos} className="rounded-xl border border-border bg-card">
              <Ribbon position={pos} variant="diagonal" color="primary">Featured</Ribbon>
              <div className="p-6 pt-10 pb-10">
                <p className="text-[0.8125rem] text-muted-foreground text-center">{pos}</p>
              </div>
            </RibbonContainer>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Flat Variant">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((pos) => (
            <RibbonContainer key={pos} className="rounded-xl border border-border bg-card">
              <Ribbon position={pos} variant="flat" color="success">New</Ribbon>
              <div className="p-6">
                <p className="text-[0.8125rem] text-muted-foreground text-center">{pos}</p>
              </div>
            </RibbonContainer>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Bookmark Variant">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RibbonContainer className="rounded-xl border border-border bg-card">
            <Ribbon position="top-left" variant="bookmark" color="primary">Sale</Ribbon>
            <div className="p-6 pl-20">
              <h4 className="text-[0.9375rem]">Product Card</h4>
              <p className="text-[0.8125rem] text-muted-foreground mt-1">Bookmark ribbon on the left.</p>
            </div>
          </RibbonContainer>
          <RibbonContainer className="rounded-xl border border-border bg-card">
            <Ribbon position="top-right" variant="bookmark" color="destructive">Hot</Ribbon>
            <div className="p-6 pr-20">
              <h4 className="text-[0.9375rem]">Product Card</h4>
              <p className="text-[0.8125rem] text-muted-foreground mt-1">Bookmark ribbon on the right.</p>
            </div>
          </RibbonContainer>
        </div>
      </ComponentCard>

      <ComponentCard title="Color Options">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(["primary", "success", "warning", "destructive", "info", "dark"] as const).map((color) => (
            <RibbonContainer key={color} className="rounded-xl border border-border bg-card">
              <Ribbon position="top-right" variant="flat" color={color}>
                {color}
              </Ribbon>
              <div className="h-24" />
            </RibbonContainer>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Real-World Examples">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Property card */}
          <RibbonContainer className="rounded-xl border border-border bg-card overflow-hidden">
            <Ribbon position="top-left" variant="diagonal" color="primary">Superhost</Ribbon>
            <div className="h-32 bg-secondary relative">
              <ImageWithFallback src={images.card1} alt="Property" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h4 className="text-[0.9375rem]">Mountain Retreat</h4>
              <p className="text-[0.8125rem] text-muted-foreground">$185 / night</p>
            </div>
          </RibbonContainer>

          {/* Pricing card */}
          <RibbonContainer className="rounded-xl border-2 border-primary bg-card overflow-hidden">
            <Ribbon position="top-right" variant="flat" color="warning">Most Popular</Ribbon>
            <div className="p-6">
              <h4 className="text-[1rem]">Pro Plan</h4>
              <p className="text-[1.5rem] mt-2">$49<span className="text-[0.8125rem] text-muted-foreground">/mo</span></p>
              <p className="text-[0.8125rem] text-muted-foreground mt-1">Everything you need</p>
              <button className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg text-[0.875rem] cursor-pointer hover:opacity-90">Get Started</button>
            </div>
          </RibbonContainer>

          {/* Coupon card */}
          <RibbonContainer className="rounded-xl border border-border bg-card overflow-hidden">
            <Ribbon position="top-right" variant="bookmark" color="destructive">-30%</Ribbon>
            <div className="p-6">
              <h4 className="text-[1rem]">Summer Sale</h4>
              <p className="text-[0.8125rem] text-muted-foreground mt-1">Use code SUMMER30</p>
              <p className="text-[0.75rem] text-muted-foreground mt-3">Valid until Jul 31, 2026</p>
            </div>
          </RibbonContainer>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
