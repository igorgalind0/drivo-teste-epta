'use client';

import { useEffect, useRef } from 'react';
import { Button } from './button';
import { Icon } from './icon';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  loading,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        if (!loading) onCancel();
      }}
      aria-labelledby="confirm-title"
      className="m-auto w-[min(360px,calc(100vw-32px))] rounded-2xl bg-surface p-6 text-center text-text-primary backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-danger/15 text-danger">
        <Icon name="warning" size={22} />
      </div>
      <h2 id="confirm-title" className="text-headline">
        {title}
      </h2>
      <div className="mt-2 text-callout text-text-secondary">{description}</div>
      {error && (
        <p role="alert" className="mt-3 text-footnote text-danger">
          {error}
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}