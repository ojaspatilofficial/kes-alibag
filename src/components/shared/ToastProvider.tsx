import React, { useState, useCallback } from 'react';
import { ToastContext, type ToastType } from './toast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role={toast.type === 'error' ? 'alert' : 'status'}
              className={`animate-toast-in pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-white/95 border-emerald-200 text-slate-800'
                  : toast.type === 'error'
                  ? 'bg-white/95 border-rose-200 text-slate-800'
                  : 'bg-white/95 border-blue-200 text-slate-800'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="text-emerald-600" size={20} />}
                {toast.type === 'error' && <AlertCircle className="text-rose-600" size={20} />}
                {toast.type === 'info' && <Info className="text-blue-600" size={20} />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{toast.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          ))}
      </div>
    </ToastContext.Provider>
  );
};
