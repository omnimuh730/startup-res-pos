import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, type ReactNode } from "react";
import { useNativeTheme } from "../theme/provider";
import type { BreadcrumbItem, ListItem } from "@rn/ui-core";

export function ListGroup({ items = [] }: { items?: ListItem[] }) {
  const { colors } = useNativeTheme();
  return (
    <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }]}>
      {items.map((item, idx) => (
        <View key={item.id} style={[styles.listRow, idx > 0 ? { borderTopWidth: 1, borderTopColor: colors.border } : null]}>
          <Text style={{ color: colors.foreground, fontWeight: "600" }}>{item.label}</Text>
          {item.description ? <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{item.description}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export function EmptyState({ title = "No data", description = "Nothing to show yet." }: { title?: string; description?: string }) {
  const { colors } = useNativeTheme();
  return (
    <View style={[styles.center, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={{ color: colors.foreground, fontWeight: "700" }}>{title}</Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{description}</Text>
    </View>
  );
}

export function Breadcrumbs({ items = [], onSelect }: { items?: BreadcrumbItem[]; onSelect?: (value: string) => void }) {
  const { colors } = useNativeTheme();
  return (
    <View style={styles.row}>
      {items.map((item, idx) => (
        <View key={item.value} style={styles.row}>
          <Pressable onPress={() => onSelect?.(item.value)}>
            <Text style={{ color: colors.primary }}>{item.label}</Text>
          </Pressable>
          {idx < items.length - 1 ? <Text style={{ color: colors.mutedForeground }}> / </Text> : null}
        </View>
      ))}
    </View>
  );
}

export function Navbar({
  title = "Navbar",
  left,
  right
}: {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  const { colors } = useNativeTheme();
  return (
    <View style={[styles.nav, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.side}>{left}</View>
      <Text style={{ color: colors.foreground, fontWeight: "700" }}>{title}</Text>
      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
}

export function Carousel({ children }: { children?: ReactNode }) {
  const { colors } = useNativeTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.box, { borderColor: colors.border }]}>
      <View style={styles.carouselTrack}>{children}</View>
    </ScrollView>
  );
}

const OverlayContext = {
  open: false
};

export function Overlay({ open = false, children }: { open?: boolean; children?: ReactNode }) {
  if (!open) return null;
  return <View style={styles.overlay}>{children}</View>;
}

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const { colors } = useNativeTheme();
  return (
    <View>
      <Pressable onPressIn={() => setVisible(true)} onPressOut={() => setVisible(false)}>
        {children}
      </Pressable>
      {visible ? <View style={[styles.tip, { backgroundColor: colors.foreground }]}><Text style={{ color: colors.background, fontSize: 11 }}>{content}</Text></View> : null}
    </View>
  );
}

export function Popover({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { colors } = useNativeTheme();
  return (
    <View>
      <Pressable onPress={() => setOpen((v) => !v)}>{trigger}</Pressable>
      {open ? <View style={[styles.popover, { borderColor: colors.border, backgroundColor: colors.card }]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 10 },
  listRow: { padding: 10, gap: 2 },
  center: { borderWidth: 1, borderRadius: 10, padding: 16, alignItems: "center", gap: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  nav: { minHeight: 48, borderWidth: 1, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 },
  side: { minWidth: 48 },
  sideRight: { alignItems: "flex-end" },
  carouselTrack: { flexDirection: "row", gap: 10, padding: 10 },
  overlay: { position: "absolute", inset: 0 as any, backgroundColor: "rgba(0,0,0,0.25)", zIndex: 15 },
  tip: { marginTop: 6, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start" },
  popover: { marginTop: 8, borderWidth: 1, borderRadius: 10, padding: 10 }
});
