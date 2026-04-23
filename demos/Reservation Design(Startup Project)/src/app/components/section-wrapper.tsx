import { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionWrapper({ id, title, description, children }: SectionWrapperProps) {
  return (
    <section id={id} className="pb-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-[1.5rem] sm:text-[1.75rem] tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="text-[0.8125rem] sm:text-[0.9375rem] text-muted-foreground mt-1 max-w-2xl">{description}</p>
        )}
        <div className="h-px bg-border mt-4" />
      </div>
      {children}
    </section>
  );
}

export function ComponentCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 mb-4 sm:mb-6">
      {title && (
        <h4 className="text-[0.8125rem] text-muted-foreground mb-4 uppercase tracking-wider">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}