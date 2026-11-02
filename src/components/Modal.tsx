// Modal: rendered through a PORTAL into #modal-root, built as a COMPOUND component.
// Usage: <Modal open onClose={…}><Modal.Header>…</Modal.Header><Modal.Body/>…</Modal>
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  children: ReactNode;
};

function Modal({ open, onClose, titleId, children }: ModalProps) {
  if (!open) return null;
  const target = document.getElementById("modal-root") ?? document.body;
  return createPortal(
    <ModalDialog onClose={onClose} titleId={titleId}>
      {children}
    </ModalDialog>,
    target,
  );
}

function ModalDialog({ onClose, titleId, children }: Omit<ModalProps, "open">) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose); // always call the latest onClose
  useLockBodyScroll();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus(); // move focus into the dialog

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus(); // return focus to the trigger
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-200 outline-none dark:bg-zinc-900 dark:ring-zinc-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={event => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

Modal.Header = function ModalHeader({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <header className="mb-2">
      <h2 id={id} className="text-lg">
        {children}
      </h2>
    </header>
  );
};

Modal.Body = function ModalBody({ children }: { children: ReactNode }) {
  return <div className="muted text-sm">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }: { children: ReactNode }) {
  return <footer className="mt-6 flex justify-end gap-2">{children}</footer>;
};

export default Modal;
