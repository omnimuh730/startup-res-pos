import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/ds/Modal";
import { Avatar } from "../../components/ds/Avatar";
import { Text } from "../../components/ds/Text";
import { Button } from "../../components/ds/Button";
import { Animate } from "../../components/ds/Animate";
import { Send, Check, Search, X } from "lucide-react";

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

interface InviteFriendsProps {
  open: boolean;
  onClose: () => void;
  restaurantName: string;
  date: string;
  time: string;
  alreadyInvited?: Set<string>;
  onInvited?: (friendIds: Set<string>) => void;
}

export function InviteFriends({ open, onClose, restaurantName, date, time, alreadyInvited, onInvited }: InviteFriendsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sent, setSent] = useState(false);

  // Sync already-invited friends when dialog opens
  useEffect(() => {
    if (open && alreadyInvited) {
      setSelected(new Set(alreadyInvited));
    }
  }, [open, alreadyInvited]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = FRIENDS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const newSelections = alreadyInvited
    ? new Set([...selected].filter(id => !alreadyInvited.has(id)))
    : selected;

  const handleSend = () => {
    setSent(true);
    onInvited?.(new Set(selected));
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    setSent(false);
    setSelected(new Set());
    setSearch("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader>
        <div>
          <h3 className="text-[1.0625rem]" style={{ fontWeight: 600 }}>Invite Friends</h3>
          <Text className="text-muted-foreground text-[0.875rem] mt-0.5">
            {restaurantName} · {date} · {time}
          </Text>
        </div>
      </ModalHeader>
      <ModalBody>
        {sent ? (
          <Animate preset="scaleIn" duration={0.4}>
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <Text style={{ fontWeight: 600 }} className="text-[1.0625rem] mb-1">
                {newSelections.size > 0 ? `${newSelections.size} Invite${newSelections.size > 1 ? "s" : ""} Sent!` : "Updated!"}
              </Text>
              <Text className="text-muted-foreground text-[0.9375rem]">
                Your friends will receive a notification
              </Text>
            </div>
          </Animate>
        ) : (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search friends..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <Text className="text-[0.9375rem]" style={{ fontWeight: 600 }}>Select Friends</Text>
              <Text className="text-muted-foreground text-[0.875rem]">
                {selected.size > 0 ? `${selected.size} selected` : "None selected"}
              </Text>
            </div>

            {/* Friend Grid */}
            <div className="grid grid-cols-2 gap-2">
              {filtered.map(friend => {
                const isSelected = selected.has(friend.id);
                const wasAlreadyInvited = alreadyInvited?.has(friend.id);
                return (
                  <button
                    key={friend.id}
                    onClick={() => toggle(friend.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? "bg-primary/5 border-2 border-primary"
                        : "bg-secondary border-2 border-transparent hover:bg-secondary/80"
                    }`}
                  >
                    <Avatar name={friend.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <Text className="text-[0.875rem] truncate" style={{ fontWeight: isSelected ? 500 : 400 }}>
                        {friend.name}
                      </Text>
                      {wasAlreadyInvited && isSelected && (
                        <Text className="text-[0.6875rem] text-success">Invited</Text>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="py-8 text-center">
                <Text className="text-muted-foreground text-[0.9375rem]">No friends found</Text>
              </div>
            )}
          </>
        )}
      </ModalBody>
      {!sent && (
        <ModalFooter>
          <Button
            variant="primary"
            fullWidth
            radius="full"
            onClick={handleSend}
            disabled={selected.size === 0}
            leftIcon={<Send className="w-4 h-4" />}
          >
            {selected.size > 0 ? `Send ${selected.size} Invite${selected.size > 1 ? "s" : ""}` : "Select friends to invite"}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}
