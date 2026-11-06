import React, { useRef, useState } from 'react';
import { useUploadLimit } from './uploadLimit';
import { Upload, X, FileText, Loader2, ImagePlus } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../components/shared/toast';
import { imageUrl } from '../brand/images';
import type { Field, Item } from './sections';

interface UploadResult {
  url: string;
  name: string;
  size: string;
  type: string;
}

const UploadButton: React.FC<{ accept: string; label: string; onUploaded: (result: UploadResult) => void; icon?: React.ReactNode }> = ({
  accept,
  label,
  onUploaded,
  icon,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();
  const maxMb = useUploadLimit();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (maxMb && file.size > maxMb * 1024 * 1024) {
      showToast('File too big', `Please keep files under ${maxMb} MB. Compress the PDF or photo and try again.`, 'error');
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.append('file', file);
      onUploaded(await api.post<UploadResult>('/upload', body));
    } catch (err) {
      showToast('Upload failed', err instanceof Error ? err.message : 'Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onChange} />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl font-semibold border-2 border-dashed border-primary-300 text-primary-700 bg-primary-50/50 hover:bg-primary-50 hover:border-primary-500 transition disabled:opacity-60 px-4 py-2.5 text-sm"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : icon || <Upload size={16} />}
        {busy ? 'Uploading…' : label}
      </button>
    </>
  );
};

const LimitNote: React.FC<{ kind: string }> = ({ kind }) => {
  const mb = useUploadLimit();
  return (
    <p className="text-xs text-slate-500">
      {kind}, up to {mb ?? 4} MB{mb === 4 ? ' (the limit on the live website)' : ''}.
    </p>
  );
};

interface FieldInputProps {
  field: Field;
  item: Item;
  onChange: (patch: Item) => void;
  error?: boolean;
}

const FieldInput: React.FC<FieldInputProps> = ({ field, item, onChange, error }) => {
  const value = item[field.name];
  const set = (v: unknown) => onChange({ [field.name]: v });
  const errorRing = error ? ' !border-red-400 ring-2 ring-red-100' : '';
  const id = `f-${field.name}`;

  const label = (
    <span className="form-label text-sm">
      {field.label}
      {field.required && <span className="text-red-600"> *</span>}
    </span>
  );
  const help = field.help && <span className="block text-xs text-slate-500 mt-1.5">{field.help}</span>;

  switch (field.type) {
    case 'checkbox':
      return (
        <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-primary-300 h-full">
          <input type="checkbox" className="w-5 h-5 accent-primary-700 shrink-0" checked={!!value} onChange={(e) => set(e.target.checked)} />
          <span className="text-sm font-medium text-slate-700">{field.label}</span>
        </label>
      );

    case 'textarea':
      return (
        <label className="block" htmlFor={id}>
          {label}
          <textarea id={id} rows={4} className={`form-input${errorRing}`} placeholder={field.placeholder} value={(value as string) ?? ''} onChange={(e) => set(e.target.value)} />
          {help}
        </label>
      );

    case 'select':
      return (
        <label className="block" htmlFor={id}>
          {label}
          <select id={id} className={`form-input${errorRing}`} value={(value as string) ?? ''} onChange={(e) => set(e.target.value)}>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {help}
        </label>
      );

    case 'number':
      return (
        <label className="block" htmlFor={id}>
          {label}
          <input
            id={id}
            type="number"
            className={`form-input${errorRing}`}
            value={value === undefined || value === null ? '' : String(value)}
            onChange={(e) => set(e.target.value === '' ? '' : Number(e.target.value))}
          />
          {help}
        </label>
      );

    case 'image': {
      const url = (value as string) || '';
      return (
        <div>
          {label}
          <div className={`flex items-center gap-4 p-4 rounded-2xl border bg-white ${error ? 'border-red-400' : 'border-slate-200'}`}>
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
              {url ? <img src={imageUrl(url, 192)} alt="" className="w-full h-full object-cover object-top" /> : <ImagePlus className="text-slate-300" size={28} />}
            </div>
            <div className="space-y-2">
              <UploadButton accept="image/jpeg,image/png,image/webp" label={url ? 'Change photo' : 'Upload photo'} onUploaded={(r) => set(r.url)} />
              {url && (
                <button type="button" onClick={() => set('')} className="flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline">
                  <X size={13} /> Remove photo
                </button>
              )}
              <LimitNote kind="JPG, PNG or WebP" />
            </div>
          </div>
          {help}
        </div>
      );
    }

    case 'file': {
      const url = (value as string) || '';
      const fileName = field.fileNameField ? (item[field.fileNameField] as string) : '';
      return (
        <div>
          {label}
          <div className={`flex flex-wrap items-center gap-3 p-4 rounded-2xl border bg-white ${error ? 'border-red-400' : 'border-slate-200'}`}>
            {url ? (
              <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50 text-primary-800 text-sm font-medium max-w-full">
                <FileText size={16} className="shrink-0" />
                <span className="truncate">{fileName || url.split('/').pop()}</span>
              </a>
            ) : (
              <span className="text-sm text-slate-500">No file yet.</span>
            )}
            <UploadButton
              accept={field.accept || '.pdf'}
              label={url ? 'Replace file' : 'Choose file'}
              onUploaded={(r) => {
                const patch: Item = { [field.name]: r.url };
                if (field.fileNameField) patch[field.fileNameField] = r.name;
                if (field.fileSizeField) patch[field.fileSizeField] = r.size;
                onChange(patch);
              }}
            />
            {url && (
              <button
                type="button"
                onClick={() =>
                  onChange({
                    [field.name]: '',
                    ...(field.fileNameField ? { [field.fileNameField]: '' } : {}),
                    ...(field.fileSizeField ? { [field.fileSizeField]: '' } : {}),
                  })
                }
                className="flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
              >
                <X size={13} /> Remove file
              </button>
            )}
            <div className="w-full">
              <LimitNote kind="PDF, JPG, PNG or WebP" />
            </div>
          </div>
          {help}
        </div>
      );
    }

    default:
      return (
        <label className="block" htmlFor={id}>
          {label}
          <input
            id={id}
            type={field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
            className={`form-input${errorRing}`}
            placeholder={field.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => set(e.target.value)}
          />
          {help}
        </label>
      );
  }
};

export default FieldInput;
