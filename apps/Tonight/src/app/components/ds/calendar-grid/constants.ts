import type { TableConfig } from "./types";

export const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  confirmed: { bg: "bg-success/15", text: "text-success", border: "border-l-success" },
  arrived: { bg: "bg-primary/15", text: "text-primary", border: "border-l-primary" },
  "left-message": { bg: "bg-info/15", text: "text-info", border: "border-l-info" },
  requested: { bg: "bg-warning/15", text: "text-warning", border: "border-l-warning" },
  "no-show": { bg: "bg-destructive/15", text: "text-destructive", border: "border-l-destructive" },
};

export const defaultTables: TableConfig[] = [
  { id: "A1", label: "Window", section: "Window", seats: 2 },
  { id: "A2", label: "Window", section: "Window", seats: 2 },
  { id: "A3", label: "Main", section: "Main", seats: 4 },
  { id: "B1", label: "Main", section: "Main", seats: 4 },
  { id: "C1", label: "Center", section: "Center", seats: 2 },
  { id: "C2", label: "Center", section: "Center", seats: 4 },
  { id: "C3", label: "Center", section: "Center", seats: 4 },
  { id: "Q1", label: "Private", section: "Private", seats: 8 },
  { id: "P1", label: "Patio", section: "Patio", seats: 2 },
  { id: "P2", label: "Patio", section: "Patio", seats: 4 },
  { id: "BR1", label: "Bar", section: "Bar", seats: 3 },
  { id: "BR2", label: "Bar", section: "Bar", seats: 2 },
];
