import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Separator } from "../ds";

export function SeparatorSection() {
  return (
    <SectionWrapper
      id="separator-ds"
      title="Separator"
      description="Versatile divider component with horizontal/vertical orientations, solid/dashed/dotted/gradient variants, labels, and spacing options."
    >
      <ComponentCard title="Variants">
        <div className="max-w-lg space-y-2">
          <p className="text-[0.6875rem] text-muted-foreground font-mono">solid (default)</p>
          <Separator />
          <p className="text-[0.6875rem] text-muted-foreground font-mono">dashed</p>
          <Separator variant="dashed" />
          <p className="text-[0.6875rem] text-muted-foreground font-mono">dotted</p>
          <Separator variant="dotted" />
          <p className="text-[0.6875rem] text-muted-foreground font-mono">gradient</p>
          <Separator variant="gradient" />
        </div>
      </ComponentCard>

      <ComponentCard title="With Labels">
        <div className="max-w-lg space-y-4">
          <Separator label="OR" />
          <Separator label="Section Break" variant="dashed" />
          <Separator label={<span className="text-primary">✦ New Content Below ✦</span>} variant="gradient" />
          <Separator label="Continue" variant="dotted" />
        </div>
      </ComponentCard>

      <ComponentCard title="Thickness">
        <div className="max-w-lg space-y-4">
          {[1, 2, 3, 4].map((t) => (
            <div key={t}>
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-1">thickness={t}</p>
              <Separator thickness={t} />
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Colors">
        <div className="max-w-lg space-y-4">
          <Separator color="var(--primary)" label="Primary" />
          <Separator color="var(--success)" label="Success" />
          <Separator color="var(--warning)" label="Warning" />
          <Separator color="var(--destructive)" label="Danger" />
          <Separator color="var(--info)" label="Info" />
        </div>
      </ComponentCard>

      <ComponentCard title="Spacing Scale">
        <div className="max-w-lg bg-secondary/50 rounded-xl p-4">
          <p className="text-[0.8125rem]">Content above</p>
          <Separator spacing="sm" label="sm" />
          <p className="text-[0.8125rem]">Between sm</p>
          <Separator spacing="md" label="md" />
          <p className="text-[0.8125rem]">Between md</p>
          <Separator spacing="lg" label="lg" />
          <p className="text-[0.8125rem]">Between lg</p>
          <Separator spacing="xl" label="xl" />
          <p className="text-[0.8125rem]">Content below</p>
        </div>
      </ComponentCard>

      <ComponentCard title="Vertical Orientation">
        <div className="flex items-center h-10 gap-0">
          <span className="text-[0.875rem]">Home</span>
          <Separator orientation="vertical" spacing="md" />
          <span className="text-[0.875rem]">Products</span>
          <Separator orientation="vertical" spacing="md" variant="dashed" />
          <span className="text-[0.875rem]">About</span>
          <Separator orientation="vertical" spacing="md" color="var(--primary)" />
          <span className="text-[0.875rem] text-primary">Contact</span>
        </div>
      </ComponentCard>

      <ComponentCard title="Practical Examples">
        <div className="max-w-md space-y-6">
          {/* Login divider */}
          <div className="space-y-3">
            <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-[0.875rem]">Sign in with Email</button>
            <Separator label="or continue with" />
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 border border-border rounded-lg text-[0.8125rem] hover:bg-secondary cursor-pointer">Google</button>
              <button className="flex-1 py-2.5 border border-border rounded-lg text-[0.8125rem] hover:bg-secondary cursor-pointer">GitHub</button>
            </div>
          </div>

          <Separator variant="gradient" spacing="lg" />

          {/* Section break */}
          <div>
            <h3 className="text-[1rem] mb-1">Account Settings</h3>
            <p className="text-[0.8125rem] text-muted-foreground">Manage your account preferences</p>
            <Separator spacing="md" />
            <div className="space-y-3">
              {["Profile", "Security", "Notifications"].map((item) => (
                <div key={item} className="flex items-center justify-between py-1.5">
                  <span className="text-[0.875rem]">{item}</span>
                  <span className="text-[0.8125rem] text-primary cursor-pointer hover:underline">Edit</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
