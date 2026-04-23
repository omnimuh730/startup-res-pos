import { X } from "lucide-react";
import { useThemeClasses } from "../theme-context";

export type RowCurrency = "foreign" | "domestic";

export interface OrderItemRow {
  id?: string;
  name: string;
  qty: number;
  price?: number;
  ordered?: boolean;
  currency?: RowCurrency;
}

interface OrderItemsTableProps {
  items: OrderItemRow[];
  onQtySet?: (id: string, value: number) => void;
  onRemove?: (id: string) => void;
  showNewItemsDivider?: boolean;
  stickyHeader?: boolean;
  emptyLabel?: string;
}

function fmt(value: number, cur: RowCurrency): string {
  if (cur === "domestic") return `₩${Math.round(value).toLocaleString()}`;
  return `$${value.toFixed(2)}`;
}

export function OrderItemsTable({
  items, onQtySet, onRemove,
  showNewItemsDivider = true, stickyHeader = true, emptyLabel,
}: OrderItemsTableProps) {
  const tc = useThemeClasses();
  const interactive = !!(onQtySet || onRemove);

  if (items.length === 0 && emptyLabel) {
    return (
      <div className={`text-center ${tc.muted} py-8 px-4`}>
        <p className="text-[0.875rem]">{emptyLabel}</p>
      </div>
    );
  }

  const orderedItems = items.filter((i) => i.ordered);
  const newItems = items.filter((i) => !i.ordered);
  const hasSections = showNewItemsDivider && orderedItems.length > 0 && newItems.length > 0;

  const renderRow = (item: OrderItemRow, key: string, isOrderedSection: boolean) => {
    const cur: RowCurrency = item.currency ?? "foreign";
    const priceText = item.price != null ? fmt(item.price, cur) : "—";
    const totalText = item.price != null ? fmt(item.price * item.qty, cur) : "—";
    const textCls = tc.text1;
    const bgCls = isOrderedSection
      ? (tc.isDark ? "bg-slate-700/30" : "bg-slate-100/60")
      : (tc.isDark ? "bg-blue-600/15 hover:bg-blue-600/25" : "bg-blue-50 hover:bg-blue-100");

    return (
      <div key={key} className={`px-3 py-1 flex items-center gap-1.5 ${bgCls}`}>
        <div className="flex-1 min-w-0">
          <span className={`text-[0.6875rem] sm:text-[0.8125rem] truncate block ${textCls}`}>{item.name}</span>
        </div>
        <div className="w-16 flex items-center justify-center">
          {onQtySet && item.id ? (
            <input
              type="number"
              step="0.1"
              min="0"
              value={item.qty}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v >= 0) onQtySet(item.id!, v);
                else if (e.target.value === "") onQtySet(item.id!, 0);
              }}
              className={`w-full text-center text-[0.6875rem] sm:text-[0.8125rem] rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-blue-500 ${
                tc.isDark ? "bg-slate-800/60 text-slate-100" : "bg-white/80 text-slate-800 border border-slate-200"
              }`}
            />
          ) : (
            <span className={`text-[0.6875rem] sm:text-[0.8125rem] ${textCls} text-center`}>{item.qty}</span>
          )}
        </div>
        <div className={`w-14 sm:w-20 text-right text-[0.6875rem] sm:text-[0.8125rem] ${textCls}`}>{priceText}</div>
        <div className={`w-16 sm:w-24 text-right text-[0.6875rem] sm:text-[0.8125rem] ${textCls}`}>{totalText}</div>
        {interactive && (
          <div className="w-5">
            {onRemove && item.id && (
              <button onClick={() => onRemove(item.id!)} className={`${tc.subtext} hover:text-red-400 transition-colors`}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className={`${stickyHeader ? "sticky top-0 z-10" : ""} ${tc.isDark ? "bg-[#2a2d35]" : "bg-white"} px-3 py-1.5 flex items-center gap-1.5 text-[0.6875rem] sm:text-[0.8125rem] ${tc.isDark ? "text-blue-400" : "text-blue-600"} border-b ${tc.borderHalf}`}>
        <div className="flex-1">Name</div>
        <div className="w-16 text-center">Qty</div>
        <div className="w-14 sm:w-20 text-right">Each</div>
        <div className="w-16 sm:w-24 text-right">Total</div>
        {interactive && <div className="w-5" />}
      </div>
      <div>
        {hasSections ? (
          <>
            {orderedItems.map((item, i) => renderRow(item, `ord-${item.id ?? i}`, true))}
            <div className={`px-3 py-1 flex items-center gap-2 ${tc.isDark ? "border-slate-600" : "border-slate-200"} border-y`}>
              <span className={`text-[0.625rem] uppercase tracking-wider ${tc.isDark ? "text-blue-400" : "text-blue-500"}`}>New Items</span>
              <div className={`flex-1 h-px ${tc.isDark ? "bg-slate-600" : "bg-slate-200"}`} />
            </div>
            {newItems.map((item, i) => renderRow(item, `new-${item.id ?? i}`, false))}
          </>
        ) : (
          items.map((item, i) => renderRow(item, `row-${item.id ?? i}`, !!item.ordered))
        )}
      </div>
    </div>
  );
}
