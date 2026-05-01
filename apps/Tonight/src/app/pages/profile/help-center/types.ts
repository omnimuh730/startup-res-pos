import type { ComponentType, CSSProperties, ReactNode } from "react";

export type IconType = ComponentType<{ className?: string; style?: CSSProperties }>;

export interface Section {
  id: string;
  title: string;
  icon: IconType;
  summary: string;
  keywords: string;
  image: string;
  readMins: number;
  related: string[];
  video?: { title: string; length: string };
  render: (jump: (id: string) => void) => ReactNode;
}

export interface FAQ {
  q: string;
  a: ReactNode;
}
