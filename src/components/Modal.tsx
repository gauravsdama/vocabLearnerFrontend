import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import Card from "./Card";

type ModalProps = {
  open: boolean;
  title?: string;
  closeLabel?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  open,
  title,
  closeLabel = "Close",
  onClose,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    focusable()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const content = (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Dialog"}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <Card className="modal-card">
          <div className="modal-header">
            {title ? <h2 id={titleId} className="ds-h2">{title}</h2> : <span />}
            <Button variant="ghost" onClick={onClose}>
              {closeLabel}
            </Button>
          </div>
          <div className="modal-body">{children}</div>
        </Card>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
