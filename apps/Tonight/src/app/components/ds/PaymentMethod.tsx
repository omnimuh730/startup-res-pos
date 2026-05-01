import { CreditCard, Check } from "lucide-react";
import { type ReactNode } from "react";

type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "generic";

export interface PaymentCard {
  id: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
  isDefault?: boolean;
  holderName?: string;
}

export interface PaymentMethodProps {
  cards: PaymentCard[];
  selected?: string;
  onSelect?: (id: string) => void;
  onAddNew?: () => void;
  className?: string;
}

const brandColors: Record<CardBrand, { bg: string; text: string; label: string }> = {
  visa: { bg: "bg-blue-600", text: "text-white", label: "Visa" },
  mastercard: { bg: "bg-orange-500", text: "text-white", label: "Mastercard" },
  amex: { bg: "bg-sky-700", text: "text-white", label: "Amex" },
  discover: { bg: "bg-amber-500", text: "text-white", label: "Discover" },
  generic: { bg: "bg-gray-600", text: "text-white", label: "Card" },
};

function MiniCard({ brand }: { brand: CardBrand }) {
  const b = brandColors[brand];
  return (
    <div className={`w-10 h-7 ${b.bg} ${b.text} rounded-md flex items-center justify-center`}>
      <CreditCard className="w-4 h-4" />
    </div>
  );
}

export function PaymentMethod({
  cards,
  selected,
  onSelect,
  onAddNew,
  className = "",
}: PaymentMethodProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {cards.map((card) => {
        const isSelected = selected === card.id;
        const b = brandColors[card.brand];

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect?.(card.id)}
            className={`
              w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer text-left
              ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"}
            `}
          >
            <MiniCard brand={card.brand} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[0.8125rem]">{b.label} •••• {card.last4}</p>
                {card.isDefault && (
                  <span className="px-1.5 py-0.5 text-[0.5625rem] bg-primary/10 text-primary rounded-full">Default</span>
                )}
              </div>
              <p className="text-[0.6875rem] text-muted-foreground">
                {card.holderName && `${card.holderName} · `}Expires {card.expiry}
              </p>
            </div>
            {isSelected && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </button>
        );
      })}

      {onAddNew && (
        <button
          type="button"
          onClick={onAddNew}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-xl text-[0.8125rem] text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          Add new payment method
        </button>
      )}
    </div>
  );
}
