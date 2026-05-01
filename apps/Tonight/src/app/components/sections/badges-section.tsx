import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Bell, Mail, ShoppingCart, MessageCircle, Check, X, Clock, AlertTriangle, Zap, Crown, Shield, Star } from "lucide-react";

export function BadgesSection() {
  return (
    <SectionWrapper
      id="badges"
      title="Badges"
      description="Status indicators, notification counters, dot indicators, and label badges for conveying state and metadata."
    >
      <ComponentCard title="Status Badges">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-success/15 text-success rounded-full">Active</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-warning/15 text-warning rounded-full">Pending</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-destructive/15 text-destructive rounded-full">Inactive</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-info/15 text-info rounded-full">In Review</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-muted text-muted-foreground rounded-full">Draft</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-primary/15 text-primary rounded-full">Published</span>
        </div>
      </ComponentCard>

      <ComponentCard title="Filled Badges">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-primary text-primary-foreground rounded-full">New</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-success text-success-foreground rounded-full">Verified</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-warning text-warning-foreground rounded-full">Beta</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-destructive text-destructive-foreground rounded-full">Removed</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-info text-info-foreground rounded-full">Update</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-foreground text-background rounded-full">Default</span>
        </div>
      </ComponentCard>

      <ComponentCard title="Outline Badges">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="px-2.5 py-0.5 text-[0.75rem] border border-primary text-primary rounded-full">Primary</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] border border-success text-success rounded-full">Success</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] border border-warning text-warning rounded-full">Warning</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] border border-destructive text-destructive rounded-full">Danger</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] border border-border text-muted-foreground rounded-full">Neutral</span>
        </div>
      </ComponentCard>

      <ComponentCard title="Icon Badges">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.75rem] bg-success/15 text-success rounded-full">
            <Check className="w-3 h-3" /> Approved
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.75rem] bg-destructive/15 text-destructive rounded-full">
            <X className="w-3 h-3" /> Rejected
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.75rem] bg-warning/15 text-warning rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.75rem] bg-info/15 text-info rounded-full">
            <AlertTriangle className="w-3 h-3" /> Attention
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.75rem] bg-primary/15 text-primary rounded-full">
            <Zap className="w-3 h-3" /> Pro
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.75rem] bg-warning/15 text-warning rounded-full">
            <Crown className="w-3 h-3" /> Premium
          </span>
        </div>
      </ComponentCard>

      <ComponentCard title="Notification Counters">
        <div className="flex flex-wrap gap-8 items-center">
          {[
            { Icon: Bell, count: 3 },
            { Icon: Mail, count: 12 },
            { Icon: ShoppingCart, count: 5 },
            { Icon: MessageCircle, count: 99 },
          ].map(({ Icon, count }) => (
            <div key={count} className="relative">
              <Icon className="w-6 h-6 text-foreground" />
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[0.625rem] flex items-center justify-center px-1">
                {count > 99 ? "99+" : count}
              </span>
            </div>
          ))}
          <div className="relative">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Dot Indicators">
        <div className="space-y-3">
          {[
            { color: "bg-success", label: "Online", desc: "Available for chat" },
            { color: "bg-warning", label: "Away", desc: "Idle for 15 minutes" },
            { color: "bg-destructive", label: "Busy", desc: "Do not disturb" },
            { color: "bg-muted-foreground", label: "Offline", desc: "Last seen 3h ago" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} />
              <div>
                <span className="text-[0.875rem]">{s.label}</span>
                <span className="text-[0.75rem] text-muted-foreground ml-2">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Badge Sizes & Shapes">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="px-1.5 py-0.5 text-[0.625rem] bg-primary text-primary-foreground rounded">XS</span>
          <span className="px-2 py-0.5 text-[0.6875rem] bg-primary text-primary-foreground rounded-md">SM</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-primary text-primary-foreground rounded-full">MD</span>
          <span className="px-3 py-1 text-[0.8125rem] bg-primary text-primary-foreground rounded-full">LG</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-primary text-primary-foreground rounded-none">Square</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-primary text-primary-foreground rounded-md">Rounded</span>
          <span className="px-2.5 py-0.5 text-[0.75rem] bg-primary text-primary-foreground rounded-full">Pill</span>
        </div>
      </ComponentCard>

      <ComponentCard title="In Context">
        <div className="max-w-sm space-y-3">
          {[
            { title: "Security", desc: "Two-factor authentication", badge: "Enabled", color: "bg-success/15 text-success", Icon: Shield },
            { title: "Plan", desc: "Professional workspace", badge: "Pro", color: "bg-primary/15 text-primary", Icon: Crown },
            { title: "API Key", desc: "Production key", badge: "Active", color: "bg-info/15 text-info", Icon: Zap },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <item.Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.875rem]">{item.title}</p>
                <p className="text-[0.75rem] text-muted-foreground">{item.desc}</p>
              </div>
              <span className={`px-2 py-0.5 text-[0.6875rem] rounded-full ${item.color} shrink-0`}>{item.badge}</span>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
