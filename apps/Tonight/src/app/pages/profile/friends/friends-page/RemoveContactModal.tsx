import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../../components/ds/Modal";
import { Button } from "../../../../components/ds/Button";
import { Text } from "../../../../components/ds/Text";

export function RemoveContactModal({
  open,
  onClose,
  onRemove,
  onBlock,
}: {
  open: boolean;
  onClose: () => void;
  onRemove: () => void;
  onBlock: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader>Remove Contact</ModalHeader>
      <ModalBody>
        <Text className="text-[14px] leading-relaxed text-muted-foreground">
          Are you sure you want to remove this contact from your friends list? They won't be notified.
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" className="rounded-full font-semibold" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" className="rounded-full font-semibold" onClick={onRemove}>Remove</Button>
        <Button variant="outline" className="rounded-full font-semibold" onClick={onBlock}>Block</Button>
      </ModalFooter>
    </Modal>
  );
}
