import { StyleSheet, Text, TextInput, View, type ViewProps } from "react-native";
import { useNativeTheme } from "../theme/provider";
import { useMemo, type ReactNode } from "react";
import { buildMonthGrid, type CalendarEvent, type ChatMessage, type OrderItem, type PaymentCard, type TableConfig } from "@rn/ui-core";

export function OrderSummary({ items = [] }: { items?: OrderItem[] }) {
  const { colors } = useNativeTheme();
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);
  return (
    <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }]}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={{ color: colors.foreground }}>{item.label}</Text>
          <Text style={{ color: colors.foreground }}>${item.price.toFixed(2)}</Text>
        </View>
      ))}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={{ color: colors.foreground, fontWeight: "700" }}>Total</Text>
        <Text style={{ color: colors.foreground, fontWeight: "700" }}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

export function PaymentMethod({
  cards = [],
  selectedId,
  onSelect
}: {
  cards?: PaymentCard[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const { colors } = useNativeTheme();
  return (
    <View style={styles.col}>
      {cards.map((card) => (
        <View
          key={card.id}
          style={[
            styles.box,
            { borderColor: selectedId === card.id ? colors.primary : colors.border, backgroundColor: colors.card }
          ]}
          onTouchEnd={() => onSelect?.(card.id)}
        >
          <Text style={{ color: colors.foreground }}>{card.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function ChatContainer({ children, ...props }: ViewProps) {
  return <View {...props} style={[styles.col, props.style]}>{children}</View>;
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const { colors } = useNativeTheme();
  const mine = message.from === "me";
  return (
    <View style={[styles.chat, { alignSelf: mine ? "flex-end" : "flex-start", backgroundColor: mine ? colors.primary : colors.secondary }]}>
      <Text style={{ color: mine ? colors.primaryForeground : colors.secondaryForeground }}>{message.text}</Text>
    </View>
  );
}

export function ChatInput({ value, onChangeText }: { value?: string; onChangeText?: (v: string) => void }) {
  const { colors } = useNativeTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Type message..."
      style={[styles.box, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
      placeholderTextColor={colors.mutedForeground}
    />
  );
}

export function CalendarGrid({ config, events = [] }: { config: TableConfig; events?: CalendarEvent[] }) {
  const { colors } = useNativeTheme();
  const days = buildMonthGrid(config.year, config.monthZeroBased);
  return (
    <View style={styles.grid}>
      {days.map((day) => {
        const hasEvent = events.some((e) => e.date === day.isoDate);
        return (
          <View key={day.isoDate} style={[styles.day, { borderColor: colors.border, backgroundColor: hasEvent ? colors.primary : colors.card }]}>
            <Text style={{ color: hasEvent ? colors.primaryForeground : (day.inCurrentMonth ? colors.foreground : colors.mutedForeground), fontSize: 11 }}>{day.day}</Text>
          </View>
        );
      })}
    </View>
  );
}

export interface AnimateProps {
  children?: ReactNode;
}
export interface StaggerProps {
  children?: ReactNode;
}
export interface StaggerItemProps {
  children?: ReactNode;
}
export const Animate = ({ children }: AnimateProps) => <>{children}</>;
export const Stagger = ({ children }: StaggerProps) => <>{children}</>;
export const StaggerItem = ({ children }: StaggerItemProps) => <>{children}</>;
export const AnimatePresence = ({ children }: { children?: ReactNode }) => <>{children}</>;

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 10, padding: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  totalRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#ddd" },
  col: { gap: 8 },
  chat: { maxWidth: "82%", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  day: { width: "13%", minHeight: 34, borderWidth: 1, borderRadius: 8, alignItems: "center", justifyContent: "center" }
});
