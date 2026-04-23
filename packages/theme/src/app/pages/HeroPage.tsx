import { Link } from "react-router";
import { ALL_NAV_ITEMS, NAV_GROUPS } from "./DesignSystem";
import { Animate, Stagger, StaggerItem } from "../components/ds";

export default function HeroPage() {
  return (
    <div>
      {/* Hero */}
      <Animate preset="fadeInUp" duration={0.6}>
        <div className="mb-10 sm:mb-14">
          <h1 className="text-[2rem] sm:text-[2.75rem] tracking-tight leading-tight mb-3">
            Build consistent,
            <br />
            <span className="text-primary">beautiful interfaces.</span>
          </h1>
          <p className="text-[0.875rem] sm:text-[1rem] text-muted-foreground max-w-xl mb-5">
            A fully customizable design system inspired by Airbnb's minimalist aesthetic.
            Every token, every component — designed to be reused across web and mobile apps.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/colors"
              className="px-4 sm:px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-[0.8125rem] sm:text-[0.875rem]"
            >
              Explore Components
            </Link>
            <Link
              to="/dashboard"
              className="px-4 sm:px-5 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem] sm:text-[0.875rem]"
            >
              View Sample Dashboard
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
            {[
              { n: ALL_NAV_ITEMS.length, l: "Sections" },
              { n: "40+", l: "Reusable DS" },
              { n: "80+", l: "Icons" },
              { n: "15+", l: "Chart Types" },
            ].map((s) => (
              <div key={s.l} className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-secondary/70">
                <p className="text-[1rem] sm:text-[1.125rem] text-primary">{s.n}</p>
                <p className="text-[0.625rem] sm:text-[0.6875rem] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Animate>

      {/* Quick Nav Grid */}
      <Stagger stagger={0.04} delayStart={0.3}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-8">
            <StaggerItem preset="fadeInUp">
              <p className="text-[0.6875rem] text-muted-foreground uppercase tracking-widest mb-3">
                {group.label}
              </p>
            </StaggerItem>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.items.map(({ id, label, icon: Icon }) => (
                <StaggerItem key={id} preset="fadeInUp">
                  <Link
                    to={`/${id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[0.8125rem]">{label}</span>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </div>
        ))}
      </Stagger>

      {/* Footer */}
      <div className="border-t border-border pt-6 sm:pt-8 mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.75rem] sm:text-[0.8125rem] text-muted-foreground">
            Design System v4.0 — 40+ Reusable Components • Atomic Design • React + Tailwind CSS
          </p>
          <Link
            to="/dashboard"
            className="text-[0.75rem] sm:text-[0.8125rem] text-primary hover:underline cursor-pointer"
          >
            View Sample Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}