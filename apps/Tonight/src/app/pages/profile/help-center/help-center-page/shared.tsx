import type { ReactNode } from "react";
import { Text } from "../../../../components/ds/Text";

export function HeaderIconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition hover:bg-secondary/80 active:scale-95" aria-label={label} title={label}>
      {children}
    </button>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-3 px-1 text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground" style={{ fontWeight: 700 }}>
      {children}
    </Text>
  );
}
