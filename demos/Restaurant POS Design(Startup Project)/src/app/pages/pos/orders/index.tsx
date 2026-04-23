import { useState, useRef, useCallback } from "react";
import { useThemeClasses } from "../theme-context";
import { INITIAL_TABLE_ORDERS, TABLES } from "./data";
import type { OrderItem } from "./data";
import { OrderPanel } from "./OrderPanel";
import { MenuPanel } from "./MenuPanel";
import { PaymentDialog } from "./PaymentDialog";

export default function Orders() {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("hot-foods");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Table selection & per-table order persistence
  const [selectedTable, setSelectedTable] = useState<string>("T12");
  const [tableDropdownOpen, setTableDropdownOpen] = useState(false);
  const [allTableOrders, setAllTableOrders] = useState<Record<string, OrderItem[]>>(INITIAL_TABLE_ORDERS);
  const [checkCounters] = useState<Record<string, string>>({
    T1: "Ch. #71", T2: "Ch. #72", T3: "Ch. #73", T4: "Ch. #74", T5: "Ch. #75",
    T6: "Ch. #76", T7: "Ch. #77", T8: "Ch. #78", T9: "Ch. #79", T10: "Ch. #80",
    T11: "Ch. #81", T12: "Ch. #85", BAR1: "Ch. #90", BAR2: "Ch. #91", BAR3: "Ch. #92",
  });

  const currentOrder = allTableOrders[selectedTable] || [];
  const setCurrentOrder = (updater: OrderItem[] | ((prev: OrderItem[]) => OrderItem[])) => {
    setAllTableOrders(prev => ({
      ...prev,
      [selectedTable]: typeof updater === "function" ? updater(prev[selectedTable] || []) : updater,
    }));
  };

  const checkNumber = checkCounters[selectedTable] || "Ch. #--";

  const [showPayDialog, setShowPayDialog] = useState(false);
  const tc = useThemeClasses();

  // Split view state
  const [splitPercent, setSplitPercent] = useState(35);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const pct = Math.min(Math.max((y / rect.height) * 100, 15), 55);
    setSplitPercent(pct);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const addItemToOrder = (item: { id: string; name: string; price: number; currency?: "foreign" | "domestic" }) => {
    setCurrentOrder((prev) => {
      const existingNew = prev.find((i) => i.baseId === item.id && !i.ordered);
      if (existingNew) {
        return prev.map((i) => (i.id === existingNew.id ? { ...i, qty: i.qty + 1 } : i));
      }
      const categoryLabel = selectedSubCategory?.toUpperCase().replace(/-/g, " ") || "UNKNOWN";
      const uniqueId = `${item.id}-${Date.now()}`;
      return [...prev, { ...item, id: uniqueId, baseId: item.id, qty: 1, category: categoryLabel, ordered: false, currency: item.currency ?? "foreign" }];
    });
  };

  const removeItemFromOrder = (itemId: string) => {
    setCurrentOrder((prev) => prev.filter((i) => i.id !== itemId));
  };

  const setItemQty = (itemId: string, value: number) => {
    setCurrentOrder((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, qty: Math.max(0, value) } : i))
    );
  };

  const handleOrder = () => {
    if (currentOrder.length === 0) return;
    const hasNewItems = currentOrder.some((i) => !i.ordered);
    if (!hasNewItems) return;
    setCurrentOrder((prev) => {
      const ordered = prev.filter((i) => i.ordered);
      const newItems = prev.filter((i) => !i.ordered);
      for (const ni of newItems) {
        const existing = ordered.find((o) => o.baseId === ni.baseId);
        if (existing) {
          existing.qty += ni.qty;
        } else {
          ordered.push({ ...ni, ordered: true });
        }
      }
      return [...ordered];
    });
  };

  const totalUsd = currentOrder
    .filter((i) => i.currency === "foreign")
    .reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalKrw = currentOrder
    .filter((i) => i.currency === "domestic")
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      ref={containerRef}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      className={`h-full flex flex-col md:flex-row ${tc.page}`}
      style={{ touchAction: isDragging ? "none" : undefined }}
    >
      {/* Left Panel - Current Check */}
      <OrderPanel
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        tableDropdownOpen={tableDropdownOpen}
        setTableDropdownOpen={setTableDropdownOpen}
        allTableOrders={allTableOrders}
        currentOrder={currentOrder}
        checkNumber={checkNumber}
        totalUsd={totalUsd}
        totalKrw={totalKrw}
        removeItemFromOrder={removeItemFromOrder}
        setItemQty={setItemQty}
        setShowPayDialog={setShowPayDialog}
        splitPercent={splitPercent}
        handleOrder={handleOrder}
      />

      {/* Drag Handle - visible on mobile only */}
      <div
        className={`md:hidden flex items-center justify-center w-full h-5 ${tc.raised} border-y ${tc.border} cursor-row-resize select-none shrink-0 touch-none`}
        onPointerDown={(e) => {
          e.preventDefault();
          const startY = e.clientY;
          let snapped = false;
          const el = e.currentTarget;
          el.setPointerCapture(e.pointerId);

          const stops = [35, 55, 75];
          const currentIdx = stops.indexOf(splitPercent) !== -1
            ? stops.indexOf(splitPercent)
            : 1;

          const onMove = (ev: PointerEvent) => {
            const delta = ev.clientY - startY;
            if (!snapped && Math.abs(delta) > 6) {
              if (delta < 0) {
                const nextIdx = Math.max(0, currentIdx - 1);
                setSplitPercent(stops[nextIdx]);
              } else {
                const nextIdx = Math.min(stops.length - 1, currentIdx + 1);
                setSplitPercent(stops[nextIdx]);
              }
              snapped = true;
            }
          };
          const onUp = () => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerup", onUp);
            if (!snapped) {
              const nextIdx = (currentIdx + 1) % stops.length;
              setSplitPercent(stops[nextIdx]);
            }
          };
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerup", onUp);
        }}
      >
        <div className={`w-10 h-1.5 rounded-full ${tc.isDark ? "bg-gray-500" : "bg-gray-300"}`} />
      </div>

      {/* Right Panel - Menu Selection */}
      <MenuPanel
        selectedMainCategory={selectedMainCategory}
        setSelectedMainCategory={setSelectedMainCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        addItemToOrder={addItemToOrder}
      />

      {/* Payment Dialog */}
      {showPayDialog && (
        <PaymentDialog
          totalUsd={totalUsd}
          totalKrw={totalKrw}
          checkNumber={checkNumber}
          onClose={() => setShowPayDialog(false)}
        />
      )}
    </div>
  );
}