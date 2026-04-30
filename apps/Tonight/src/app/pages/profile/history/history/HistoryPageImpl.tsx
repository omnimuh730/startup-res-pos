import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Gift,
  Plus,
  Receipt,
  Send,
  ShoppingBag,
  Star,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Text } from "../../../../components/ds/Text";
import { DragScrollContainer } from "../../../shared/DragScrollContainer";
import { InvoiceModal } from "./InvoiceModal";
import { generateMockTransactions, rangeFromPreset, rangeLabel } from "./mockData";
import { PeriodPicker } from "./PeriodPicker";
import type { DateRange, TxCategory, TxRecord } from "./types";

type CategoryId = "all" | TxCategory;

type CategoryOption = {
  id: CategoryId;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: "primary" | "success" | "neutral" | "blue";
};

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: "all", label: "All", icon: Wallet, tone: "primary" },
  { id: "charge", label: "Top ups", icon: Plus, tone: "success" },
  { id: "pay", label: "Dining", icon: ShoppingBag, tone: "neutral" },
  { id: "reward", label: "Rewards", icon: Star, tone: "primary" },
  { id: "referral", label: "Referrals", icon: Send, tone: "blue" },
  { id: "gift", label: "Gifts", icon: Gift, tone: "success" },
];

const PAGE_SIZE = 20;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function iconToneClasses(tone: CategoryOption["tone"]) {
  if (tone === "success") return "bg-emerald-50 text-emerald-600";
  if (tone === "blue") return "bg-blue-50 text-blue-600";
  if (tone === "primary") return "bg-primary/10 text-primary";
  return "bg-secondary text-foreground";
}

function categoryFor(transaction: TxRecord) {
  return CATEGORY_OPTIONS.find((option) => option.id === transaction.category);
}

function buildCategoryCounts(transactions: TxRecord[], range: DateRange): Record<CategoryId, number> {
  const counts: Record<CategoryId, number> = {
    all: 0,
    charge: 0,
    pay: 0,
    reward: 0,
    referral: 0,
    gift: 0,
  };

  transactions.forEach((transaction) => {
    const inRange =
      transaction.dateObj.getTime() >= range.from.getTime() &&
      transaction.dateObj.getTime() <= range.to.getTime();

    if (!inRange) return;
    counts.all += 1;
    counts[transaction.category] += 1;
  });

  return counts;
}

