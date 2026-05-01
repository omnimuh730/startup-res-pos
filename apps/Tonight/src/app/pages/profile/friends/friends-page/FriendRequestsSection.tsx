import { motion, AnimatePresence } from "framer-motion";
import { Ban, Check } from "lucide-react";
import { Text } from "../../../../components/ds/Text";
import type { FriendRequest } from "./types";

export function FriendRequestsSection({
  friendRequests,
  onReject,
  onApprove,
  onBlock,
}: {
  friendRequests: FriendRequest[];
  onReject: (request: FriendRequest) => void;
  onApprove: (request: FriendRequest) => void;
  onBlock: (request: FriendRequest) => void;
}) {
  return (
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
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">{friendRequests.length} pending</span>
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
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: request.color }}>
                      <Text className="text-[13px] font-bold tracking-wider text-white">{request.initials}</Text>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Text className="truncate text-[15px] font-bold leading-tight text-foreground">{request.name}</Text>
                          <Text className="mt-0.5 truncate text-[13px] text-muted-foreground">{request.username ? `@${request.username}` : request.phone} - {request.requestedAt}</Text>
                        </div>
                      </div>
                      <Text className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">{request.note}</Text>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => onReject(request)} className="h-10 rounded-full border border-border bg-card text-[13px] font-bold text-foreground transition hover:bg-secondary active:scale-[0.98]">Reject</button>
                    <button onClick={() => onApprove(request)} className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary text-[13px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.98]">
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                      Approve
                    </button>
                  </div>
                  <button onClick={() => onBlock(request)} className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-secondary text-[12px] font-bold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]">
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
  );
}
