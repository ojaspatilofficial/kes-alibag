import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, X, FileText, Building2, Compass, ArrowRight } from 'lucide-react';
import { useInstitutions, usePublishedDocuments } from '../../lib/content';
import { matchScore } from '../../lib/search';
import { profilePath } from './institutionStyles';
import { pages } from '../../data/pages';
import { useI18n } from '../../i18n';

interface Result {
  key: string;
  group: 'Institutions' | 'Pages' | 'Documents';
  title: string;
  sub: string;
  to: string;
  external?: boolean;
  score: number;
}

const groupIcons = { Institutions: Building2, Pages: Compass, Documents: FileText };

/** Site-wide search: institutions, pages and documents. Opens with Ctrl/⌘ + K. */
const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const institutions = useInstitutions();
  const docs = usePublishedDocuments();

  // The header mounts this modal only while it is open, so state starts fresh each time.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [isOpen]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim();
    if (!q) return [];
    const list: Result[] = [];
    for (const i of institutions) {
      const score = matchScore(q, `${i.name} ${i.town} ${i.district}`);
      if (score) list.push({ key: `i-${i.slug}`, group: 'Institutions', title: i.name, sub: `${i.town} · ${i.district}`, to: profilePath(i), score });
    }
    for (const p of pages) {
      const score = matchScore(q, `${p.title} ${p.keywords}`);
      if (score) list.push({ key: `p-${p.path}`, group: 'Pages', title: p.title, sub: p.description, to: p.path, score: score + 5 });
    }
    for (const d of docs) {
      const score = matchScore(q, `${d.title} ${d.year} ${d.type.replace('-', ' ')}`);
      if (score) list.push({ key: `d-${d.title}`, group: 'Documents', title: d.title, sub: d.file_size || 'PDF', to: d.file_url, external: true, score });
    }
    const order = { Pages: 0, Institutions: 1, Documents: 2 };
    return list
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .sort((a, b) => order[a.group] - order[b.group] || b.score - a.score);
  }, [query, institutions, docs]);

  if (!isOpen) return null;

  const changeQuery = (value: string) => {
    setQuery(value);
    setActive(0);
  };

  const go = (r: Result) => {
    onClose();
    if (r.external) window.open(r.to, '_blank', 'noopener');
    else navigate(r.to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active] && document.activeElement === inputRef.current) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('input, button, [href]');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-3 pt-[8vh]" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div
        ref={dialogRef}
        initial={reduce ? false : { opacity: 0, y: -14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        role="dialog"
        aria-modal="true"
        aria-label={t('header.searchHint')}
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-primary-100 overflow-hidden flex flex-col max-h-[82vh]"
      >
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="text-slate-500 shrink-0 ml-2" size={22} aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder={t('header.searchHint') + '…'}
            aria-label={t('header.searchHint')}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${results[active].key}` : undefined}
            className="w-full bg-transparent border-none text-slate-800 placeholder:text-slate-500 text-base md:text-lg focus:outline-none min-h-[44px]"
          />
          <button onClick={onClose} aria-label="Close search" className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800">
            <X size={20} />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto" id="search-results" role="listbox" aria-label="Search results">
          {!query && (
            <div className="text-center py-8 px-4">
              <p className="text-sm font-medium text-slate-600 mb-3">Try a school name or a town</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Roha', 'Panvel', 'Mahad', 'Homoeopathic', 'Junior College', 'Board of Directors'].map((s) => (
                  <button key={s} onClick={() => changeQuery(s)} className="chip chip-idle">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <p className="font-semibold text-slate-800">No matches for “{query}”</p>
              <p className="text-sm mt-1">Check the spelling, or browse all institutions.</p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/institutions');
                }}
                className="btn-secondary mt-5"
              >
                {t('nav.allInstitutions')}
              </button>
            </div>
          )}

          {results.map((r, idx) => {
            const showGroup = idx === 0 || results[idx - 1].group !== r.group;
            const Icon = groupIcons[r.group];
            return (
              <React.Fragment key={r.key}>
                {showGroup && (
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-3 mb-2 px-2 flex items-center gap-1.5">
                    <Icon size={14} aria-hidden /> {r.group}
                  </p>
                )}
                <button
                  id={`sr-${r.key}`}
                  role="option"
                  aria-selected={idx === active}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => go(r)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 border transition-colors ${
                    idx === active ? 'bg-primary-50 border-primary-200' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-900 text-sm leading-snug">{r.title}</span>
                    <span className="block text-xs text-slate-600 truncate">{r.sub}</span>
                  </span>
                  <ArrowRight size={15} className="text-slate-400 shrink-0" aria-hidden />
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="hidden sm:flex p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 items-center justify-between px-6">
          <span>
            <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">↑</kbd>{' '}
            <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">↓</kbd> to move ·{' '}
            <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">Enter</kbd> to open
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">Esc</kbd> to close
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchModal;
