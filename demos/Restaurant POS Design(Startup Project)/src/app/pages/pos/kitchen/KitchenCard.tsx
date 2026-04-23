import { Check } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import type { KitchenOrder } from "./types";
import { formatTime24, getElapsedMinutes, getUrgencyLabel } from "./data";

interface KitchenCardProps {
  order: KitchenOrder;
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  recallOrder: (id: string) => void;
  toggleItemDone: (orderId: string, itemId: string) => void;
  setShowDetail: (id: string) => void;
}

export function KitchenCard({ order, acceptOrder, completeOrder, recallOrder, toggleItemDone, setShowDetail }: KitchenCardProps) {
  const tc = useThemeClasses();
  const elapsed = getElapsedMinutes(order.orderedAt);
  const urgency = getUrgencyLabel(elapsed);

  const activeItems = order.items.filter((i) => !i.previouslyCompleted);
  const previousItems = order.items.filter((i) => i.previouslyCompleted);

  const isReceived = order.status === "received";
  const isInProgress = order.status === "in-progress";
  const isCompleted = order.status === "completed";

  return (
    <div
      className={`rounded-xl flex flex-col overflow-hidden shrink-0 w-full md:w-[280px] ${
        tc.isDark ? "bg-[#1e2330] border border-[#2a3040]" : "bg-white border border-slate-200"
      }`}
    >
      {/* Card header */}
      <div className="px-4 pt-3.5 pb-1">
        {/* Order time + urgency */}
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[0.75rem] ${tc.isDark ? "text-slate-400" : "text-slate-400"}`}>
            Order {formatTime24(order.orderedAt)}
          </span>
          {!isCompleted && (
            <span className="flex items-center gap-1">
              {urgency.isUrgent && (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[0.6875rem] text-red-500">{urgency.label}</span>
                </>
              )}
              {urgency.isWarning && (
                <>
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[0.6875rem] text-orange-500">{urgency.label}</span>
                </>
              )}
              {!urgency.isUrgent && !urgency.isWarning && elapsed <= 1 && (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className={`text-[0.6875rem] ${tc.isDark ? "text-blue-400" : "text-blue-500"}`}>{urgency.label}</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Table name */}
        <h3 className={`text-[1.125rem] ${tc.isDark ? "text-white" : "text-slate-900"}`}>
          {order.table}
        </h3>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3 mb-2">
          {isReceived && (
            <button
              onClick={() => acceptOrder(order.id)}
              className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.8125rem] cursor-pointer transition-colors"
            >
              Accept
            </button>
          )}
          {isInProgress && (
            <>
              <button
                onClick={() => {}}
                className={`flex-1 py-2 rounded-lg text-[0.8125rem] cursor-pointer transition-colors border-2 ${
                  tc.isDark
                    ? "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    : "border-blue-500 text-blue-500 hover:bg-blue-50"
                }`}
              >
                Received
              </button>
              <button
                onClick={() => completeOrder(order.id)}
                className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[0.8125rem] cursor-pointer transition-colors"
              >
                Complete
              </button>
            </>
          )}
          {isCompleted && (
            <button
              onClick={() => recallOrder(order.id)}
              className={`flex-1 py-2 rounded-lg text-[0.8125rem] cursor-pointer transition-colors border-2 ${
                tc.isDark
                  ? "border-slate-600 text-slate-400 hover:bg-slate-700"
                  : "border-slate-300 text-slate-500 hover:bg-slate-50"
              }`}
            >
              Recall
            </button>
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="px-4 pb-2 space-y-1.5">
        {activeItems.map((item) => (
          <div
            key={item.id}
            onClick={isInProgress ? () => toggleItemDone(order.id, item.id) : undefined}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${
              tc.isDark ? "border-[#2a3040] bg-[#161b28]" : "border-slate-200 bg-slate-50/50"
            } ${isInProgress ? "cursor-pointer select-none" : ""}`}
          >
            <div className="flex-1 min-w-0">
              <span className={`text-[0.8125rem] ${
                item.done
                  ? tc.isDark ? "text-slate-300 line-through" : "text-slate-500 line-through"
                  : tc.isDark ? "text-slate-200" : "text-slate-700"
              }`}>
                {item.name}
              </span>
              {item.modifier && (
                <p className={`text-[0.6875rem] mt-0.5 ${tc.isDark ? "text-slate-500" : "text-slate-400"}`}>
                  ∟ {item.modifier}
                </p>
              )}
            </div>
            <span className={`text-[0.875rem] shrink-0 ${
              item.done
                ? tc.isDark ? "text-slate-500" : "text-slate-400"
                : tc.isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              {item.qty}
            </span>
            {/* Circle checkbox — only for in-progress and completed, not received */}
            {isInProgress && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleItemDone(order.id, item.id); }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                  item.done
                    ? "bg-green-500 border-green-500 text-white"
                    : tc.isDark
                      ? "border-slate-500 hover:border-slate-300"
                      : "border-slate-300 hover:border-slate-400"
                }`}
              >
                {item.done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </button>
            )}
            {isCompleted && (
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                item.done ? "bg-green-500 border-green-500 text-white" : tc.isDark ? "border-slate-600" : "border-slate-300"
              }`}>
                {item.done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </div>
            )}
          </div>
        ))}

        {/* Previously completed items — grayed out, no border */}
        {previousItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5 px-3 py-1.5">
            <span className={`flex-1 text-[0.8125rem] line-through ${tc.isDark ? "text-slate-600" : "text-slate-300"}`}>
              {item.name}
            </span>
            <span className={`text-[0.875rem] ${tc.isDark ? "text-slate-600" : "text-slate-300"}`}>
              {item.qty}
            </span>
          </div>
        ))}
      </div>

      {/* Footer — Order Details */}
      <div className="mx-4 mb-3 mt-1">
        <button
          onClick={() => setShowDetail(order.id)}
          className={`w-full py-2.5 rounded-lg text-[0.8125rem] cursor-pointer transition-colors border ${
            tc.isDark
              ? "border-[#2a3040] text-slate-400 hover:bg-[#1a2030]"
              : "border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          Order Details
        </button>
      </div>
    </div>
  );
}