import { Pressable, StyleSheet, Text, View } from "react-native";
import { buildMonthGrid } from "@rn/ui-core";
import { useMemo } from "react";
import { useNativeTheme } from "../theme/provider";

export interface CalendarViewProps {
  year: number;
  monthZeroBased: number;
  selectedDate?: string;
  onSelectDate?: (isoDate: string) => void;
}

export function CalendarView({ year, monthZeroBased, selectedDate, onSelectDate }: CalendarViewProps) {
  const { colors } = useNativeTheme();
  const days = useMemo(() => buildMonthGrid(year, monthZeroBased), [year, monthZeroBased]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {days.map((day) => {
          const selected = selectedDate === day.isoDate;
          return (
            <Pressable
              key={day.isoDate}
              onPress={() => onSelectDate?.(day.isoDate)}
              style={[
                styles.day,
                {
                  borderColor: colors.border,
                  backgroundColor: selected ? colors.primary : colors.card
                }
              ]}
            >
              <Text
                style={{
                  color: selected ? colors.primaryForeground : (day.inCurrentMonth ? colors.foreground : colors.mutedForeground),
                  fontSize: 12
                }}
              >
                {day.day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  day: {
    width: "13%",
    minHeight: 34,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  }
});
