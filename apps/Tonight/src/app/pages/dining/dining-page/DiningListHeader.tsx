import { Plus } from "lucide-react";
import { Text } from "../../../components/ds/Text";
import type { DiningTabId } from "./diningTabs";
import { TAB_COPY } from "./diningTabs";

export function DiningListHeader({
  tab,
  onAddByCode,
}: {
  tab: DiningTabId;
  onAddByCode: () => void;
}) {
  const copy = TAB_COPY[tab];

  return (
    <div className="mb-4 px-1">
      <div className="min-w-0">
        <Text className="text-[1.125rem] leading-tight text-foreground" style={{ fontWeight: 800 }}>
          {copy.title}
        </Text>
        <Text className="mt-1 max-w-[28rem] text-[0.8125rem] leading-snug text-muted-foreground">
          {copy.description}
        </Text>
        {tab === "scheduled" && (
          <button
            type="button"
            onClick={onAddByCode}
            className="mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 text-[0.8125rem] text-primary transition hover:bg-primary/12 active:scale-95"
            style={{ fontWeight: 800 }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add by booking code
          </button>
        )}
      </div>
    </div>
  );
}
