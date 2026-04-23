import { useMemo, useState, type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNativeTheme } from "../theme/provider";
import type { SelectOption } from "@rn/ui-core";

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export function Select({ options, value, onValueChange, placeholder = "Select..." }: SelectProps) {
  const { colors } = useNativeTheme();
  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);
  return (
    <View style={[styles.inputLike, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={{ color: selected ? colors.foreground : colors.mutedForeground }}>
        {selected?.label ?? placeholder}
      </Text>
      <View style={styles.optionRow}>
        {options.map((opt) => (
          <Pressable key={opt.value} onPress={() => onValueChange?.(opt.value)} style={[styles.chip, { borderColor: colors.border }]}>
            <Text style={{ color: colors.foreground, fontSize: 11 }}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export interface MultiSelectProps {
  options: SelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export function MultiSelect({ options, value = [], onValueChange }: MultiSelectProps) {
  const { colors } = useNativeTheme();
  return (
    <View style={[styles.inputLike, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.optionRow}>
        {options.map((opt) => {
          const active = value.includes(opt.value);
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                if (active) onValueChange?.(value.filter((v) => v !== opt.value));
                else onValueChange?.([...value, opt.value]);
              }}
              style={[styles.chip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : "transparent" }]}
            >
              <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 11 }}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export interface NumberInputProps extends Omit<ComponentProps<typeof TextInput>, "onChangeText" | "value"> {
  value?: number;
  onChangeValue?: (value: number) => void;
}

export function NumberInput({ value = 0, onChangeValue, ...props }: NumberInputProps) {
  const { colors } = useNativeTheme();
  return (
    <TextInput
      keyboardType="numeric"
      value={String(value)}
      onChangeText={(t) => onChangeValue?.(Number(t) || 0)}
      style={[styles.inputLike, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
      placeholderTextColor={colors.mutedForeground}
      {...props}
    />
  );
}

export function StepperCounter({ value = 0, onChangeValue }: { value?: number; onChangeValue?: (value: number) => void }) {
  const { colors } = useNativeTheme();
  return (
    <View style={styles.stepper}>
      <Pressable onPress={() => onChangeValue?.(value - 1)} style={[styles.stepBtn, { borderColor: colors.border }]}><Text style={{ color: colors.foreground }}>-</Text></Pressable>
      <Text style={{ color: colors.foreground, minWidth: 32, textAlign: "center" }}>{value}</Text>
      <Pressable onPress={() => onChangeValue?.(value + 1)} style={[styles.stepBtn, { borderColor: colors.border }]}><Text style={{ color: colors.foreground }}>+</Text></Pressable>
    </View>
  );
}

export function SearchBar({ value, onChangeText, placeholder = "Search..." }: { value?: string; onChangeText?: (text: string) => void; placeholder?: string }) {
  const { colors } = useNativeTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.mutedForeground}
      style={[styles.inputLike, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
    />
  );
}

export function FileUploader({ onPick }: { onPick?: () => void }) {
  const { colors } = useNativeTheme();
  return (
    <Pressable onPress={onPick} style={[styles.inputLike, { borderColor: colors.border, backgroundColor: colors.card, alignItems: "center" }]}>
      <Text style={{ color: colors.foreground }}>Upload File</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inputLike: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepBtn: { borderWidth: 1, width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" }
});
