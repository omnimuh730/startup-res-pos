import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import { useNativeTheme } from "../theme/provider";

export interface ModalProps extends ViewProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({ open = false, onOpenChange, children, ...props }: ModalProps) {
  const { colors } = useNativeTheme();
  if (!open) return null;
  return (
    <View style={styles.backdrop}>
      <Pressable style={styles.scrim} onPress={() => onOpenChange?.(false)} />
      <View {...props} style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }, props.style]}>
        {children}
      </View>
    </View>
  );
}

export const ModalHeader = (props: ViewProps) => <View {...props} />;
export const ModalBody = (props: ViewProps) => <View {...props} />;
export const ModalFooter = (props: ViewProps) => <View {...props} />;

const styles = StyleSheet.create({
  backdrop: { position: "absolute", inset: 0 as any, justifyContent: "center", alignItems: "center", zIndex: 30 },
  scrim: { position: "absolute", inset: 0 as any, backgroundColor: "rgba(0,0,0,0.35)" },
  panel: { width: "88%", borderWidth: 1, borderRadius: 12, padding: 12 }
});
