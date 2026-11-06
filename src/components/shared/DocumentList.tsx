import React from 'react';
import { Download, FileText } from 'lucide-react';
import type { DocumentItem } from '../../data/types';

/** A list of published documents with download buttons, or one friendly line when there are none. */
const DocumentList: React.FC<{ docs: DocumentItem[]; empty: string; downloadLabel?: string }> = ({ docs, empty, downloadLabel = 'Download' }) => {
  if (!docs.length) {
    return (
      <p className="flex items-center gap-3 text-slate-700 bg-white border border-dashed border-primary-200 rounded-2xl p-5">
        <FileText size={20} className="text-primary-300 shrink-0" aria-hidden /> {empty}
      </p>
    );
  }
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {docs.map((d) => (
        <li key={d.id || d.title}>
          <a
            href={d.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-primary-100 hover:border-primary-300 hover:shadow-card transition min-h-[72px]"
          >
            <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
              <FileText size={20} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-slate-900 leading-snug">{d.title}</span>
              <span className="block text-xs text-slate-600 mt-0.5">
                {[d.year, d.file_size, (d.file_url.split('.').pop() || '').toUpperCase().slice(0, 4)].filter(Boolean).join(' · ')}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 shrink-0">
              <Download size={16} aria-hidden /> <span className="hidden sm:inline">{downloadLabel}</span>
              <span className="sr-only"> {d.title} (opens in a new tab)</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default DocumentList;
