import type { HTMLAttributes } from "react";
import { useWebTheme } from "../theme/provider";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ style, ...props }: CardProps) {
  const { colors } = useWebTheme();
  return <div {...props} style={{ border: `1px solid ${colors.border}`, borderRadius: 12, background: colors.card, padding: 12, ...style }} />;
}

export const CardHeader = (props: CardProps) => <div {...props} />;
export function CardTitle({ style, ...props }: CardProps) {
  const { colors } = useWebTheme();
  return <h4 {...props} style={{ margin: 0, fontSize: 16, color: colors.foreground, ...style }} />;
}
export function CardDescription({ style, ...props }: CardProps) {
  const { colors } = useWebTheme();
  return <p {...props} style={{ margin: 0, fontSize: 12, color: colors.mutedForeground, ...style }} />;
}
export const CardContent = (props: CardProps) => <div {...props} />;
export const CardFooter = (props: CardProps) => <div {...props} />;
