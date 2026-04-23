import { buildMonthGrid, type CalendarEvent, type ChatMessage, type OrderItem, type PaymentCard, type TableConfig } from "@rn/ui-core";
import { useMemo, type ReactNode } from "react";
import { useWebTheme } from "../theme/provider";
export function OrderSummary({ items = [] }: { items?: OrderItem[] }) {
  const { colors } = useWebTheme();
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, background: colors.card, padding: 10, display: "grid", gap: 8 }}>
      {items.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", color: colors.foreground }}>
          <span>{item.label}</span>
          <span>${item.price.toFixed(2)}</span>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between", color: colors.foreground, fontWeight: 700 }}>
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function PaymentMethod({ cards = [], selectedId, onSelect }: { cards?: PaymentCard[]; selectedId?: string; onSelect?: (id: string) => void }) {
  const { colors } = useWebTheme();
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {cards.map((card) => (
        <button key={card.id} onClick={() => onSelect?.(card.id)} style={{ border: `1px solid ${selectedId === card.id ? colors.primary : colors.border}`, borderRadius: 10, background: colors.card, color: colors.foreground, padding: "8px 10px", textAlign: "left", cursor: "pointer" }}>
          {card.label}
        </button>
      ))}
    </div>
  );
}

export function ChatContainer({ children }: { children?: ReactNode }) {
  return <div style={{ display: "grid", gap: 8 }}>{children}</div>;
}
export function ChatBubble({ message }: { message: ChatMessage }) {
  const { colors } = useWebTheme();
  const mine = message.from === "me";
  return (
    <div style={{ justifySelf: mine ? "end" : "start", maxWidth: "82%", borderRadius: 12, padding: "8px 10px", background: mine ? colors.primary : colors.secondary, color: mine ? colors.primaryForeground : colors.secondaryForeground }}>
      {message.text}
    </div>
  );
}
export function ChatInput({ value, onChangeText }: { value?: string; onChangeText?: (v: string) => void }) {
  const { colors } = useWebTheme();
  return (
    <input value={value} onChange={(e) => onChangeText?.(e.target.value)} placeholder="Type message..." style={{ minHeight: 38, borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.card, color: colors.foreground, padding: "8px 10px" }} />
  );
}

export function CalendarGrid({ config, events = [] }: { config: TableConfig; events?: CalendarEvent[] }) {
  const { colors } = useWebTheme();
  const days = buildMonthGrid(config.year, config.monthZeroBased);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 6 }}>
      {days.map((day) => {
        const hasEvent = events.some((e) => e.date === day.isoDate);
        return (
          <div key={day.isoDate} style={{ minHeight: 34, borderRadius: 8, border: `1px solid ${colors.border}`, display: "grid", placeItems: "center", background: hasEvent ? colors.primary : colors.card, color: hasEvent ? colors.primaryForeground : day.inCurrentMonth ? colors.foreground : colors.mutedForeground, fontSize: 11 }}>
            {day.day}
          </div>
        );
      })}
    </div>
  );
}

export interface AnimateProps { children?: ReactNode }
export interface StaggerProps { children?: ReactNode }
export interface StaggerItemProps { children?: ReactNode }
export const Animate = ({ children }: AnimateProps) => <>{children}</>;
export const Stagger = ({ children }: StaggerProps) => <>{children}</>;
export const StaggerItem = ({ children }: StaggerItemProps) => <>{children}</>;
export const AnimatePresence = ({ children }: { children?: ReactNode }) => <>{children}</>;
