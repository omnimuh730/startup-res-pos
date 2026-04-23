import { Check, X } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import type { KitchenOrder } from "./types";
import { formatTime24, getElapsedMinutes } from "./data";

interface OrderDetailModalProps {
  order: KitchenOrder;
  onClose: () => void;
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  recallOrder: (id: string) => void;
}

export function OrderDetailModal({ order, onClose, acceptOrder, completeOrder, recallOrder }: OrderDetailModalProps) {
  const tc = useThemeClasses();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${tc.overlay} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`${tc.card} rounded-xl shadow-xl w-[90%] max-w-md max-h-[85vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 border-b ${tc.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-[1.125rem] ${tc.heading}`}>{order.table}</h3>
              <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>
                Ordered at {formatTime24(order.orderedAt)}
                {order.completedAt && ` · Completed at ${formatTime24(order.completedAt)}`}
              </p>
            </div>
            <button onClick={onClose} className={`p-1.5 rounded-lg ${tc.hover} ${tc.subtext} cursor-pointer`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mt-3">
            <span className={`px-2 py-0.5 rounded-lg text-[0.6875rem] ${
              order.status === "received"
                ? "bg-amber-500/20 text-amber-500"
                : order.status === "in-progress"
                  ? "bg-blue-600/20 text-blue-400"
                  : "bg-green-600/20 text-green-400"
            }`}>
              {order.status === "received" ? "Received" : order.status === "in-progress" ? "In Progress" : "Completed"}
            </span>
            {order.status !== "completed" && (
              <span className={`text-[0.6875rem] ${tc.muted}`}>{getElapsedMinutes(order.orderedAt)}m elapsed</span>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-1.5">
          {order.items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                item.previouslyCompleted
                  ? ""
                  : tc.isDark ? "border border-[#2a3040] bg-[#161b28]" : "border border-slate-200 bg-slate-50/50"
              }`}
            >
              {!item.previouslyCompleted && (
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  item.done ? "bg-green-500 border-green-500 text-white" : `${tc.isDark ? "border-slate-600" : "border-slate-300"}`
                }`}>
                  {item.done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-[0.8125rem] ${
                  item.previouslyCompleted
                    ? tc.isDark ? "text-slate-600 line-through" : "text-slate-300 line-through"
                    : item.done ? `line-through ${tc.muted}` : tc.text2
                }`}>
                  {item.name}
                </p>
                {item.modifier && (
                  <p className={`text-[0.625rem] ${tc.muted} mt-0.5`}>∟ {item.modifier}</p>
                )}
              </div>
              <span className={`text-[0.875rem] shrink-0 ${
                item.previouslyCompleted
                  ? tc.isDark ? "text-slate-600" : "text-slate-300"
                  : item.done ? tc.muted : tc.text2
              }`}>
                {item.qty}
              </span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className={`p-5 border-t ${tc.border} flex gap-2`}>
          {order.status === "received" && (
            <>
              <button
                onClick={() => { acceptOrder(order.id); onClose(); }}
                className={`flex-1 py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors border-2 ${
                  tc.isDark ? "border-blue-500 text-blue-400" : "border-blue-500 text-blue-500"
                }`}
              >
                Accept
              </button>
              <button
                onClick={() => { completeOrder(order.id); onClose(); }}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.8125rem] cursor-pointer transition-colors"
              >
                Complete
              </button>
            </>
          )}
          {order.status === "in-progress" && (
            <button
              onClick={() => { completeOrder(order.id); onClose(); }}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.8125rem] cursor-pointer transition-colors"
            >
              Complete
            </button>
          )}
          {order.status === "completed" && (
            <button
              onClick={() => { recallOrder(order.id); onClose(); }}
              className={`flex-1 py-2.5 rounded-lg ${tc.btnSecondary} text-[0.8125rem] cursor-pointer transition-colors`}
            >
              Recall to Kitchen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
