import { Check, Gift, MapPin, Plus, Star, X } from "lucide-react";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";
import type { TxRecord } from "./types";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

export function InvoiceModal({ transaction, onClose }: { transaction: TxRecord; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-end justify-center p-0 font-sans sm:items-center sm:p-4">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Body */}
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="relative max-h-[90%] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <Text className="text-[1rem]" style={{ fontWeight: 700 }}>Transaction Receipt</Text>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-black"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {transaction.type === "debit" && transaction.items ? (
            <>
              <div className="text-center pb-6 border-b border-dashed border-gray-200">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Check className="w-7 h-7 text-white" strokeWidth={3} />
                </div>
                <Text className="text-[1.5rem] text-black tracking-tight leading-none mb-1" style={{ fontWeight: 700 }}>
                  {transaction.amount}
                </Text>
                <Text className="text-gray-500 text-[0.875rem] font-medium">Payment Successful</Text>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl">
                <MapPin className="w-5 h-5 text-black mt-0.5 shrink-0" />
                <div>
                  <Text className="text-[1rem] text-black" style={{ fontWeight: 700 }}>{transaction.restaurant}</Text>
                  <Text className="text-gray-500 text-[0.8125rem] mt-0.5">{transaction.address}</Text>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Text className="text-[0.75rem] text-gray-400 tracking-widest uppercase mb-2" style={{ fontWeight: 700 }}>Order Summary</Text>
                {transaction.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Text className="text-[0.875rem] text-gray-400 font-medium">{item.qty}x</Text>
                      <Text className="text-[0.875rem] text-black font-medium">{item.name}</Text>
                    </div>
                    <Text className="text-[0.875rem] text-black font-medium">${item.price.toFixed(2)}</Text>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-dashed border-gray-200">
                <div className="flex justify-between text-[0.875rem] text-gray-500"><Text>Subtotal</Text><Text>${transaction.subtotal!.toFixed(2)}</Text></div>
                <div className="flex justify-between text-[0.875rem] text-gray-500"><Text>Tax</Text><Text>${transaction.tax!.toFixed(2)}</Text></div>
                {transaction.serviceFee! > 0 && <div className="flex justify-between text-[0.875rem] text-gray-500"><Text>Service Fee</Text><Text>${transaction.serviceFee!.toFixed(2)}</Text></div>}
                {transaction.discount! > 0 && <div className="flex justify-between text-[0.875rem] text-green-600"><Text>Discount</Text><Text>-${transaction.discount!.toFixed(2)}</Text></div>}
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-[0.8125rem]"><Text className="text-gray-400 font-medium">Date</Text><Text className="text-black font-medium">{transaction.date}, {transaction.time}</Text></div>
                <div className="flex justify-between text-[0.8125rem]"><Text className="text-gray-400 font-medium">Paid From</Text><Text className="text-black font-medium">{transaction.method}</Text></div>
                <div className="flex justify-between text-[0.8125rem]"><Text className="text-gray-400 font-medium">Transaction ID</Text><Text className="text-black font-medium">{transaction.transactionId}</Text></div>
              </div>
            </>
          ) : (
            /* Layout for Top-ups and Rewards */
            <>
              <div className="text-center pb-6 border-b border-dashed border-gray-200">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md ${transaction.type === "credit" ? "bg-black" : "bg-[#FF5A5F]"}`}>
                  {transaction.category === "reward" ? <Star className="w-7 h-7 text-white" strokeWidth={2.5} /> : <Plus className="w-7 h-7 text-white" strokeWidth={3} />}
                </div>
                <Text className={`text-[2rem] tracking-tight leading-none mb-1 ${transaction.type === "credit" ? "text-black" : "text-[#FF5A5F]"}`} style={{ fontWeight: 700 }}>
                  {transaction.amount}
                </Text>
                <Text className="text-gray-500 text-[0.875rem] font-medium">
                  {transaction.category === "reward" ? "Reward Earned" : "Top Up Successful"}
                </Text>
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex justify-between text-[0.875rem]"><Text className="text-gray-400 font-medium">Date</Text><Text className="text-black font-medium">{transaction.date}, {transaction.time}</Text></div>
                {transaction.method && <div className="flex justify-between text-[0.875rem]"><Text className="text-gray-400 font-medium">Via</Text><Text className="text-black font-medium">{transaction.method}</Text></div>}
                {transaction.source && <div className="flex justify-between text-[0.875rem]"><Text className="text-gray-400 font-medium">Source</Text><Text className="text-black font-medium">{transaction.source}</Text></div>}
                <div className="flex justify-between text-[0.875rem]"><Text className="text-gray-400 font-medium">Transaction ID</Text><Text className="text-black font-medium">{transaction.transactionId}</Text></div>
              </div>
            </>
          )}

          <div className="pt-4 pb-2">
            <button 
              onClick={onClose} 
              className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-[1rem] hover:bg-gray-800 transition active:scale-[0.98] shadow-lg shadow-black/10"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
