import type { ComponentType } from "react";
import { motion } from "motion/react";
import { Modal, ModalBody, ModalFooter } from "../../../components/ds/Modal";
import { Text, Heading } from "../../../components/ds/Text";
import { Button } from "../../../components/ds/Button";
import { AlertTriangle, Clock, Pencil, ShieldCheck, Trash2 } from "lucide-react";

function ActionOption({
  icon: Icon,
  label,
  desc,
  tone,
  onClick,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  desc: string;
  tone: "primary" | "danger";
  onClick: () => void;
}) {
  const toneClass = tone === "primary" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.975 }}
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-[1.25rem] border border-border bg-card p-3.5 text-left shadow-[0_6px_20px_rgba(0,0,0,0.045)] transition hover:border-primary/30"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <Text className="text-[0.9375rem]" style={{ fontWeight: 800 }}>
          {label}
        </Text>
        <Text className="mt-0.5 text-[0.75rem] text-muted-foreground">{desc}</Text>
      </span>
    </motion.button>
  );
}

export function ManageSheet({
  open,
  onClose,
  onModify,
  onCancel,
}: {
  open: boolean;
  onClose: () => void;
  onModify: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" className="rounded-[2rem]">
      <ModalBody className="px-5 pb-5 pt-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <Heading level={4}>Manage booking</Heading>
            <Text className="mt-0.5 text-[0.8125rem] text-muted-foreground">Make a change or release the table.</Text>
          </div>
        </div>
        <div className="space-y-2.5">
          <ActionOption icon={Pencil} label="Modify reservation" desc="Adjust guests, seating, time, or notes." tone="primary" onClick={onModify} />
          <ActionOption icon={Trash2} label="Cancel booking" desc="The restaurant will receive the released seat." tone="danger" onClick={onCancel} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-[0.875rem] text-muted-foreground transition hover:bg-secondary"
          style={{ fontWeight: 800 }}
        >
          Close
        </button>
      </ModalBody>
    </Modal>
  );
}

export function CancelConfirmModal({
  open,
  onClose,
  onConfirm,
  restaurantName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  restaurantName: string;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" className="rounded-[2rem]">
      <ModalBody className="px-5 py-5">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: [1.08, 0.96, 1], opacity: 1 }}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive"
          >
            <AlertTriangle className="h-7 w-7" />
          </motion.div>
          <Heading level={4}>Cancel this booking?</Heading>
          <Text className="mx-auto mt-2 max-w-xs text-[0.875rem] leading-relaxed text-muted-foreground">
            We will release your seat at <span className="text-foreground" style={{ fontWeight: 800 }}>{restaurantName}</span>.
          </Text>
          <div className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-warning">
            <Clock className="h-3.5 w-3.5" />
            <Text className="text-[0.75rem] text-warning" style={{ fontWeight: 800 }}>
              This cannot be undone
            </Text>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="px-5">
        <Button variant="outline" onClick={onClose} radius="full" className="flex-1 font-bold">Keep it</Button>
        <Button variant="destructive" onClick={onConfirm} radius="full" className="flex-1 font-bold">Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
