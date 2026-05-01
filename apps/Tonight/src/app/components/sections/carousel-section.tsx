import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Carousel } from "../ds";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Star, MapPin, Heart } from "lucide-react";

const CAROUSEL_IMAGES = [
  { src: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMG1vZGVybnxlbnwxfHx8fDE3NzYxMzI4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Modern Loft", location: "San Francisco", price: "$220", rating: 4.92 },
  { src: "https://images.unsplash.com/photo-1745426867834-d6d3bf080195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VuaWMlMjBjb3VudHJ5c2lkZSUyMHZpbmV5YXJkJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3NjEzMjgxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Vineyard Estate", location: "Napa Valley", price: "$310", rating: 4.88 },
  { src: "https://images.unsplash.com/photo-1670914131570-61ef0c05e388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwd2ludGVyJTIwY2FiaW4lMjBmaXJlcGxhY2V8ZW58MXx8fHwxNzc2MTMyODExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Winter Cabin", location: "Aspen", price: "$185", rating: 4.95 },
  { src: "https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGlzbGFuZCUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzc2MTMyODEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Island Paradise", location: "Maldives", price: "$450", rating: 4.97 },
  { src: "https://images.unsplash.com/photo-1757843298369-6e5503c14bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc3NjA0OTY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "City Penthouse", location: "New York", price: "$380", rating: 4.85 },
];

export function CarouselSection() {
  return (
    <SectionWrapper
      id="carousel-ds"
      title="Carousel"
      description="Flexible carousel/slider with autoplay, dot/line indicators, arrow sizes, multi-slide view, and loop support."
    >
      <ComponentCard title="Basic Image Carousel">
        <div className="max-w-2xl">
          <Carousel dotVariant="line">
            {CAROUSEL_IMAGES.map((img) => (
              <div key={img.title} className="rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={img.src}
                  alt={img.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </ComponentCard>

      <ComponentCard title="Multi-Slide (3 Visible)">
        <Carousel slidesToShow={3} gap={16} showDots={false}>
          {CAROUSEL_IMAGES.map((img) => (
            <div key={img.title} className="rounded-xl overflow-hidden border border-border bg-card">
              <ImageWithFallback
                src={img.src}
                alt={img.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <p className="text-[0.8125rem]">{img.title}</p>
                <p className="text-[0.75rem] text-muted-foreground">{img.location}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </ComponentCard>

      <ComponentCard title="Autoplay with Line Dots">
        <div className="max-w-md mx-auto">
          <Carousel autoPlay autoPlayInterval={3000} dotVariant="line">
            {["bg-primary/15", "bg-success/15", "bg-warning/15", "bg-info/15"].map((bg, i) => (
              <div key={i} className={`${bg} rounded-xl h-48 flex items-center justify-center`}>
                <span className="text-[1.25rem]">Slide {i + 1}</span>
              </div>
            ))}
          </Carousel>
        </div>
      </ComponentCard>

      <ComponentCard title="Property Cards Carousel">
        <Carousel slidesToShow={2} gap={20}>
          {CAROUSEL_IMAGES.map((item) => (
            <div key={item.title} className="rounded-xl overflow-hidden border border-border bg-card group">
              <div className="relative">
                <ImageWithFallback
                  src={item.src}
                  alt={item.title}
                  className="w-full h-44 object-cover"
                />
                <button className="absolute top-3 right-3 p-1.5 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card cursor-pointer">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-[0.9375rem]">{item.title}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-foreground" />
                    <span className="text-[0.8125rem]">{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[0.8125rem] text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </div>
                <p className="text-[0.9375rem]">
                  {item.price} <span className="text-muted-foreground text-[0.8125rem]">/ night</span>
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </ComponentCard>

      <ComponentCard title="No Loop (Finite Scroll)">
        <div className="max-w-md">
          <Carousel loop={false} dotVariant="dot">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-secondary/50 h-36 flex items-center justify-center">
                <span className="text-[1rem] text-muted-foreground">Slide {i} of 3 (no loop)</span>
              </div>
            ))}
          </Carousel>
        </div>
      </ComponentCard>

      <ComponentCard title="Arrow Sizes">
        <div className="space-y-6">
          {(["sm", "md", "lg"] as const).map((arrowSize) => (
            <div key={arrowSize}>
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">arrowSize="{arrowSize}"</p>
              <div className="max-w-sm">
                <Carousel arrowSize={arrowSize} showDots={false}>
                  {["bg-primary/10", "bg-info/10", "bg-success/10"].map((bg, i) => (
                    <div key={i} className={`${bg} rounded-xl h-28 flex items-center justify-center`}>
                      <span className="text-[0.875rem]">Slide {i + 1}</span>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
