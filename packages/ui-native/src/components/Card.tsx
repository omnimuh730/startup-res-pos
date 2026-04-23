import { Text, View, type StyleProp, type TextStyle, type ViewProps } from "react-native";
import { useNativeTheme } from "../theme/provider";

export type CardProps = ViewProps;

export function Card(props: ViewProps) {
  const { colors } = useNativeTheme();
  return <View {...props} style={[{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.card, padding: 12 }, props.style]} />;
}

export const CardHeader = (props: ViewProps) => <View {...props} />;
export function CardTitle({ children, ...props }: ViewProps & { textStyle?: StyleProp<TextStyle> }) {
  const { colors } = useNativeTheme();
  return <Text style={[{ fontSize: 16, fontWeight: "700", color: colors.foreground }, props.textStyle]}>{children}</Text>;
}
export function CardDescription({ children, ...props }: ViewProps & { textStyle?: StyleProp<TextStyle> }) {
  const { colors } = useNativeTheme();
  return <Text style={[{ fontSize: 12, color: colors.mutedForeground }, props.textStyle]}>{children}</Text>;
}
export const CardContent = (props: ViewProps) => <View {...props} />;
export const CardFooter = (props: ViewProps) => <View {...props} />;
