import React from 'react';
import { Button } from './Button';
import { ShieldCheckIcon } from './icons/Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 text-primary-500 dark:text-primary-400 mx-auto flex items-center justify-center mb-5">
                {icon || <ShieldCheckIcon className="h-8 w-8" />}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {message}
            </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800/50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};