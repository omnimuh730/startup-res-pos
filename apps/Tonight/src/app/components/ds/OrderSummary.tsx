import { type ReactNode } from "react";
import { Minus, Plus, X } from "lucide-react";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  note?: string;
}

export interface OrderSummaryProps {
  items: OrderItem[];
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  subtotal?: number;
  tax?: number;
  deliveryFee?: number;
  tip?: number;
  discount?: number;
  currency?: string;
  footer?: ReactNode;
  className?: string;
}

function fmt(amount: number, currency: string) {
  return `${currency}${amount.toFixed(2)}`;
}

export function OrderSummary({
  items,
  onQuantityChange,
  onRemove,
  subtotal: customSubtotal,
  tax,
  deliveryFee = 0,
  tip = 0,
  discount = 0,
  currency = "$",
  footer,
  className = "",
}: OrderSummaryProps) {
  const subtotal = customSubtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = tax ?? subtotal * 0.08;
  const total = subtotal + taxAmount + deliveryFee + tip - discount;

  return (
    <div className={`border border-border rounded-xl bg-card overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-[0.9375rem]">Order Summary</h3>
        <p className="text-[0.75rem] text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="divide-y divide-border max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-5 py-3">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[0.8125rem] truncate">{item.name}</p>
              {item.note && <p className="text-[0.6875rem] text-muted-foreground">{item.note}</p>}
              <p className="text-[0.8125rem] text-primary mt-0.5">{fmt(item.price, currency)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onQuantityChange && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center border border-border rounded-full hover:bg-secondary cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[0.75rem] w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center border border-border rounded-full hover:bg-secondary cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
              {onRemove && (
                <button onClick={() => onRemove(item.id)} className="p-1 hover:bg-secondary rounded cursor-pointer">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-border space-y-2">
        <div className="flex justify-between text-[0.8125rem]">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{fmt(subtotal, currency)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-[0.8125rem]">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{fmt(deliveryFee, currency)}</span>
          </div>
        )}
        <div className="flex justify-between text-[0.8125rem]">
          <span className="text-muted-foreground">Tax</span>
          <span>{fmt(taxAmount, currency)}</span>
        </div>
        {tip > 0 && (
          <div className="flex justify-between text-[0.8125rem]">
            <span className="text-muted-foreground">Tip</span>
            <span>{fmt(tip, currency)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-[0.8125rem] text-success">
            <span>Discount</span>
            <span>-{fmt(discount, currency)}</span>
          </div>
        )}
        <div className="h-px bg-border my-1" />
        <div className="flex justify-between text-[0.9375rem]">
          <span>Total</span>
          <span className="text-primary">{fmt(total, currency)}</span>
        </div>
      </div>

      {footer && <div className="px-5 py-4 border-t border-border">{footer}</div>}
    </div>
  );
}
