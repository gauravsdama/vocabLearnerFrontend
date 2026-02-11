import React from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import Card from "./Card";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  const content = (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <Card className="modal-card">
          <div className="modal-header">
            {title ? <h2 className="ds-h2">{title}</h2> : <span />}
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="modal-body">{children}</div>
        </Card>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
