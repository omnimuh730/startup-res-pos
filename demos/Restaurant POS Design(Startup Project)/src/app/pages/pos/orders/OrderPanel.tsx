import { ChevronDown, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { useThemeClasses, useTheme } from "../theme-context";
import { TABLES, FLOORS } from "./data";
import type { OrderItem } from "./data";
import { useState } from "react";
import { OrderItemsTable } from "../components/OrderItemsTable";

interface OrderPanelProps {
  selectedTable: string;
  setSelectedTable: (id: string) => void;
  tableDropdownOpen: boolean;
  setTableDropdownOpen: (v: boolean) => void;
  allTableOrders: Record<string, OrderItem[]>;
  currentOrder: OrderItem[];
  checkNumber: string;
  totalUsd: number;
  totalKrw: number;
  removeItemFromOrder: (id: string) => void;
  setItemQty: (id: string, value: number) => void;
  setShowPayDialog: (v: boolean) => void;
  splitPercent: number;
  handleOrder: () => void;
}

export function OrderPanel(props: OrderPanelProps) {
  const {
    selectedTable, setSelectedTable, tableDropdownOpen, setTableDropdownOpen,
    allTableOrders, currentOrder, checkNumber, totalUsd, totalKrw,
    removeItemFromOrder, setItemQty, setShowPayDialog, splitPercent,
    handleOrder,
  } = props;
  void setShowPayDialog;
  const tc = useThemeClasses();
  const { role } = useTheme();
  const navigate = useNavigate();
  const canPay = role === "Admin" || role === "Cashier";
  const selectedTableInfo = TABLES.find(t => t.id === selectedTable);
  const [selectedFloor, setSelectedFloor] = useState("1F");
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const filteredTables = TABLES.filter(t => t.floor === selectedFloor);

  return (
    <div
      className={`w-full md:w-96 xl:w-[28rem] ${tc.isDark ? "bg-[#2a2d35]" : "bg-white"} md:border-r ${tc.border} flex flex-col shrink-0 md:!h-full overflow-hidden transition-[height] duration-300 ease-out`}
      style={{ height: `${splitPercent}%` }}
    >
      {/* Check Header */}
      <div className={`px-3 py-1.5 border-b ${tc.borderHalf}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Floor Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setFloorDropdownOpen(!floorDropdownOpen); setTableDropdownOpen(false); }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${
                  tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                <span className="font-medium">{FLOORS.find(f => f.id === selectedFloor)?.label || "All Floors"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${floorDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {floorDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFloorDropdownOpen(false)} />
                  <div className={`absolute top-full left-0 mt-1 z-50 w-36 rounded-lg shadow-lg border ${tc.border} ${
                    tc.isDark ? "bg-[#2a2d35]" : "bg-white"
                  }`}>
                    {FLOORS.map((floor) => (
                      <button
                        key={floor.id}
                        onClick={() => { setSelectedFloor(floor.id); setFloorDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[0.8125rem] transition-colors cursor-pointer ${
                          selectedFloor === floor.id
                            ? "bg-blue-600 text-white"
                            : tc.isDark ? "hover:bg-slate-700 text-slate-200" : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {floor.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Table Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setTableDropdownOpen(!tableDropdownOpen); setFloorDropdownOpen(false); }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${
                  tc.isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                <span className="font-medium">{selectedTableInfo?.label || "Select Table"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${tableDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {tableDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTableDropdownOpen(false)} />
                  <div className={`absolute top-full left-0 mt-1 z-50 w-48 max-h-64 overflow-y-auto rounded-lg shadow-lg border ${tc.border} ${
                    tc.isDark ? "bg-[#2a2d35]" : "bg-white"
                  }`}>
                    {filteredTables.map((table) => {
                      const hasOrder = (allTableOrders[table.id]?.length || 0) > 0;
                      return (
                        <button
                          key={table.id}
                          onClick={() => { setSelectedTable(table.id); setTableDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-1.5 text-[0.8125rem] flex items-center justify-between transition-colors cursor-pointer ${
                            selectedTable === table.id
                              ? "bg-blue-600 text-white"
                              : tc.isDark ? "hover:bg-slate-700 text-slate-200" : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span>{table.label}</span>
                          <span className="flex items-center gap-1.5">
                            {hasOrder && <span className={`w-1.5 h-1.5 rounded-full ${selectedTable === table.id ? "bg-blue-200" : "bg-blue-500"}`} />}
                            <span className={`text-[0.6875rem] ${selectedTable === table.id ? "text-blue-100" : tc.subtext}`}>{table.seats} seats</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Buttons */}
      <div className={`px-3 py-1.5 border-b ${tc.borderHalf}`}>
        <div className="flex gap-2">
          <button className={`flex-1 px-3.5 py-1.5 text-[0.75rem] rounded-lg bg-transparent ${tc.btnSecondary} cursor-pointer transition-colors`} onClick={handleOrder}>
            Order
          </button>
          <button
            disabled={!canPay}
            onClick={() => {
              if (!canPay) return;
              navigate("/pos/payment", {
                state: {
                  totalUsd,
                  totalKrw,
                  checkNumber,
                  tableLabel: selectedTableInfo?.label ?? selectedTable,
                  returnTo: "/pos/orders",
                },
              });
            }}
            title={canPay ? undefined : "Only Admin or Cashier can take payment"}
            className={`flex-1 px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 ${
              canPay
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : tc.isDark ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {!canPay && <Lock className="w-3 h-3" />}
            Pay {totalKrw > 0 ? `₩${Math.round(totalKrw).toLocaleString()}` : ""}{totalKrw > 0 && totalUsd > 0 ? " · " : ""}{totalUsd > 0 || totalKrw === 0 ? `$${totalUsd.toFixed(2)}` : ""}
          </button>
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto">
        {currentOrder.length === 0 ? (
          <div className={`text-center ${tc.muted} py-8 px-4`}>
            <p className="text-[0.875rem]">No items yet</p>
            <p className="text-[0.75rem] mt-1">Select items to add to order</p>
          </div>
        ) : (
          <OrderItemsTable
            items={currentOrder.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, ordered: i.ordered, currency: i.currency }))}
            onQtySet={setItemQty}
            onRemove={removeItemFromOrder}
          />
        )}
      </div>

      {/* Order Summary — two independent totals (no conversion) */}
      <div className={`border-t ${tc.borderHalf} p-3 space-y-0.5`}>
        <div className="flex justify-between text-[0.8125rem]">
          <span className={tc.subtext}>Domestic (₩):</span>
          <span className={tc.subtext}>₩{Math.round(totalKrw).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[0.8125rem]">
          <span className={tc.subtext}>Foreign ($):</span>
          <span className={tc.subtext}>${totalUsd.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}