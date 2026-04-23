import type { ButtonRadius, ButtonSize, ButtonVariant } from "./button-contract";

export interface SelectOption {
  label: string;
  value: string;
}

export interface ListItem {
  id: string;
  label: string;
  description?: string;
}

export interface BreadcrumbItem {
  label: string;
  value: string;
}

export interface OrderItem {
  id: string;
  label: string;
  price: number;
}

export interface PaymentCard {
  id: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  from: "me" | "them";
}

export interface CalendarEvent {
  id: string;
  date: string;
  label: string;
}

export interface TableConfig {
  year: number;
  monthZeroBased: number;
}

export interface SharedButtonPropsContract {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  disabled?: boolean;
  loading?: boolean;
}

export interface PaginationContract {
  page?: number;
  totalPages?: number;
}