function SemanticTabButton({
  option,
  isActive,
  count,
  onSelect,
}: {
  option: CategoryOption;
  isActive: boolean;
  count: number;
  onSelect: () => void;
}) {
  const Icon = option.icon;

  return (
    <motion.button
      layout
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={`${option.label}: ${count} transaction${count === 1 ? "" : "s"}`}
      title={option.label}
      onClick={onSelect}
      className={`flex h-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-colors active:scale-95 ${
        isActive
          ? "gap-2 bg-primary px-3.5 text-primary-foreground shadow-[0_8px_18px_rgba(255,56,92,0.24)]"
          : "w-10 text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
      style={{ fontWeight: 800 }}
      transition={{ type: "spring", stiffness: 520, damping: 38 }}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={isActive ? 2.4 : 2} />
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.span
            key="label"
            initial={{ maxWidth: 0, opacity: 0 }}
            animate={{ maxWidth: 120, opacity: 1 }}
            exit={{ maxWidth: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden whitespace-nowrap text-[0.875rem]"
          >
            {option.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function SemanticCategoryTabs({
  value,
  counts,
  onChange,
}: {
  value: CategoryId;
  counts: Record<CategoryId, number>;
  onChange: (value: CategoryId) => void;
}) {
  return (
    <div role="tablist" aria-label="Transaction categories">
      <DragScrollContainer className="mt-5 flex min-w-0 items-center gap-1.5 pb-2">
        {CATEGORY_OPTIONS.map((option) => (
          <SemanticTabButton
            key={option.id}
            option={option}
            isActive={value === option.id}
            count={counts[option.id]}
            onSelect={() => onChange(option.id)}
          />
        ))}
      </DragScrollContainer>
    </div>
  );
}

export function HistoryPage({ onBack }: { onBack: () => void }) {
  const [selectedTransaction, setSelectedTransaction] = useState<TxRecord | null>(null);
  const [range, setRange] = useState<DateRange>(() => rangeFromPreset("1m"));
  const [category, setCategory] = useState<CategoryId>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [allTransactions] = useState(() => generateMockTransactions(84));

  const filtered = useMemo(
    () =>
      allTransactions.filter(
        (transaction) =>
          (category === "all" || transaction.category === category) &&
          transaction.dateObj.getTime() >= range.from.getTime() &&
          transaction.dateObj.getTime() <= range.to.getTime()
      ),
    [allTransactions, category, range]
  );

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [range, category]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const activeCategory = CATEGORY_OPTIONS.find((option) => option.id === category);
  const categoryCounts = useMemo(
    () => buildCategoryCounts(allTransactions, range),
    [allTransactions, range]
  );

  const summary = useMemo(() => {
    const spent = filtered
      .filter((transaction) => transaction.type === "debit")
      .reduce((sum, transaction) => sum + Math.abs(transaction.amountValue), 0);
    const received = filtered
      .filter((transaction) => transaction.type !== "debit")
      .reduce((sum, transaction) => sum + transaction.amountValue, 0);
    const rewards = filtered
      .filter((transaction) => transaction.category === "reward" || transaction.category === "referral")
      .reduce((sum, transaction) => sum + transaction.amountValue, 0);

    return { spent, received, rewards };
  }, [filtered]);

  const groups = useMemo(() => {
    const next: { date: string; items: TxRecord[] }[] = [];

    shown.forEach((transaction) => {
      const last = next[next.length - 1];
      if (last && last.date === transaction.date) {
        last.items.push(transaction);
      } else {
        next.push({ date: transaction.date, items: [transaction] });
      }
    });

    return next;
  }, [shown]);

  const resetFilters = () => {
    setCategory("all");
    setRange(rangeFromPreset("1m"));
  };

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex flex-col bg-background text-foreground"
      style={{ bottom: "var(--app-bottom-chrome-height, 0px)" }}
    >
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur-md">
        <div
          className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 pb-3 sm:px-6"
          style={{ paddingTop: "calc(var(--safe-area-inset-top, 0px) + 0.75rem)" }}
        >
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition hover:bg-secondary/80 active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[1.25rem] leading-tight" style={{ fontWeight: 800 }}>
              Activity
            </h1>
            <Text className="mt-0.5 truncate text-[0.75rem] text-muted-foreground">
              {filtered.length} transaction{filtered.length === 1 ? "" : "s"} in {rangeLabel(range)}
            </Text>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Receipt className="h-5 w-5" />
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 pb-6 pt-4 sm:px-6">
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="rounded-[1.75rem] border border-border bg-card p-4 shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Text className="text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground" style={{ fontWeight: 700 }}>
                  This view
                </Text>
                <Text className="mt-1 truncate text-[1.125rem]" style={{ fontWeight: 800 }}>
                  {activeCategory?.label ?? "All"} activity
                </Text>
              </div>
              {(category !== "all" || range.presetId !== "1m") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[0.8125rem] text-primary transition hover:bg-primary/10"
                  style={{ fontWeight: 700 }}
                >
                  Reset
                </button>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Spent", value: money.format(summary.spent) },
                { label: "Added", value: money.format(summary.received) },
                { label: "Rewards", value: money.format(summary.rewards) },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.125rem] bg-secondary/60 px-3 py-3">
                  <Text className="truncate text-[0.6875rem] text-muted-foreground" style={{ fontWeight: 700 }}>
                    {item.label}
                  </Text>
                  <Text className="mt-1 truncate text-[0.9375rem]" style={{ fontWeight: 800 }}>
                    {item.value}
                  </Text>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <PeriodPicker value={range} onChange={setRange} />
            </div>
          </motion.section>

          <SemanticCategoryTabs
            value={category}
            counts={categoryCounts}
            onChange={setCategory}
          />

          <div className="mt-3 flex items-center justify-between px-1">
            <Text className="text-[0.8125rem] text-muted-foreground" style={{ fontWeight: 600 }}>
              {shown.length} shown
            </Text>
            <Text className="text-[0.8125rem] text-muted-foreground" style={{ fontWeight: 600 }}>
              {filtered.length} total
            </Text>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-16 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
                <Receipt className="h-7 w-7 text-muted-foreground" />
              </div>
              <Text className="text-[1.125rem]" style={{ fontWeight: 800 }}>
                No transactions found
              </Text>
              <Text className="mt-1 text-[0.875rem] text-muted-foreground">
                Try changing the date range or category.
              </Text>
            </motion.div>
          ) : (
            <div className="mt-4 space-y-6">
              <AnimatePresence mode="popLayout">
                {groups.map((group, groupIndex) => (
                  <motion.section
                    layout
                    key={group.date}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: groupIndex * 0.025 }}
                  >
                    <Text className="mb-3 px-1 text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground" style={{ fontWeight: 800 }}>
                      {group.date}
                    </Text>
                    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_3px_16px_rgba(0,0,0,0.04)]">
                      {group.items.map((transaction, index) => {
                        const cat = categoryFor(transaction);
                        const Icon = cat?.icon ?? ShoppingBag;
                        const positive = transaction.type !== "debit";

                        return (
                          <motion.button
                            layout
                            key={transaction.id}
                            type="button"
                            onClick={() => setSelectedTransaction(transaction)}
                            whileTap={{ scale: 0.995 }}
                            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition hover:bg-secondary/50 ${
                              index > 0 ? "border-t border-border/70" : ""
                            }`}
                          >
                            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconToneClasses(cat?.tone ?? "neutral")}`}>
                              <Icon className="h-5 w-5" strokeWidth={2.25} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <Text className="truncate text-[0.9375rem]" style={{ fontWeight: 800 }}>
                                {transaction.label}
                              </Text>
                              <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
                                <span className="truncate">{transaction.time}</span>
                                <span className="h-1 w-1 shrink-0 rounded-full bg-border" />
                                <span className="truncate">{cat?.label}</span>
                              </span>
                            </span>
                            <span className="flex shrink-0 items-center gap-1">
                              <Text
                                className={`text-[0.9375rem] ${positive ? "text-emerald-600" : "text-foreground"}`}
                                style={{ fontWeight: 800 }}
                              >
                                {transaction.amount}
                              </Text>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.section>
                ))}
              </AnimatePresence>

              {hasMore ? (
                <motion.div layout>
                  <button
                    type="button"
                    onClick={() => setVisible((value) => value + PAGE_SIZE)}
                    className="h-12 w-full cursor-pointer rounded-full border border-foreground bg-card text-[0.9375rem] text-foreground transition hover:bg-secondary active:scale-[0.98]"
                    style={{ fontWeight: 800 }}
                  >
                    Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
                  </button>
                </motion.div>
              ) : filtered.length > PAGE_SIZE ? (
                <Text className="pb-2 pt-1 text-center text-[0.8125rem] text-muted-foreground" style={{ fontWeight: 600 }}>
                  You are all caught up.
                </Text>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedTransaction && (
          <InvoiceModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
