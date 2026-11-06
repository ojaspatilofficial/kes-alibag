import React, { useCallback, useEffect, useState } from 'react';
import { Mail, Phone, Trash2, CheckCircle2, Inbox as InboxIcon, MailOpen, Building2 } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../components/shared/toast';
import { ConfirmDelete, Spinner } from './ui';

type Enquiry = { id: string; status: string; createdAt: string; name: string; email?: string; phone?: string; institution?: string; subject: string; message: string };

const InboxPage: React.FC<{ onChanged?: () => void }> = ({ onChanged }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Enquiry | null>(null);

  // Loads (or silently reloads) the list. `loading` starts true, so the first load shows the spinner.
  const load = useCallback(async () => {
    try {
      setItems(await api.get<Enquiry[]>('/forms/enquiries'));
    } catch (err) {
      showToast('Could not load', err instanceof Error ? err.message : '', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const mark = async (item: Enquiry, status: string) => {
    await api.patch(`/forms/enquiries/${item.id}`, { status });
    setItems((list) => list.map((i) => (i.id === item.id ? { ...i, status } : i)));
    onChanged?.();
  };

  const remove = async () => {
    if (!toDelete) return;
    await api.delete(`/forms/enquiries/${toDelete.id}`);
    setItems((list) => list.filter((i) => i.id !== toDelete.id));
    setToDelete(null);
    showToast('Deleted', 'The enquiry was removed.', 'success');
    onChanged?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary-700 text-gold-300 flex items-center justify-center shrink-0">
          <InboxIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary-900">Enquiries</h1>
          <p className="text-sm text-slate-600 mt-1">Messages sent through the Contact page. New ones are highlighted.</p>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          <MailOpen className="mx-auto text-slate-300 mb-3" size={40} />
          No enquiries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isNew = item.status === 'new';
            return (
              <article key={item.id} className={`bg-white rounded-3xl border p-5 md:p-6 ${isNew ? 'border-gold-300 ring-2 ring-gold-100' : 'border-slate-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-lg">{item.subject}</h3>
                      {isNew && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">NEW</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      From <strong className="text-slate-700">{item.name}</strong> ·{' '}
                      {new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => mark(item, isNew ? 'read' : 'new')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                    >
                      <CheckCircle2 size={15} /> {isNew ? 'Mark as done' : 'Mark as new'}
                    </button>
                    <button onClick={() => setToDelete(item)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100">
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                  {item.email && (
                    <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 text-primary-700 hover:underline">
                      <Mail size={15} /> {item.email}
                    </a>
                  )}
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1.5 text-primary-700 hover:underline">
                      <Phone size={15} /> {item.phone}
                    </a>
                  )}
                  {item.institution && (
                    <span className="inline-flex items-center gap-1.5 text-slate-700">
                      <Building2 size={15} /> {item.institution}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm text-slate-700 bg-brand-light rounded-2xl p-4 whitespace-pre-line">{item.message}</p>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDelete open={!!toDelete} name={toDelete ? toDelete.subject : ''} onCancel={() => setToDelete(null)} onConfirm={remove} />
    </div>
  );
};

export default InboxPage;
