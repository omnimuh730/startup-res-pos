import { useState } from "react";
import { Input } from "../../../components/ds/Input";
import { Button } from "../../../components/ds/Button";
import { Text } from "../../../components/ds/Text";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ds/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, UserPlus, AtSign, Phone } from "lucide-react";
import { PageHeader } from "../profileHelpers";

interface Contact {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  initials: string;
  color: string;
}

export function FriendsPage({ onBack }: { onBack: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({ name: "", identifier: "" });
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Sarah Kim", username: "sarahkim", initials: "SK", color: "#E11D48" },
    { id: "2", name: "Marcus Johnson", username: "marcusj", initials: "MJ", color: "#2563EB" },
    { id: "3", name: "Emma Chen", username: "emmachen", initials: "EC", color: "#059669" },
    { id: "4", name: "David Park", phone: "+1 (555) 567-8901", initials: "DP", color: "#D97706" },
    { id: "5", name: "Olivia Tran", username: "oliviat", initials: "OT", color: "#7C3AED" },
  ]);

  const handleAddContact = () => {
    if (!newContact.name) return;
    
    const initials = newContact.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

    const colors = ["#E11D48", "#2563EB", "#059669", "#D97706", "#7C3AED", "#0891B2", "#DC2626", "#0D9488"];
    const isPhone = newContact.identifier.includes("+") || newContact.identifier.match(/^\d/);

    setContacts([
      {
        id: String(Date.now()),
        name: newContact.name,
        username: !isPhone && newContact.identifier ? newContact.identifier : undefined,
        phone: isPhone && newContact.identifier ? newContact.identifier : undefined,
        initials,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      ...contacts, // Add new friend to the top
    ]);

    setNewContact({ name: "", identifier: "" });
    setShowAddForm(false);
  };

  return (
    <>
      <div className="pb-8">
        <PageHeader title="Friends & Contacts" onBack={onBack} />
        
        <div className="px-5 pt-2">
          {/* Top Add Action / Form */}
          <AnimatePresence mode="wait" initial={false}>
            {showAddForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-4 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <Text className="text-[15px] font-bold text-foreground">Add New Friend</Text>
                    <button 
                      onClick={() => setShowAddForm(false)} 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-border transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="Full Name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      fullWidth
                    />
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        {newContact.identifier.includes("+") || newContact.identifier.match(/^\d/) ? <Phone className="w-4 h-4" /> : <AtSign className="w-4 h-4" />}
                      </div>
                      <Input
                        placeholder="Username or Phone number"
                        value={newContact.identifier}
                        onChange={(e) => setNewContact({ ...newContact, identifier: e.target.value })}
                        fullWidth
                        className="!pl-9"
                      />
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleAddContact}
                    disabled={!newContact.name}
                    className="h-[52px] rounded-xl font-bold mt-2"
                  >
                    Add to Contacts
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full p-4 rounded-2xl border border-border bg-card hover:border-foreground/30 active:bg-secondary/50 transition-all flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-primary" strokeWidth={2} />
                  </div>
                  <div className="flex-1 text-left">
                    <Text className="text-[15px] font-bold text-foreground leading-tight">Add a Friend</Text>
                    <Text className="text-muted-foreground text-[13px] mt-0.5">Build your dining circle</Text>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact List */}
          <Text className="text-[14px] font-bold text-foreground mb-3 px-1">{contacts.length} Contacts</Text>
          
          <div className="border border-border rounded-2xl bg-card overflow-hidden">
            {contacts.map((contact, idx) => (
              <motion.div 
                layout
                key={contact.id} 
                className={`flex items-center gap-3.5 p-4 bg-card active:bg-secondary/50 transition-colors ${
                  idx !== contacts.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
                  style={{ backgroundColor: contact.color }}
                >
                  <Text className="text-[13px] font-bold text-white tracking-wider">{contact.initials}</Text>
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-[15px] font-semibold text-foreground truncate">{contact.name}</Text>
                  <Text className="text-muted-foreground text-[13px] mt-0.5 truncate">
                    {contact.username ? `@${contact.username}` : contact.phone}
                  </Text>
                </div>
                <button
                  onClick={() => setConfirmModal(contact.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            
            {contacts.length === 0 && (
              <div className="p-8 text-center">
                <Text className="text-[15px] font-semibold text-foreground">No friends yet</Text>
                <Text className="text-muted-foreground text-[13px] mt-1">Add friends to easily invite them to reservations.</Text>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={confirmModal !== null} onClose={() => setConfirmModal(null)} size="sm">
        <ModalHeader>Remove Contact</ModalHeader>
        <ModalBody>
          <Text className="text-[14px] text-muted-foreground leading-relaxed">
            Are you sure you want to remove this contact from your friends list? They won't be notified.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" className="rounded-full font-semibold" onClick={() => setConfirmModal(null)}>Cancel</Button>
          <Button
            variant="destructive"
            className="rounded-full font-semibold"
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