import type { ComponentType } from "react";
import { motion } from "motion/react";
import { Text } from "../../../components/ds/Text";
import { ChevronRight } from "lucide-react";

export function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} className="min-w-0 rounded-[1.25rem] border border-border bg-card p-3 shadow-[0_5px_18px_rgba(0,0,0,0.045)]">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <Text className="truncate text-[0.75rem] text-muted-foreground">{label}</Text>
      <Text className="mt-0.5 truncate text-[0.9375rem] text-foreground" style={{ fontWeight: 800 }}>{value}</Text>
    </motion.div>
  );
}

export function ActionRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
  tone = "default",
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  onClick?: () => void;
  tone?: "default" | "primary" | "danger";
}) {
  const toneClass = tone === "primary" ? "bg-primary/10 text-primary" : tone === "danger" ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-[1.25rem] border border-border bg-card p-3.5 text-left shadow-[0_5px_18px_rgba(0,0,0,0.04)] transition hover:border-primary/35 hover:shadow-[0_10px_26px_rgba(0,0,0,0.07)]"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <Text className="truncate text-[0.9375rem]" style={{ fontWeight: 800 }}>{title}</Text>
        <Text className="mt-0.5 line-clamp-1 text-[0.75rem] text-muted-foreground">{subtitle}</Text>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </motion.button>
  );
}
