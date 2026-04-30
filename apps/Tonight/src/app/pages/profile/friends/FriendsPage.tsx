import { useState } from "react";
import { useToast } from "../../../components/ds/Toast";
import { PageHeader } from "../profileHelpers";
import type { Contact, FriendRequest, BlockedContact } from "./friends-page/types";
import { FriendRequestsSection } from "./friends-page/FriendRequestsSection";
import { AddFriendPanel } from "./friends-page/AddFriendPanel";
import { ContactsSection } from "./friends-page/ContactsSection";
import { BlockedContactsSection } from "./friends-page/BlockedContactsSection";
import { RemoveContactModal } from "./friends-page/RemoveContactModal";

export function FriendsPage({ onBack }: { onBack: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({ name: "", identifier: "" });
  const { toast } = useToast();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    { id: "req-1", name: "Mina Park", username: "minapark", initials: "MP", color: "#DB2777", requestedAt: "2h ago", note: "Wants to plan dinners and split reservations with you." },
    { id: "req-2", name: "Noah Williams", username: "noahw", initials: "NW", color: "#0891B2", requestedAt: "Yesterday", note: "Sent a friend request from your recent dining circle." },
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

    const initials =
      newContact.name
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
    toast({ type: "success", title: "Friend added", description: `${newContact.name} was added to your dining circle.` });
  };

  const handleApproveRequest = (request: FriendRequest) => {
    const contact: Contact = { id: request.id, name: request.name, username: request.username, phone: request.phone, initials: request.initials, color: request.color };
    setContacts((current) => [contact, ...current.filter((c) => c.id !== contact.id)]);
    setFriendRequests((current) => current.filter((r) => r.id !== request.id));
    toast({ type: "success", title: "Friend request approved", description: `${request.name} is now in your dining circle.` });
  };

  const handleRejectRequest = (request: FriendRequest) => {
    setFriendRequests((current) => current.filter((r) => r.id !== request.id));
    toast({ type: "info", title: "Friend request rejected", description: `${request.name}'s request was dismissed.` });
  };

  const handleBlockContact = (contact: Contact, reason = "Blocked from friend requests and invites") => {
    const blocked: BlockedContact = { ...contact, blockedAt: "Just now", reason };
    setBlockedContacts((current) => [blocked, ...current.filter((c) => c.id !== contact.id)]);
    setContacts((current) => current.filter((c) => c.id !== contact.id));
    setFriendRequests((current) => current.filter((r) => r.id !== contact.id));
    toast({ type: "warning", title: "Contact blocked", description: `${contact.name} can no longer send friend requests or invites.` });
  };

  const handleUnblockContact = (contactId: string) => {
    const blocked = blockedContacts.find((c) => c.id === contactId);
    setBlockedContacts((current) => current.filter((c) => c.id !== contactId));
    if (blocked) {
      toast({ type: "success", title: "Contact unblocked", description: `${blocked.name} can send requests again.` });
    }
  };

  const handleRemoveContact = (contactId: string) => {
    const removed = contacts.find((c) => c.id === contactId);
    setContacts((current) => current.filter((c) => c.id !== contactId));
    setConfirmModal(null);
    if (removed) {
      toast({ type: "info", title: "Contact removed", description: `${removed.name} was removed from your contacts.` });
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
          <FriendRequestsSection
            friendRequests={friendRequests}
            onReject={handleRejectRequest}
            onApprove={handleApproveRequest}
            onBlock={(request) => handleBlockContact(request, "Blocked from pending friend requests")}
          />

          <AddFriendPanel
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            newContact={newContact}
            setNewContact={setNewContact}
            onAddContact={handleAddContact}
          />

          <ContactsSection contacts={contacts} onConfirmRemove={setConfirmModal} onBlock={(contact) => handleBlockContact(contact, "Blocked from your contacts list")} />
          <BlockedContactsSection blockedContacts={blockedContacts} onUnblock={handleUnblockContact} />
        </div>
      </div>

      <RemoveContactModal
        open={confirmModal !== null}
        onClose={() => setConfirmModal(null)}
        onRemove={() => {
          if (confirmModal) handleRemoveContact(confirmModal);
        }}
        onBlock={() => {
          if (confirmModal) handleConfirmBlock(confirmModal);
        }}
      />
    </>
  );
}
