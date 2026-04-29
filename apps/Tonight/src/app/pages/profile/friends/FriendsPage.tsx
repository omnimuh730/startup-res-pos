import { useState } from "react";
import { Input } from "../../../components/ds/Input";
import { Button } from "../../../components/ds/Button";
import { Text } from "../../../components/ds/Text";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../../../components/ds/Modal";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Trash2,
  UserPlus,
  Sparkles,
  AtSign,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "../profileHelpers";

interface Contact {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  initials: string;
  color: string;
}

export function FriendsPage({
  onBack,
}: {
  onBack: () => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState<
    string | null
  >(null);
  const [newContact, setNewContact] = useState({
    name: "",
    username: "",
    phone: "",
  });
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Sarah Kim", username: "sarahkim", initials: "SK", color: "#EC4899" },
    { id: "2", name: "Marcus Johnson", username: "marcusj", initials: "MJ", color: "#3B82F6" },
    { id: "3", name: "Emma Chen", username: "emmachen", initials: "EC", color: "#10B981" },
    { id: "4", name: "David Park", phone: "+1 (555) 567-8901", initials: "DP", color: "#F59E0B" },
    { id: "5", name: "Olivia Tran", username: "oliviat", initials: "OT", color: "#8B5CF6" },
    { id: "6", name: "James Lee", username: "jameslee", initials: "JL", color: "#06B6D4" },
    { id: "7", name: "Maya Patel", username: "mayap", initials: "MP", color: "#EF4444" },
    { id: "8", name: "Ryan O'Brien", phone: "+1 (555) 789-0123", initials: "RO", color: "#14B8A6" },
  ]);
  const handleAddContact = () => {
    if (!newContact.name) return;
    const initials = newContact.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const colors = [
      "#EC4899", "#3B82F6", "#10B981", "#F59E0B",
      "#8B5CF6", "#06B6D4", "#EF4444", "#14B8A6",
    ];
    setContacts([
      ...contacts,
      {
        id: String(Date.now()),
        name: newContact.name,
        username: newContact.username || undefined,
        phone: newContact.phone || undefined,
        initials,
        color:
          colors[Math.floor(Math.random() * colors.length)],
      },
    ]);
    setNewContact({ name: "", username: "", phone: "" });
    setShowAddForm(false);
  };
  return (
    <>
      <div className="pb-8">
        <PageHeader
          title="Friends & Contacts"
          onBack={onBack}
        />
        <AnimatePresence mode="wait" initial={false}>
          {showAddForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-4 rounded-3xl overflow-hidden border border-border bg-card shadow-sm"
            >
              <div
                className="relative px-5 pt-5 pb-12"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--primary) 22%, transparent), color-mix(in oklab, var(--info) 18%, transparent))",
                }}
              >
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewContact({ name: "", username: "", phone: "" });
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -4, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  </motion.div>
                  <Text className="text-[1.0625rem]" style={{ fontWeight: 700 }}>New Friend</Text>
                </div>
                <Text className="text-muted-foreground text-[0.8125rem] mt-1">
                  Add someone to share dining moments with
                </Text>
              </div>

              <div className="relative px-5">
                <motion.div
                  layout
                  className="absolute -top-9 left-5 w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-card"
                  style={{
                    background: newContact.name
                      ? "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 60%, var(--info)))"
                      : "linear-gradient(135deg, var(--muted), var(--secondary))",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                  }}
                >
                  {newContact.name ? (
                    newContact.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                  ) : (
                    <UserPlus className="w-7 h-7 text-muted-foreground" />
                  )}
                </motion.div>
              </div>

              <div className="px-5 pt-12 pb-5 space-y-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <AtSign className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="username"
                    value={newContact.username}
                    onChange={(e) =>
                      setNewContact({ ...newContact, username: e.target.value })
                    }
                    fullWidth
                    className="!pl-10 !rounded-2xl"
                  />
                </div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="primary"
                    fullWidth
                    radius="full"
                    leftIcon={<UserPlus className="w-4 h-4" />}
                    onClick={handleAddContact}
                    disabled={!newContact.name}
                    className="mt-1"
                  >
                    Add to Contacts
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className="w-full mb-4 p-4 rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition flex items-center gap-3 group"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center group-hover:scale-110 transition"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 60%, var(--info)))",
                }}
              >
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <Text className="text-[0.9375rem] text-primary" style={{ fontWeight: 700 }}>Add a Friend</Text>
                <Text className="text-muted-foreground text-[0.75rem]">Build your dining circle</Text>
              </div>
              <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
        <Text className="text-[0.6875rem] text-muted-foreground mb-3">{contacts.length} contacts</Text>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-[0.8125rem]"
                style={{ backgroundColor: contact.color, fontWeight: 600 }}
              >
                {contact.initials}
              </div>
              <div className="flex-1 min-w-0">
                <Text className="text-[0.8125rem]" style={{ fontWeight: 600 }}>{contact.name}</Text>
                <Text className="text-muted-foreground text-[0.6875rem]">
                  {contact.username ? `@${contact.username}` : contact.phone}
                </Text>
              </div>
              <button
                onClick={() => setConfirmModal(contact.id)}
                className="p-1.5 rounded-lg hover:bg-background/50 transition text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Modal open={confirmModal !== null} onClose={() => setConfirmModal(null)} size="sm">
        <ModalHeader>Remove Contact</ModalHeader>
        <ModalBody>
          <Text className="text-[0.8125rem] text-muted-foreground">Are you sure you want to remove this contact?</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setConfirmModal(null)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirmModal) {
                setContacts(contacts.filter((c) => c.id !== confirmModal));
                setConfirmModal(null);
              }
            }}
          >
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
