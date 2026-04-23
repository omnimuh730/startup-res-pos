import * as React from "react";
import { Modal as BaseModal, ModalBody, ModalFooter, ModalHeader } from "../components/Modal";

export type AlertDialogProps = React.ComponentProps<typeof BaseModal>;

export function AlertDialog(props: AlertDialogProps) {
  const { children, ...rest } = props;
  return <BaseModal open {...rest}><ModalHeader /><ModalBody>{children ?? "Dialog content"}</ModalBody><ModalFooter /></BaseModal>;
}
