import { useState } from "react";
import { Input } from "../../../components/ds/Input";
import { Button } from "../../../components/ds/Button";
import { Text } from "../../../components/ds/Text";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ds/Modal";
import { useToast } from "../../../components/ds/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, Check, RotateCcw, X, Trash2, UserPlus, AtSign, Phone } from "lucide-react";
import { PageHeader } from "../profileHelpers";

interface Contact {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  initials: string;
  color: string;
}

interface FriendRequest extends Contact {
  requestedAt: string;
  note: string;
}

interface BlockedContact extends Contact {
  blockedAt: string;
  reason: string;
}

export function FriendsPage({ onBack }: { onBack: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({ name: "", identifier: "" });
  const { toast } = useToast();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: "req-1",
      name: "Mina Park",
      username: "minapark",
      initials: "MP",
      color: "#DB2777",
      requestedAt: "2h ago",
      note: "Wants to plan dinners and split reservations with you.",
    },
    {
      id: "req-2",
      name: "Noah Williams",
      username: "noahw",
      initials: "NW",
      color: "#0891B2",
      requestedAt: "Yesterday",
      note: "Sent a friend request from your recent dining circle.",
    },
  ]);
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Sarah Kim", username: "sarahkim", initials: "SK", color: "#E11D48" },
    { id: "2", name: "Marcus Johnson", username: "marcusj", initials: "MJ", color: "#2563EB" },
    { id: "3", name: "Emma Chen", username: "emmachen", initials: "EC", color: "#059669" },
    { id: "4", name: "David Park", phone: "+1 (555) 567-8901", initials: "DP", color: "#D97706" },
    { id: "5", name: "Olivia Tran", username: "oliviat", initials: "OT", color: "#7C3AED" },
  ]);
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([]);

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

    setContacts((current) => [
      {
        id: String(Date.now()),
        name: newContact.name,
        username: !isPhone && newContact.identifier ? newContact.identifier : undefined,
        phone: isPhone && newContact.identifier ? newContact.identifier : undefined,
        initials,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      ...current,
    ]);

    setNewContact({ name: "", identifier: "" });
    setShowAddForm(false);
    toast({
      type: "success",
      title: "Friend added",
      description: `${newContact.name} was added to your dining circle.`,
    });
  };

  const handleApproveRequest = (request: FriendRequest) => {
    const contact: Contact = {
      id: request.id,
      name: request.name,
      username: request.username,
      phone: request.phone,
      initials: request.initials,
      color: request.color,
    };
    setContacts((current) => [contact, ...current.filter((c) => c.id !== contact.id)]);
    setFriendRequests((current) => current.filter((r) => r.id !== request.id));
    toast({
      type: "success",
      title: "Friend request approved",
      description: `${request.name} is now in your dining circle.`,
    });
  };

  const handleRejectRequest = (request: FriendRequest) => {
    setFriendRequests((current) => current.filter((r) => r.id !== request.id));
    toast({
      type: "info",
      title: "Friend request rejected",
      description: `${request.name}'s request was dismissed.`,
    });
  };

  const handleBlockContact = (contact: Contact, reason = "Blocked from friend requests and invites") => {
    const blocked: BlockedContact = {
      ...contact,
      blockedAt: "Just now",
      reason,
    };
    setBlockedContacts((current) => [blocked, ...current.filter((c) => c.id !== contact.id)]);
    setContacts((current) => current.filter((c) => c.id !== contact.id));
    setFriendRequests((current) => current.filter((r) => r.id !== contact.id));
    toast({
      type: "warning",
      title: "Contact blocked",
      description: `${contact.name} can no longer send friend requests or invites.`,
    });
  };

  const handleUnblockContact = (contactId: string) => {
    const blocked = blockedContacts.find((c) => c.id === contactId);
    setBlockedContacts((current) => current.filter((c) => c.id !== contactId));
    if (blocked) {
      toast({
        type: "success",
        title: "Contact unblocked",
        description: `${blocked.name} can send requests again.`,
      });
    }
  };

  const handleRemoveContact = (contactId: string) => {
    const removed = contacts.find((c) => c.id === contactId);
    setContacts((current) => current.filter((c) => c.id !== contactId));
    setConfirmModal(null);
    if (removed) {
      toast({
        type: "info",
        title: "Contact removed",
        description: `${removed.name} was removed from your contacts.`,
      });
    }
  };

  const handleConfirmBlock = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) handleBlockContact(contact, "Blocked from your contacts list");
    setConfirmModal(null);
  };

  return (
    <>
      <div className="pb-8">
        <PageHeader title="Friends & Contacts" onBack={onBack} />
        
        <div className="px-5 pt-2">
          {/* Pending Friend Requests */}
          <AnimatePresence initial={false}>
            {friendRequests.length > 0 && (
              <motion.section
                key="friend-requests"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                className="mb-6 overflow-hidden"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <Text className="text-[14px] font-bold text-foreground">Friend requests</Text>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {friendRequests.length} pending
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  <AnimatePresence initial={false}>
                    {friendRequests.map((request, idx) => (
                      <motion.div
                        layout
                        key={request.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, height: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.32 }}
                        className={`p-4 ${idx !== friendRequests.length - 1 ? "border-b border-border/60" : ""}`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                            style={{ backgroundColor: request.color }}
                          >
                            <Text className="text-[13px] font-bold tracking-wider text-white">{request.initials}</Text>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Text className="truncate text-[15px] font-bold leading-tight text-foreground">{request.name}</Text>
                                <Text className="mt-0.5 truncate text-[13px] text-muted-foreground">
                                  {request.username ? `@${request.username}` : request.phone} - {request.requestedAt}
                                </Text>
                              </div>
                            </div>
                            <Text className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                              {request.note}
                            </Text>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleRejectRequest(request)}
                            className="h-10 rounded-full border border-border bg-card text-[13px] font-bold text-foreground transition hover:bg-secondary active:scale-[0.98]"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveRequest(request)}
                            className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary text-[13px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.98]"
                          >
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                            Approve
                          </button>
                        </div>
                        <button
                          onClick={() => handleBlockContact(request, "Blocked from pending friend requests")}
                          className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-secondary text-[12px] font-bold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Block this person
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

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
                  aria-label={`Remove ${contact.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleBlockContact(contact, "Blocked from your contacts list")}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label={`Block ${contact.name}`}
                >
                  <Ban className="w-4 h-4" />
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

          {/* Blocklist */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between px-1">
              <Text className="text-[14px] font-bold text-foreground">Blocked list</Text>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                {blockedContacts.length} blocked
              </span>
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
                      className={`flex items-center gap-3.5 p-4 ${
                        idx !== blockedContacts.length - 1 ? "border-b border-border/60" : ""
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                        <Ban className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Text className="truncate text-[15px] font-semibold text-foreground">{contact.name}</Text>
                        <Text className="mt-0.5 truncate text-[12px] text-muted-foreground">
                          {contact.reason} - {contact.blockedAt}
                        </Text>
                      </div>
                      <button
                        onClick={() => handleUnblockContact(contact.id)}
                        className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-[12px] font-bold text-foreground transition hover:bg-secondary active:scale-[0.98]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Unblock
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 text-center"
                  >
                    <Text className="text-[14px] font-semibold text-foreground">No blocked contacts</Text>
                    <Text className="mt-1 text-[12px] text-muted-foreground">
                      Block spammers from friend requests or your contacts list.
                    </Text>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              if (confirmModal) handleRemoveContact(confirmModal);
            }}
          >
            Remove
          </Button>
          <Button
            variant="outline"
            className="rounded-full font-semibold"
            onClick={() => {
              if (confirmModal) handleConfirmBlock(confirmModal);
            }}
          >
            Block
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
