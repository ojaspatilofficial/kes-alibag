import React, { useEffect } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

/** Simple pop-up window used for forms and confirmations. */
export const Modal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}> = ({ open, title, onClose, children, footer, wide }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-primary-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} sm:rounded-3xl shadow-2xl flex flex-col max-h-screen sm:max-h-[90vh]`}>
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-serif font-bold text-primary-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 sm:rounded-b-3xl">{footer}</div>}
      </div>
    </div>
  );
};

/** "Are you sure?" pop-up before deleting something. */
export const ConfirmDelete: React.FC<{ open: boolean; name: string; busy?: boolean; onCancel: () => void; onConfirm: () => void }> = ({
  open,
  name,
  busy,
  onCancel,
  onConfirm,
}) => (
  <Modal
    open={open}
    title="Delete this item?"
    onClose={onCancel}
    footer={
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50">
          No, keep it
        </button>
        <button
          onClick={onConfirm}
          disabled={busy}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 inline-flex items-center gap-2 disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          Yes, delete
        </button>
      </div>
    }
  >
    <div className="flex gap-4">
      <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
        <AlertTriangle size={22} />
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">
        <strong className="text-slate-900">“{name}”</strong> will be removed from the website. This cannot be undone.
      </p>
    </div>
  </Modal>
);

export const Spinner: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3" role="status">
    <Loader2 size={28} className="animate-spin text-primary-600" />
    <p className="text-sm">{label}</p>
  </div>
);
