import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Modal, ModalHeader, ModalBody, ModalFooter, DatePicker } from "../ds";
import { AlertTriangle, Check, Trash2, Info } from "lucide-react";

export function ModalSection() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const close = () => setOpenModal(null);

  return (
    <SectionWrapper
      id="modal-ds"
      title="Modal"
      description="Composable dialog/modal with header, body, footer slots. Supports multiple sizes, close behaviors, and common patterns."
    >
      <ComponentCard title="Sizes">
        <div className="flex flex-wrap gap-3">
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setOpenModal(`size-${size}`)}
              className="px-4 py-2.5 border border-border rounded-lg hover:bg-secondary cursor-pointer text-[0.8125rem]"
            >
              Size: {size}
            </button>
          ))}
        </div>
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <Modal key={size} open={openModal === `size-${size}`} onClose={close} size={size}>
            <ModalHeader>Modal — size="{size}"</ModalHeader>
            <ModalBody>
              <p className="text-[0.875rem] text-muted-foreground">
                This modal uses the <code className="px-1 py-0.5 bg-muted rounded text-[0.8125rem] font-mono">{size}</code> size variant.
                The width adjusts automatically based on the preset.
              </p>
            </ModalBody>
            <ModalFooter>
              <button onClick={close} className="px-4 py-2 text-[0.875rem] border border-border rounded-lg hover:bg-secondary cursor-pointer">Cancel</button>
              <button onClick={close} className="px-4 py-2 text-[0.875rem] bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer">Confirm</button>
            </ModalFooter>
          </Modal>
        ))}
      </ComponentCard>

      <ComponentCard title="Confirmation Dialog">
        <button
          onClick={() => setOpenModal("confirm")}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer text-[0.875rem]"
        >
          Open Confirmation
        </button>
        <Modal open={openModal === "confirm"} onClose={close} size="sm">
          <ModalBody className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-[1.0625rem] mb-2">Are you sure?</h3>
            <p className="text-[0.875rem] text-muted-foreground">
              This action cannot be undone. All associated data will be permanently removed.
            </p>
          </ModalBody>
          <ModalFooter className="justify-center">
            <button onClick={close} className="px-5 py-2 text-[0.875rem] border border-border rounded-lg hover:bg-secondary cursor-pointer">Cancel</button>
            <button onClick={close} className="px-5 py-2 text-[0.875rem] bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 cursor-pointer">Delete</button>
          </ModalFooter>
        </Modal>
      </ComponentCard>

      <ComponentCard title="Success Modal">
        <button
          onClick={() => setOpenModal("success")}
          className="px-4 py-2.5 bg-success text-success-foreground rounded-lg hover:opacity-90 cursor-pointer text-[0.875rem]"
        >
          Open Success
        </button>
        <Modal open={openModal === "success"} onClose={close} size="sm">
          <ModalBody className="pt-6 text-center">
            <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-success" />
            </div>
            <h3 className="text-[1.125rem] mb-2">Payment Successful!</h3>
            <p className="text-[0.875rem] text-muted-foreground">
              Your payment of $49.99 has been processed. A confirmation email has been sent.
            </p>
          </ModalBody>
          <ModalFooter className="justify-center border-0">
            <button onClick={close} className="px-6 py-2.5 text-[0.875rem] bg-success text-success-foreground rounded-lg hover:opacity-90 cursor-pointer">
              Continue
            </button>
          </ModalFooter>
        </Modal>
      </ComponentCard>

      <ComponentCard title="Delete Confirmation">
        <button
          onClick={() => setOpenModal("delete")}
          className="px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 cursor-pointer text-[0.875rem]"
        >
          Delete Item
        </button>
        <Modal open={openModal === "delete"} onClose={close} size="sm">
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-[1rem]">Delete Project</h3>
                <p className="text-[0.8125rem] text-muted-foreground">This will remove all data</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-[0.875rem] text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">"My Project"</strong>?
              All files, settings, and team assignments will be permanently removed.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <p className="text-[0.8125rem] text-destructive">
                ⚠ This action is irreversible
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={close} className="px-4 py-2 text-[0.875rem] border border-border rounded-lg hover:bg-secondary cursor-pointer">Keep Project</button>
            <button onClick={close} className="px-4 py-2 text-[0.875rem] bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 cursor-pointer">Delete Forever</button>
          </ModalFooter>
        </Modal>
      </ComponentCard>

      <ComponentCard title="Form Modal">
        <button
          onClick={() => setOpenModal("form")}
          className="px-4 py-2.5 border border-border rounded-lg hover:bg-secondary cursor-pointer text-[0.875rem]"
        >
          Open Form Modal
        </button>
        <Modal open={openModal === "form"} onClose={close} size="md">
          <ModalHeader>Create New Task</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="text-[0.8125rem] block mb-1">Title</label>
                <input type="text" placeholder="Task title..." className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="text-[0.8125rem] block mb-1">Description</label>
                <textarea rows={3} placeholder="Describe the task..." className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.8125rem] block mb-1">Priority</label>
                  <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background outline-none cursor-pointer">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <DatePicker
                    label="Due Date"
                    value={dueDate}
                    onChange={setDueDate}
                    placeholder="Select date"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={close} className="px-4 py-2 text-[0.875rem] border border-border rounded-lg hover:bg-secondary cursor-pointer">Cancel</button>
            <button onClick={close} className="px-4 py-2 text-[0.875rem] bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer">Create Task</button>
          </ModalFooter>
        </Modal>
      </ComponentCard>

      <ComponentCard title="Close Behavior">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setOpenModal("no-overlay-close")}
            className="px-4 py-2.5 border border-border rounded-lg hover:bg-secondary cursor-pointer text-[0.8125rem]"
          >
            No Overlay Close
          </button>
          <button
            onClick={() => setOpenModal("no-close-btn")}
            className="px-4 py-2.5 border border-border rounded-lg hover:bg-secondary cursor-pointer text-[0.8125rem]"
          >
            No Close Button
          </button>
        </div>
        <Modal open={openModal === "no-overlay-close"} onClose={close} closeOnOverlay={false} size="sm">
          <ModalHeader>Overlay click disabled</ModalHeader>
          <ModalBody>
            <p className="text-[0.875rem] text-muted-foreground">
              You can only close this via the X button or Escape key.
            </p>
          </ModalBody>
          <ModalFooter>
            <button onClick={close} className="px-4 py-2 text-[0.875rem] bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer">Got it</button>
          </ModalFooter>
        </Modal>
        <Modal open={openModal === "no-close-btn"} onClose={close} showCloseButton={false} size="sm">
          <ModalHeader>No X Button</ModalHeader>
          <ModalBody>
            <p className="text-[0.875rem] text-muted-foreground">
              Close button is hidden. Click overlay or press Escape.
            </p>
          </ModalBody>
          <ModalFooter>
            <button onClick={close} className="px-4 py-2 text-[0.875rem] bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer">Close</button>
          </ModalFooter>
        </Modal>
      </ComponentCard>
    </SectionWrapper>
  );
}
