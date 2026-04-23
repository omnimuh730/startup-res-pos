import { Pressable, StyleSheet, Text, View, type ViewProps } from "react-native";
import { useNativeTheme } from "../theme/provider";

export function Pagination({
  page = 1,
  totalPages = 1,
  onChangePage
}: {
  page?: number;
  totalPages?: number;
  onChangePage?: (page: number) => void;
}) {
  const { colors } = useNativeTheme();
  return (
    <View style={styles.row}>
      <Pressable onPress={() => onChangePage?.(Math.max(1, page - 1))} style={[styles.btn, { borderColor: colors.border }]}><Text style={{ color: colors.foreground }}>Prev</Text></Pressable>
      <Text style={{ color: colors.foreground }}>{page} / {totalPages}</Text>
      <Pressable onPress={() => onChangePage?.(Math.min(totalPages, page + 1))} style={[styles.btn, { borderColor: colors.border }]}><Text style={{ color: colors.foreground }}>Next</Text></Pressable>
    </View>
  );
}

export function ProgressBar({ value = 0 }: { value?: number }) {
  const { colors } = useNativeTheme();
  const width = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { backgroundColor: colors.muted }]}>
      <View style={[styles.fill, { width: `${width}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

export function StepProgress(props: { value?: number }) {
  return <ProgressBar {...props} />;
}

export function CircularProgress({ value = 0 }: { value?: number }) {
  const { colors } = useNativeTheme();
  return (
    <View style={[styles.circle, { borderColor: colors.primary }]}>
      <Text style={{ color: colors.foreground }}>{Math.round(value)}%</Text>
    </View>
  );
}

export function Rating({ value = 0, onChange }: { value?: number; onChange?: (value: number) => void }) {
  const { colors } = useNativeTheme();
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange?.(n)}>
          <Text style={{ fontSize: 20, color: n <= value ? colors.primary : colors.mutedForeground }}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Drawer({ open = false, children, ...props }: ViewProps & { open?: boolean }) {
  const { colors } = useNativeTheme();
  if (!open) return null;
  return <View {...props} style={[styles.drawer, { backgroundColor: colors.card, borderColor: colors.border }, props.style]}>{children}</View>;
}

export function BottomSheet({ open = false, children, ...props }: ViewProps & { open?: boolean }) {
  const { colors } = useNativeTheme();
  if (!open) return null;
  return <View {...props} style={[styles.bottomSheet, { backgroundColor: colors.card, borderColor: colors.border }, props.style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  btn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  track: { width: "100%", height: 10, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%" },
  circle: { width: 64, height: 64, borderWidth: 4, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  drawer: { position: "absolute", left: 0, top: 0, bottom: 0, width: "78%", borderRightWidth: 1, padding: 12, zIndex: 20 },
  bottomSheet: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 12, zIndex: 20 }
});
