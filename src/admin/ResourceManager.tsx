import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, ExternalLink, Loader2, Inbox, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { clearContentCache } from '../lib/content';
import { useToast } from '../components/shared/toast';
import FieldInput from './FieldInput';
import { Modal, ConfirmDelete, Spinner } from './ui';
import type { Item, Section } from './sections';
import { cn } from '../lib/cn';

/** Generic list + add/edit/delete screen, driven by a Section description (same as the school site). */
const ResourceManager: React.FC<{ section: Section }> = ({ section }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [editing, setEditing] = useState<Item | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  const [toDelete, setToDelete] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Loads (or silently reloads) the list. `loading` starts true, so the first load shows the spinner.
  const load = useCallback(async () => {
    try {
      setItems(await api.get<Item[]>(`/content/${section.key}`));
    } catch (err) {
      showToast('Could not load', err instanceof Error ? err.message : 'Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  }, [section.key, showToast]);

  // Each section gets a fresh component (keyed by section), so search and filter start empty.
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter && section.filter && String(i[section.filter.field]) !== filter) return false;
      if (!q) return true;
      return [section.display.title(i), section.display.subtitle?.(i) || ''].join(' ').toLowerCase().includes(q);
    });
  }, [items, query, filter, section]);

  const openNew = () => {
    const d = section.defaults();
    if (filter && section.filter) d[section.filter.field] = filter;
    setEditing(d);
    setMissing([]);
    setFormKey((k) => k + 1);
  };

  const openEdit = (item: Item) => {
    setEditing({ ...item });
    setMissing([]);
    setFormKey((k) => k + 1);
  };

  const save = async () => {
    if (!editing) return;
    const current = section.prepare ? section.prepare(editing) : editing;
    const empty = section.fields.filter((f) => f.required && (current[f.name] === undefined || current[f.name] === '' || current[f.name] === null));
    if (empty.length) {
      setMissing(empty.map((f) => f.name));
      showToast('Please fill in the required boxes', empty.map((f) => f.label).join(', '), 'error');
      return;
    }
    setSaving(true);
    try {
      if (current.id) {
        await api.put(`/content/${section.key}/${current.id}`, current);
        showToast('Saved', `The ${section.singular} has been updated on the website.`, 'success');
      } else {
        await api.post(`/content/${section.key}`, current);
        showToast('Added', `The new ${section.singular} is now on the website.`, 'success');
      }
      clearContentCache();
      setEditing(null);
      load();
    } catch (err) {
      showToast('Could not save', err instanceof Error ? err.message : 'Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    setDeleting(true);
    try {
      await api.delete(`/content/${section.key}/${toDelete.id}`);
      showToast('Deleted', `The ${section.singular} was removed from the website.`, 'success');
      clearContentCache();
      setItems((list) => list.filter((i) => i.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      showToast('Could not delete', err instanceof Error ? err.message : 'Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const Icon = section.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-700 text-gold-300 flex items-center justify-center shrink-0">
            <Icon size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary-900">{section.label}</h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{section.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <a
            href={section.publicPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-primary-300"
          >
            <ExternalLink size={16} /> See on website
          </a>
          <button onClick={openNew} className="btn-primary !rounded-xl !py-3">
            <Plus size={18} /> Add new {section.singular}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        {items.length > 5 && (
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${section.label.toLowerCase()}…`} className="form-input !pl-11 !rounded-full" />
          </div>
        )}
        {section.filter && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setFilter('')} className={cn('chip', !filter ? 'chip-active' : 'chip-idle')}>
              All
            </button>
            {section.filter.options.map((o) => (
              <button key={o.value} onClick={() => setFilter(o.value)} className={cn('chip', filter === o.value ? 'chip-active' : 'chip-idle')}>
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <Inbox className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold text-slate-700">{query || filter ? 'Nothing matches.' : 'Nothing here yet.'}</p>
          {!query && (
            <button onClick={openNew} className="btn-primary !rounded-xl mt-5">
              <Plus size={18} /> Add the first {section.singular}
            </button>
          )}
        </div>
      ) : section.grid ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="aspect-[4/3] bg-slate-100">
                {section.display.image?.(item) && <img src={section.display.image(item)} alt="" loading="lazy" className="w-full h-full object-cover" />}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-800 line-clamp-1">{section.display.title(item)}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{section.display.subtitle?.(item)}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(item)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-primary-800 bg-primary-50 hover:bg-primary-100">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => setToDelete(item)} className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-red-700 bg-red-50 hover:bg-red-100" aria-label="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {filtered.map((item) => {
            const image = section.display.image?.(item);
            const badges = section.display.badges?.(item) || [];
            const warning = section.display.warning?.(item);
            return (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-brand-light/70">
                {section.display.image && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    {image && <img src={image} alt="" loading="lazy" className="w-full h-full object-cover object-top" />}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900 line-clamp-1">{section.display.title(item)}</p>
                    {badges.map((b) => (
                      <span key={b} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">
                        {b}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{section.display.subtitle?.(item)}</p>
                  {warning && (
                    <p className="text-xs font-semibold text-amber-700 mt-1 inline-flex items-center gap-1">
                      <AlertCircle size={13} /> {warning}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold text-primary-800 bg-primary-50 hover:bg-primary-100">
                    <Pencil size={15} /> <span className="hidden sm:inline">{warning ? 'Upload' : 'Edit'}</span>
                  </button>
                  <button onClick={() => setToDelete(item)} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100" aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && items.length > 0 && (
        <p className="text-xs text-slate-500">
          Showing {filtered.length} of {items.length}
        </p>
      )}

      <Modal
        open={!!editing}
        wide
        title={editing?.id ? `Edit ${section.singular}` : `Add a new ${section.singular}`}
        onClose={() => !saving && setEditing(null)}
        footer={
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button onClick={() => setEditing(null)} className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={save} disabled={saving} className="btn-primary !rounded-xl !py-3 disabled:opacity-60">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editing?.id ? 'Save changes' : `Add ${section.singular}`}
            </button>
          </div>
        }
      >
        {editing && (
          <div key={formKey} className="grid sm:grid-cols-2 gap-5">
            {section.fields.map((field) => (
              <div key={field.name} className={field.half ? '' : 'sm:col-span-2'}>
                <FieldInput
                  field={field}
                  item={editing}
                  error={missing.includes(field.name)}
                  onChange={(patch) => {
                    setEditing((cur) => (cur ? { ...cur, ...patch } : cur));
                    setMissing((m) => m.filter((n) => !(n in patch)));
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDelete open={!!toDelete} name={toDelete ? section.display.title(toDelete) : ''} busy={deleting} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  );
};

export default ResourceManager;
