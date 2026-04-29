import { Check, Gift, MapPin, Plus, Star, X } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";
import type { TxRecord } from "./types";

export function InvoiceModal({ transaction, onClose }: { transaction: TxRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center justify-between">
          <Text style={{ fontWeight: 700 }}>Receipt</Text>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {transaction.type === "debit" && transaction.items ? (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border"><div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2"><Check className="w-6 h-6 text-success" /></div><Text className="text-success" style={{ fontWeight: 600 }}>Payment Successful</Text><Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text></div>
              <div className="space-y-2"><div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" /><div><Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{transaction.restaurant}</Text><Text className="text-muted-foreground text-[0.75rem]">{transaction.address}</Text></div></div></div>
              <div className="space-y-2 pt-3 border-t border-border"><Text className="text-[0.75rem] text-muted-foreground" style={{ fontWeight: 600 }}>ORDER DETAILS</Text>{transaction.items.map((item, idx) => <div key={idx} className="flex justify-between"><div className="flex gap-2"><Text className="text-[0.8125rem] text-muted-foreground">{item.qty}x</Text><Text className="text-[0.8125rem]">{item.name}</Text></div><Text className="text-[0.8125rem]">${item.price.toFixed(2)}</Text></div>)}</div>
              <div className="space-y-2 pt-3 border-t border-dashed border-border">
                <div className="flex justify-between text-[0.8125rem]"><Text className="text-muted-foreground">Subtotal</Text><Text>${transaction.subtotal!.toFixed(2)}</Text></div>
                <div className="flex justify-between text-[0.8125rem]"><Text className="text-muted-foreground">Tax</Text><Text>${transaction.tax!.toFixed(2)}</Text></div>
                {transaction.serviceFee! > 0 && <div className="flex justify-between text-[0.8125rem]"><Text className="text-muted-foreground">Service Fee</Text><Text>${transaction.serviceFee!.toFixed(2)}</Text></div>}
                {transaction.discount! > 0 && <div className="flex justify-between text-[0.8125rem]"><Text className="text-success">Discount</Text><Text className="text-success">-${transaction.discount!.toFixed(2)}</Text></div>}
              </div>
              <div className="flex justify-between pt-3 border-t border-border"><Text style={{ fontWeight: 700 }}>Total Paid</Text><Text className="text-[1.125rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text></div>
              <div className="pt-3 border-t border-dashed border-border space-y-1"><div className="flex justify-between text-[0.75rem]"><Text className="text-muted-foreground">Paid From</Text><Text>{transaction.method}</Text></div><div className="flex justify-between text-[0.75rem]"><Text className="text-muted-foreground">Receipt No.</Text><Text>{transaction.receiptNo}</Text></div><div className="flex justify-between text-[0.75rem]"><Text className="text-muted-foreground">Transaction ID</Text><Text>{transaction.transactionId}</Text></div></div>
            </>
          ) : transaction.type === "credit" ? (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border"><div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">{transaction.category === "gift" ? <Gift className="w-6 h-6 text-success" /> : <Plus className="w-6 h-6 text-success" />}</div><Text className="text-success" style={{ fontWeight: 600 }}>Top Up Successful</Text><Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text></div>
              <div className="space-y-3"><div className="flex justify-between"><Text className="text-muted-foreground">Amount</Text><Text className="text-success text-[1.5rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text></div><div className="flex justify-between text-[0.875rem]"><Text className="text-muted-foreground">Via</Text><Text>{transaction.method}</Text></div>{transaction.sender && <div className="flex justify-between text-[0.875rem]"><Text className="text-muted-foreground">From</Text><Text>{transaction.sender}</Text></div>}</div>
              <div className="pt-3 border-t border-dashed border-border space-y-1"><div className="flex justify-between text-[0.75rem]"><Text className="text-muted-foreground">Receipt No.</Text><Text>{transaction.receiptNo}</Text></div><div className="flex justify-between text-[0.75rem]"><Text className="text-muted-foreground">Transaction ID</Text><Text>{transaction.transactionId}</Text></div></div>
            </>
          ) : (
            <>
              <div className="text-center pb-4 border-b border-dashed border-border"><div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2"><Star className="w-6 h-6 text-primary" /></div><Text className="text-primary" style={{ fontWeight: 600 }}>Reward Earned</Text><Text className="text-muted-foreground text-[0.75rem] mt-1">{transaction.date}, {transaction.time}</Text></div>
              <div className="space-y-3"><div className="flex justify-between"><Text className="text-muted-foreground">Amount</Text><Text className="text-success text-[1.5rem]" style={{ fontWeight: 700 }}>{transaction.amount}</Text></div><div className="text-[0.875rem]"><Text className="text-muted-foreground mb-1">Source</Text><Text>{transaction.source}</Text></div></div>
              <div className="pt-3 border-t border-dashed border-border space-y-1"><div className="flex justify-between text-[0.75rem]"><Text className="text-muted-foreground">Receipt No.</Text><Text>{transaction.receiptNo}</Text></div><div className="flex justify-between text-[0.75rem]"><Text className="text-muted-foreground">Transaction ID</Text><Text>{transaction.transactionId}</Text></div></div>
            </>
          )}
          <div className="pt-3"><Button variant="primary" fullWidth onClick={onClose}>Close</Button></div>
        </div>
      </div>
    </div>
  );
}
