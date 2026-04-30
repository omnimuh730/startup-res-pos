import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../components/ds/Modal";
import { Avatar } from "../../components/ds/Avatar";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Check, Search, Send, UserCheck, UserPlus, X } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  initials: string;
  color: string;
}

const FRIENDS: Friend[] = [
  { id: "1", name: "Sarah Kim", initials: "SK", color: "bg-blue-500" },
  { id: "2", name: "Marcus Johnson", initials: "MJ", color: "bg-purple-500" },
  { id: "3", name: "Emma Chen", initials: "EC", color: "bg-emerald-500" },
  { id: "4", name: "David Park", initials: "DP", color: "bg-rose-500" },
  { id: "5", name: "Olivia Tran", initials: "OT", color: "bg-teal-500" },
  { id: "6", name: "James Lee", initials: "JL", color: "bg-indigo-500" },
  { id: "7", name: "Maya Patel", initials: "MP", color: "bg-amber-500" },
  { id: "8", name: "Ryan O'Brien", initials: "RO", color: "bg-green-500" },
];

type InviteView = "notInvited" | "invited";

interface InviteFriendsProps {
  open: boolean;
  onClose: () => void;
  restaurantName: string;
  date: string;
  time: string;
  alreadyInvited?: Set<string>;
  onInvited?: (friendIds: Set<string>) => void;
}

export function InviteFriends({
  open,
  onClose,
  restaurantName,
  date,
  time,
  alreadyInvited,
  onInvited,
}: InviteFriendsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sent, setSent] = useState(false);
  const [view, setView] = useState<InviteView>("notInvited");

  useEffect(() => {
    if (!open) return;
    setSelected(new Set(alreadyInvited ?? []));
    setView("notInvited");
  }, [open, alreadyInvited]);

  const toggle = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = FRIENDS.filter((friend) => friend.name.toLowerCase().includes(search.toLowerCase()));
  const invitedFriends = filtered.filter((friend) => selected.has(friend.id));
  const notInvitedFriends = filtered.filter((friend) => !selected.has(friend.id));
  const visibleFriends = view === "invited" ? invitedFriends : notInvitedFriends;
  const newSelections = alreadyInvited ? new Set([...selected].filter((id) => !alreadyInvited.has(id))) : selected;
  const previousInvites = alreadyInvited ?? new Set<string>();
  const hasChanges = selected.size !== previousInvites.size || [...selected].some((id) => !previousInvites.has(id));

  const handleSend = () => {
    setSent(true);
    onInvited?.(new Set(selected));
    window.setTimeout(() => {
      setSent(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setSent(false);
    setSelected(new Set());
    setSearch("");
    setView("notInvited");
    onClose();
  };

  const sendLabel = newSelections.size > 0
    ? `Send ${newSelections.size} invite${newSelections.size > 1 ? "s" : ""}`
    : hasChanges
      ? "Update invites"
      : "Select friends";

  return (
    <Modal open={open} onClose={handleClose} size="md" className="rounded-[2rem]">
      <ModalHeader className="px-5 pt-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[1.125rem]" style={{ fontWeight: 900 }}>Invite friends</h3>
            <Text className="mt-0.5 line-clamp-2 text-[0.8125rem] leading-snug text-muted-foreground">
              {restaurantName} - {date} - {time}
            </Text>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="px-5 py-4">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: [1.1, 0.96, 1] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success"
            >
              <Check className="h-8 w-8" />
            </motion.div>
            <Text className="text-[1.0625rem]" style={{ fontWeight: 900 }}>
              {newSelections.size > 0 ? `${newSelections.size} invite${newSelections.size > 1 ? "s" : ""} sent` : "Invites updated"}
            </Text>
            <Text className="mt-1 text-[0.875rem] text-muted-foreground">Your reservation list is up to date.</Text>
          </motion.div>
        ) : (
          <>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search friends"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-full border border-border bg-secondary/55 pl-10 pr-10 text-[0.9375rem] outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/15"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 rounded-full bg-secondary/65 p-1">
              {[
                { id: "notInvited" as const, label: "Not invited", count: notInvitedFriends.length, icon: UserPlus },
                { id: "invited" as const, label: "Invited", count: invitedFriends.length, icon: UserCheck },
              ].map((option) => {
                const Icon = option.icon;
                const active = view === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setView(option.id)}
                    className={`flex h-9 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2 text-[0.8125rem] transition ${
                      active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                    style={{ fontWeight: 900 }}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{option.label}</span>
                    <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.625rem] ${active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
                      {option.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mb-3 flex items-center justify-between px-1">
              <Text className="text-[0.9375rem]" style={{ fontWeight: 900 }}>
                {view === "invited" ? "Already invited" : "Available friends"}
              </Text>
              <Text className="text-[0.8125rem] text-muted-foreground">{selected.size} selected</Text>
            </div>

            <div className="max-h-[42vh] space-y-2 overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {visibleFriends.map((friend) => {
                  const isSelected = selected.has(friend.id);
                  const wasAlreadyInvited = alreadyInvited?.has(friend.id);
                  return (
                    <motion.button
                      layout
                      key={friend.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={() => toggle(friend.id)}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-[1.25rem] border p-3 text-left transition ${
                        isSelected ? "border-primary/35 bg-primary/8" : "border-border bg-card hover:border-primary/25"
                      }`}
                    >
                      <Avatar name={friend.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <Text className="truncate text-[0.9375rem]" style={{ fontWeight: 800 }}>
                          {friend.name}
                        </Text>
                        <Text className={`text-[0.75rem] ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                          {wasAlreadyInvited ? "Previously invited" : isSelected ? "Ready to send" : "Not invited"}
                        </Text>
                      </div>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {isSelected ? <Check className="h-4 w-4" /> : <UserPlus className="h-3.5 w-3.5" />}
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {visibleFriends.length === 0 && (
              <div className="rounded-[1.5rem] bg-secondary/60 px-5 py-8 text-center">
                <Text className="text-[0.9375rem] text-muted-foreground">
                  {view === "invited" ? "No invited friends match this search." : "No available friends match this search."}
                </Text>
              </div>
            )}
          </>
        )}
      </ModalBody>

      {!sent && (
        <ModalFooter className="px-5">
          <Button
            variant="primary"
            fullWidth
            radius="full"
            className="h-12 font-bold"
            onClick={handleSend}
            disabled={!hasChanges && selected.size === 0}
            leftIcon={<Send className="h-4 w-4" />}
          >
            {sendLabel}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}
