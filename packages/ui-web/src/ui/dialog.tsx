import * as React from "react";
import { Modal as BaseModal, ModalBody, ModalFooter, ModalHeader } from "../components/Modal";

export type DialogProps = React.ComponentProps<typeof BaseModal>;

export function Dialog(props: DialogProps) {
  const { children, ...rest } = props;
  return <BaseModal open {...rest}><ModalHeader>{children ?? "Dialog"}</ModalHeader><ModalBody>{children ?? "Dialog content"}</ModalBody><ModalFooter>Footer actions</ModalFooter></BaseModal>;
}
