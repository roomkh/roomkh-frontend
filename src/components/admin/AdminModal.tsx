import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { ReactNode } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'success';
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
  icon,
  children,
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} size="sm" footer={
      <div className="flex items-center justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={handleConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    }>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      {children}
      <p className="text-sm text-slate-600 text-center">{description || 'Are you sure you want to proceed?'}</p>
    </Modal>
  );
}
