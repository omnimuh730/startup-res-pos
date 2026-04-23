import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ArrowUpDown, AlertCircle, Filter } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import type { KitchenOrder, OrderStatus, ViewTab, SortMode } from "./types";
import { INITIAL_ORDERS } from "./data";
import { KitchenCard } from "./KitchenCard";
import { OrderDetailModal } from "./OrderDetailModal";
import { TableFilterSidebar, KITCHEN_FLOORS } from "./TableFilterSidebar";
import { useNavBadges } from "../NavBadgeContext";

const ALL_TABLES = KITCHEN_FLOORS.flatMap((f) => f.tables);

export default function Kitchen() {
  const tc = useThemeClasses();
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<ViewTab>("in-progress");
  const [sortMode, setSortMode] = useState<SortMode>("oldest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set(ALL_TABLES));
  const [showTableFilter, setShowTableFilter] = useState(false);

  // Live clock tick every 15s for urgency updates
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(iv);
  }, []);

  // Counts
  const receivedCount = orders.filter((o) => o.status === "received").length;
  const inProgressCount = orders.filter((o) => o.status === "in-progress").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  const { setBadge } = useNavBadges();
  useEffect(() => { setBadge("kitchen", receivedCount); }, [receivedCount, setBadge]);

  // Filtered & sorted
  const filtered = orders.filter((o) => o.status === activeTab && selectedTables.has(o.table));
  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === "oldest") return a.orderedAt - b.orderedAt;
    return b.orderedAt - a.orderedAt;
  });

  // Actions
  const acceptOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: "in-progress" as OrderStatus } : o)
    );
  }, []);

  const completeOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "completed" as OrderStatus, completedAt: Date.now(), items: o.items.map((i) => ({ ...i, done: true })) }
          : o
      )
    );
  }, []);

  const toggleItemDone = useCallback((orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, items: o.items.map((i) => i.id === itemId ? { ...i, done: !i.done } : i) }
          : o
      )
    );
  }, []);

  const recallOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: "in-progress" as OrderStatus, completedAt: undefined } : o)
    );
  }, []);

  const detailOrder = showDetail ? orders.find((o) => o.id === showDetail) : null;

  const TABS: { id: ViewTab; label: string; count: number }[] = [
    { id: "received", label: "Received", count: receivedCount },
    { id: "in-progress", label: "In Progress", count: inProgressCount },
    { id: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <div className={`h-full flex flex-row ${tc.page} overflow-hidden`}>
      {/* Left Sidebar - Table Filter */}
      <TableFilterSidebar selectedTables={selectedTables} setSelectedTables={setSelectedTables} open={showTableFilter} onClose={() => setShowTableFilter(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`shrink-0 border-b ${tc.border} ${tc.raised}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTableFilter(true)}
              className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              } text-[0.8125rem]`}
            >
              <Filter className="w-4 h-4" />
              <span>Tables</span>
              <span className={`text-[0.6875rem] ${tc.isDark ? "text-blue-400" : "text-blue-600"}`}>
                {selectedTables.size}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${tc.card} text-[0.6875rem] cursor-pointer ${tc.hover} transition-colors ${tc.subtext}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortMode === "oldest" ? "Oldest" : "Newest"}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />
                  <div className={`absolute right-0 top-full mt-1 z-40 ${tc.dropdown} rounded-lg overflow-hidden min-w-[140px]`}>
                    {(["oldest", "newest"] as SortMode[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSortMode(s); setShowSortDropdown(false); }}
                        className={`w-full px-3 py-2 text-left text-[0.75rem] cursor-pointer transition-colors ${
                          sortMode === s ? tc.dropdownItemActive : tc.dropdownItem
                        }`}
                      >
                        {s === "oldest" ? "Oldest First" : "Newest First"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-[0.8125rem] cursor-pointer transition-colors border-b-2 ${
                activeTab === tab.id
                  ? `border-blue-500 ${tc.isDark ? "text-blue-400" : "text-slate-800"}`
                  : `border-transparent ${tc.muted} ${tc.hover}`
              }`}
            >
              {tab.label}
              <span className={`min-w-[1.25rem] h-5 px-1.5 rounded text-[0.6875rem] flex items-center justify-center ${
                activeTab === tab.id
                  ? tc.isDark ? "text-blue-400" : "text-slate-600"
                  : `${tc.subtext}`
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <AlertCircle className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-[0.875rem]">No orders in this category</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:gap-3 md:items-start md:overflow-x-auto gap-3 pb-2 md:h-full">
            {sorted.map((order) => (
              <KitchenCard
                key={order.id}
                order={order}
                acceptOrder={acceptOrder}
                completeOrder={completeOrder}
                recallOrder={recallOrder}
                toggleItemDone={toggleItemDone}
                setShowDetail={setShowDetail}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setShowDetail(null)}
          acceptOrder={acceptOrder}
          completeOrder={completeOrder}
          recallOrder={recallOrder}
        />
      )}
      </div>
    </div>
  );
}