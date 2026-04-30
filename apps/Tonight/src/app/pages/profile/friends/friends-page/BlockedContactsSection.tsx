import { AnimatePresence, motion } from "framer-motion";
import { Ban, RotateCcw } from "lucide-react";
import { Text } from "../../../../components/ds/Text";
import type { BlockedContact } from "./types";

export function BlockedContactsSection({
  blockedContacts,
  onUnblock,
}: {
  blockedContacts: BlockedContact[];
  onUnblock: (id: string) => void;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between px-1">
        <Text className="text-[14px] font-bold text-foreground">Blocked list</Text>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{blockedContacts.length} blocked</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <AnimatePresence initial={false}>
          {blockedContacts.length > 0 ? (
            blockedContacts.map((contact, idx) => (
              <motion.div
                layout
                key={contact.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className={`flex items-center gap-3.5 p-4 ${idx !== blockedContacts.length - 1 ? "border-b border-border/60" : ""}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Ban className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <Text className="truncate text-[15px] font-semibold text-foreground">{contact.name}</Text>
                  <Text className="mt-0.5 truncate text-[12px] text-muted-foreground">{contact.reason} - {contact.blockedAt}</Text>
                </div>
                <button onClick={() => onUnblock(contact.id)} className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-[12px] font-bold text-foreground transition hover:bg-secondary active:scale-[0.98]">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Unblock
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 text-center">
              <Text className="text-[14px] font-semibold text-foreground">No blocked contacts</Text>
              <Text className="mt-1 text-[12px] text-muted-foreground">Block spammers from friend requests or your contacts list.</Text>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
