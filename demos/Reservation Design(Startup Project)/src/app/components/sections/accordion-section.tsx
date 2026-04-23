import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { ChevronDown } from "lucide-react";

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
      >
        <span className="text-[0.9375rem] group-hover:text-primary transition-colors">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <div className="text-[0.875rem] text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function AccordionSection() {
  return (
    <SectionWrapper
      id="accordion"
      title="Accordion"
      description="Collapsible content sections for organizing information hierarchically."
    >
      <ComponentCard title="FAQ Style">
        <div className="max-w-2xl">
          <AccordionItem title="What is a design system?" defaultOpen>
            A design system is a collection of reusable components, guided by clear
            standards, that can be assembled together to build any number of applications.
            It serves as a single source of truth for design and development teams.
          </AccordionItem>
          <AccordionItem title="How do I customize the theme?">
            Click the paintbrush icon in the bottom-right corner to open the theme
            customizer. You can change colors, adjust border radius, and apply preset
            themes. All changes are applied in real-time using CSS custom properties.
          </AccordionItem>
          <AccordionItem title="Can I use this with React Native?">
            While this design system is built for web with Tailwind CSS, the design
            tokens and principles can be adapted for React Native using tools like
            NativeWind or a shared token system.
          </AccordionItem>
          <AccordionItem title="Is this accessible?">
            Yes. All components follow WAI-ARIA guidelines and include proper keyboard
            navigation, focus management, and screen reader support.
          </AccordionItem>
        </div>
      </ComponentCard>

      <ComponentCard title="Bordered Variant">
        <div className="max-w-2xl space-y-3">
          {[
            { t: "Getting Started", d: "Learn how to install and configure the design system in your project." },
            { t: "Components", d: "Browse the full library of reusable UI components with examples and documentation." },
            { t: "Theming", d: "Customize colors, typography, spacing, and more using CSS custom properties." },
          ].map((item) => (
            <AccordionItemBordered key={item.t} title={item.t}>
              {item.d}
            </AccordionItemBordered>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

function AccordionItemBordered({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer hover:bg-secondary/50 transition-colors"
      >
        <span className="text-[0.9375rem]">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-[0.875rem] text-muted-foreground">{children}</div>
      )}
    </div>
  );
}
