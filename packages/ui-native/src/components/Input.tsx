import { forwardRef, useState, type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNativeTheme } from "../theme/provider";

export interface InputProps extends ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
}

export interface TextareaProps extends ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input({ label, error, style, ...props }, ref) {
  const { colors } = useNativeTheme();
  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text> : null}
      <TextInput
        ref={ref}
        style={[styles.input, { borderColor: error ? colors.destructive : colors.border, color: colors.foreground }, style]}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
      {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
    </View>
  );
});

export const Textarea = forwardRef<TextInput, TextareaProps>(function Textarea({ label, error, style, ...props }, ref) {
  const { colors } = useNativeTheme();
  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text> : null}
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.textarea, { borderColor: error ? colors.destructive : colors.border, color: colors.foreground }, style]}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
      {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
    </View>
  );
});

export function PasswordInput(props: InputProps) {
  const [show, setShow] = useState(false);
  const { colors } = useNativeTheme();
  return (
    <View>
      <Input {...props} secureTextEntry={!show} />
      <Pressable onPress={() => setShow((v) => !v)} style={styles.eyeBtn}>
        <Text style={{ color: colors.primary, fontSize: 12 }}>{show ? "Hide" : "Show"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", gap: 6 },
  label: { fontSize: 12, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  textarea: { minHeight: 96 },
  error: { fontSize: 11 },
  eyeBtn: { marginTop: 6, alignSelf: "flex-end" }
});
