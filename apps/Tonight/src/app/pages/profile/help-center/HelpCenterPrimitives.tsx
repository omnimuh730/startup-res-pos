import { useState, type ReactNode } from "react";
import { ChevronRight, Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";
import type { IconType } from "./types";
import { Text } from "../../../components/ds/Text";

interface InlineLinkProps {
  to: string;
  onJump: (id: string) => void;
  children: ReactNode;
}

export function InlineLink({ to, onJump, children }: InlineLinkProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onJump(to);
      }}
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition cursor-pointer inline-flex items-center gap-0.5"
      style={{ fontWeight: 600 }}
    >
      {children}
      <ChevronRight className="w-3 h-3" />
    </button>
  );
}

export function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <span
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[0.8125rem]"
        style={{
          background:
            "color-mix(in oklab, var(--primary) 15%, transparent)",
          color: "var(--primary)",
          fontWeight: 700,
        }}
      >
        {n}
      </span>
      <div className="flex-1 text-[0.9375rem] leading-relaxed pt-1">
        {children}
      </div>
    </div>
  );
}

export function Tip({
  icon: Icon = Lightbulb,
  tone = "info",
  children,
}: {
  icon?: IconType;
  tone?: "info" | "warn" | "success";
  children: ReactNode;
}) {
  const bg =
    tone === "warn"
      ? "color-mix(in oklab, var(--warning) 12%, transparent)"
      : tone === "success"
        ? "color-mix(in oklab, var(--success) 12%, transparent)"
        : "color-mix(in oklab, var(--primary) 10%, transparent)";
  const fg =
    tone === "warn"
      ? "var(--warning)"
      : tone === "success"
        ? "var(--success)"
        : "var(--primary)";
  return (
    <div className="flex gap-3 items-start rounded-xl p-3.5" style={{ background: bg }}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: fg }} />
      <div className="text-[0.875rem] leading-relaxed flex-1">{children}</div>
    </div>
  );
}

export function SectionHelpfulness({
  sectionId,
  onFeedback,
}: {
  sectionId: string;
  onFeedback: (id: string, v: "up" | "down") => void;
}) {
  const [sent, setSent] = useState<"up" | "down" | null>(null);
  return (
    <div className="mt-4 flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-border">
      <Text className="text-[0.8125rem] text-muted-foreground">
        Was this helpful?
      </Text>
      <div className="flex items-center gap-2">
        {sent ? (
          <Text
            className="text-[0.8125rem]"
            style={{
              color: sent === "up" ? "var(--success)" : "var(--muted-foreground)",
            }}
          >
            {sent === "up"
              ? "Thanks for the feedback! 🎉"
              : "Thanks — we'll make this clearer."}
          </Text>
        ) : (
          <>
            <button
              onClick={() => {
                setSent("up");
                onFeedback(sectionId, "up");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-secondary/60 transition cursor-pointer text-[0.8125rem]"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Yes
            </button>
            <button
              onClick={() => {
                setSent("down");
                onFeedback(sectionId, "down");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-secondary/60 transition cursor-pointer text-[0.8125rem]"
            >
              <ThumbsDown className="w-3.5 h-3.5" /> No
            </button>
          </>
        )}
      </div>
    </div>
  );
}
