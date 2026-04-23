import { Pressable, StyleSheet, Text, View, type ViewProps } from "react-native";
import { useNativeTheme } from "../theme/provider";

export interface CheckboxProps extends ViewProps {
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked = false, onCheck, label, ...props }: CheckboxProps) {
  const { colors } = useNativeTheme();
  return (
    <Pressable onPress={() => onCheck?.(!checked)} style={styles.row} {...props}>
      <View style={[styles.box, { borderColor: colors.border, backgroundColor: checked ? colors.primary : "transparent" }]} />
      {label ? <Text style={{ color: colors.foreground }}>{label}</Text> : null}
    </Pressable>
  );
}

export function Radio({ checked = false, onCheck, label, ...props }: CheckboxProps) {
  const { colors } = useNativeTheme();
  return (
    <Pressable onPress={() => onCheck?.(!checked)} style={styles.row} {...props}>
      <View style={[styles.radio, { borderColor: colors.border }]}>
        {checked ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
      </View>
      {label ? <Text style={{ color: colors.foreground }}>{label}</Text> : null}
    </Pressable>
  );
}

export function Toggle({ checked = false, onCheck, label, ...props }: CheckboxProps) {
  const { colors } = useNativeTheme();
  return (
    <Pressable onPress={() => onCheck?.(!checked)} style={styles.row} {...props}>
      <View style={[styles.track, { backgroundColor: checked ? colors.primary : colors.muted }]}>
        <View style={[styles.thumb, checked ? styles.thumbOn : styles.thumbOff]} />
      </View>
      {label ? <Text style={{ color: colors.foreground }}>{label}</Text> : null}
    </Pressable>
  );
}

export function RadioGroup({ children, ...props }: ViewProps) {
  return <View {...props} style={[styles.group, props.style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  box: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 5 },
  radio: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  dot: { width: 8, height: 8, borderRadius: 999 },
  track: { width: 42, height: 24, borderRadius: 999, padding: 2 },
  thumb: { width: 20, height: 20, borderRadius: 999, backgroundColor: "#fff" },
  thumbOn: { marginLeft: 18 },
  thumbOff: { marginLeft: 0 },
  group: { gap: 8 }
});
