import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Avatar, AvatarGroup, Spinner, Skeleton, SkeletonCard, SkeletonListItem, SkeletonTable } from "../ds";

export function AtomsSection() {
  return (
    <SectionWrapper
      id="atoms-ds"
      title="Atoms — Avatar, Spinner & Skeleton"
      description="Foundational building blocks: avatars with fallback states, loading spinners, and skeleton placeholders."
    >
      {/* Avatar */}
      <ComponentCard title="Avatar — Sizes">
        <div className="flex items-end gap-4 flex-wrap">
          {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
            <Avatar key={s} name="Jane Doe" size={s} />
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Avatar — With Image & Status">
        <div className="flex items-center gap-4 flex-wrap">
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" name="Sarah" size="lg" status="online" />
          <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" name="Mike" size="lg" status="away" />
          <Avatar name="John Smith" size="lg" status="busy" />
          <Avatar name="No Image" size="lg" status="offline" />
          <Avatar size="lg" /> {/* Fallback "?" */}
        </div>
      </ComponentCard>

      <ComponentCard title="Avatar — Shapes">
        <div className="flex items-center gap-4">
          <Avatar name="Circle" size="lg" shape="circle" />
          <Avatar name="Rounded" size="lg" shape="rounded" />
          <Avatar name="Square" size="lg" shape="square" />
        </div>
      </ComponentCard>

      <ComponentCard title="Avatar Group">
        <AvatarGroup max={4} size="md">
          <Avatar name="Alice" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" />
          <Avatar name="Bob" />
          <Avatar name="Carol" />
          <Avatar name="Dave" />
          <Avatar name="Eve" />
          <Avatar name="Frank" />
        </AvatarGroup>
      </ComponentCard>

      {/* Spinner */}
      <ComponentCard title="Spinner Variants">
        <div className="flex items-center gap-8 flex-wrap">
          <div className="text-center">
            <Spinner variant="ring" size="md" />
            <p className="text-[0.6875rem] text-muted-foreground mt-2">Ring</p>
          </div>
          <div className="text-center">
            <Spinner variant="dots" size="md" />
            <p className="text-[0.6875rem] text-muted-foreground mt-2">Dots</p>
          </div>
          <div className="text-center">
            <Spinner variant="bars" size="md" />
            <p className="text-[0.6875rem] text-muted-foreground mt-2">Bars</p>
          </div>
          <div className="text-center">
            <Spinner variant="pulse" size="md" />
            <p className="text-[0.6875rem] text-muted-foreground mt-2">Pulse</p>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Spinner Sizes">
        <div className="flex items-center gap-6 flex-wrap">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <Spinner key={s} size={s} label={s} />
          ))}
        </div>
      </ComponentCard>

      {/* Skeleton */}
      <ComponentCard title="Skeleton — Basic">
        <div className="space-y-3 max-w-md">
          <Skeleton variant="text" />
          <Skeleton variant="text" width="75%" />
          <Skeleton variant="text" width="50%" />
          <div className="flex gap-3 items-center pt-2">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Skeleton — Preset Cards">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </ComponentCard>

      <ComponentCard title="Skeleton — List & Table">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[0.6875rem] text-muted-foreground mb-2 uppercase tracking-wider">List</p>
            <div className="border border-border rounded-xl overflow-hidden">
              {[1, 2, 3].map((i) => <SkeletonListItem key={i} />)}
            </div>
          </div>
          <div>
            <p className="text-[0.6875rem] text-muted-foreground mb-2 uppercase tracking-wider">Table</p>
            <div className="border border-border rounded-xl overflow-hidden">
              <SkeletonTable rows={3} cols={3} />
            </div>
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
