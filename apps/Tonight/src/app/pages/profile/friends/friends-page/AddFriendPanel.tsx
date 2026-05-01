import { AnimatePresence, motion } from "framer-motion";
import { AtSign, Phone, UserPlus, X } from "lucide-react";
import { Input } from "../../../../components/ds/Input";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";

export function AddFriendPanel({
  showAddForm,
  setShowAddForm,
  newContact,
  setNewContact,
  onAddContact,
}: {
  showAddForm: boolean;
  setShowAddForm: (v: boolean) => void;
  newContact: { name: string; identifier: string };
  setNewContact: (v: { name: string; identifier: string }) => void;
  onAddContact: () => void;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {showAddForm ? (
        <motion.div key="form" initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="mb-6 overflow-hidden">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <Text className="text-[15px] font-bold text-foreground">Add New Friend</Text>
              <button onClick={() => setShowAddForm(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-border">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <Input placeholder="Full Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} fullWidth />
              <div className="relative">
                <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  {newContact.identifier.includes("+") || newContact.identifier.match(/^\d/) ? <Phone className="h-4 w-4" /> : <AtSign className="h-4 w-4" />}
                </div>
                <Input placeholder="Username or Phone number" value={newContact.identifier} onChange={(e) => setNewContact({ ...newContact, identifier: e.target.value })} fullWidth className="!pl-9" />
              </div>
            </div>

            <Button variant="primary" fullWidth onClick={onAddContact} disabled={!newContact.name} className="mt-2 h-[52px] rounded-xl font-bold">
              Add to Contacts
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6">
          <button onClick={() => setShowAddForm(true)} className="flex w-full items-center gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/30 active:bg-secondary/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" strokeWidth={2} />
            </div>
            <div className="flex-1 text-left">
              <Text className="text-[15px] font-bold leading-tight text-foreground">Add a Friend</Text>
              <Text className="mt-0.5 text-[13px] text-muted-foreground">Build your dining circle</Text>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
