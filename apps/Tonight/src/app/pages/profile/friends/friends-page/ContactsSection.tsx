import { motion } from "framer-motion";
import { Ban, Trash2 } from "lucide-react";
import { Text } from "../../../../components/ds/Text";
import type { Contact } from "./types";

export function ContactsSection({
  contacts,
  onConfirmRemove,
  onBlock,
}: {
  contacts: Contact[];
  onConfirmRemove: (id: string) => void;
  onBlock: (contact: Contact) => void;
}) {
  return (
    <>
      <Text className="mb-3 px-1 text-[14px] font-bold text-foreground">{contacts.length} Contacts</Text>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {contacts.map((contact, idx) => (
          <motion.div layout key={contact.id} className={`flex items-center gap-3.5 bg-card p-4 transition-colors active:bg-secondary/50 ${idx !== contacts.length - 1 ? "border-b border-border/60" : ""}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: contact.color }}>
              <Text className="text-[13px] font-bold tracking-wider text-white">{contact.initials}</Text>
            </div>
            <div className="min-w-0 flex-1">
              <Text className="truncate text-[15px] font-semibold text-foreground">{contact.name}</Text>
              <Text className="mt-0.5 truncate text-[13px] text-muted-foreground">{contact.username ? `@${contact.username}` : contact.phone}</Text>
            </div>
            <button onClick={() => onConfirmRemove(contact.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove ${contact.name}`}>
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={() => onBlock(contact)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label={`Block ${contact.name}`}>
              <Ban className="h-4 w-4" />
            </button>
          </motion.div>
        ))}

        {contacts.length === 0 && (
          <div className="p-8 text-center">
            <Text className="text-[15px] font-semibold text-foreground">No friends yet</Text>
            <Text className="mt-1 text-[13px] text-muted-foreground">Add friends to easily invite them to reservations.</Text>
          </div>
        )}
      </div>
    </>
  );
}
