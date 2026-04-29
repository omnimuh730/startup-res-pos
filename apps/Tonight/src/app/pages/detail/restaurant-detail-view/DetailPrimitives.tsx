import type { ReactNode } from "react";

export function FeatureRow({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-1">{icon}</span>
      <div>
        <p className="text-[1rem] leading-6" style={{ fontWeight: 600 }}>{title}</p>
        <p className="text-[0.95rem] text-muted-foreground leading-6">{subtitle}</p>
      </div>
    </div>
  );
}

export function Amenity({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span>{icon}</span>
      <p>{text}</p>
    </div>
  );
}

export function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2 border-b border-border last:border-b-0">
      <p className="text-[1.6rem] leading-none" style={{ fontWeight: 700 }}>{value}</p>
      <p className="text-[0.85rem] text-muted-foreground">{label}</p>
    </div>
  );
}
