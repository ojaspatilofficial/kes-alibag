import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import Emblem from '../../brand/Emblem';
import { categories } from '../../data/categories';
import { identity } from '../../data/site';
import { useI18n } from '../../i18n';
import { aboutLinks, publicationLinks } from '../../data/nav';
import LanguageToggle from './LanguageToggle';
import { cn } from '../../lib/cn';

const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 px-1 text-lg font-semibold text-slate-900 min-h-[52px]"
      >
        {title}
        <ChevronDown size={20} className={cn('transition-transform text-primary-700', open && 'rotate-180')} aria-hidden />
      </button>
      {open && <div className="pb-4 grid gap-1">{children}</div>}
    </div>
  );
};

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn('block px-3 py-3 rounded-xl text-base min-h-[44px]', isActive ? 'bg-primary-50 text-primary-800 font-semibold' : 'text-slate-700 hover:bg-slate-50');

/** Full-screen mobile menu with accordion groups and the institution search at the top. */
const MobileDrawer: React.FC<{ open: boolean; onClose: () => void; counts: Record<string, number> }> = ({ open, onClose, counts }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('button')?.focus());
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div id="mobile-drawer" ref={panel} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] bg-white flex flex-col xl:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-primary-100">
        <Link to="/" onClick={onClose} className="flex items-center gap-2.5 min-w-0">
          <Emblem src="/images/brand/kes-emblem" alt="" className="w-10 h-10" sizes="40px" />
          <span className="font-serif font-bold text-primary-800 leading-tight truncate">{identity.name}</span>
        </Link>
        <button onClick={onClose} className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-primary-50 text-slate-800" aria-label={t('header.close')}>
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <form
          role="search"
          className="relative my-4"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            navigate(`/institutions${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
          }}
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('finder.placeholder')}
            aria-label={t('finder.placeholder')}
            className="form-input !pl-11 !py-3 !rounded-full !text-base"
          />
        </form>

        <NavLink to="/" end className={linkCls} onClick={onClose}>
          {t('nav.home')}
        </NavLink>

        <Group title={t('nav.about')}>
          <NavLink to="/about" end className={linkCls} onClick={onClose}>
            {t('nav.aboutKes')}
          </NavLink>
          {aboutLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls} onClick={onClose}>
              {t(l.key)}
            </NavLink>
          ))}
        </Group>

        <Group title={t('nav.institutions')}>
          <NavLink to="/institutions" end className={linkCls} onClick={onClose}>
            {t('nav.allInstitutions')}
          </NavLink>
          {categories.map((c) => (
            <NavLink key={c.key} to={`/institutions/${c.key}`} className={linkCls} onClick={onClose}>
              {c.label} <span className="text-slate-500 text-sm">({counts[c.key] || 0})</span>
            </NavLink>
          ))}
        </Group>

        <Group title={t('nav.publications')}>
          {publicationLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls} onClick={onClose}>
              {t(l.key)}
            </NavLink>
          ))}
        </Group>

        <div className="grid gap-1 mt-2">
          {(
            [
              ['/results', 'nav.results'],
              ['/notices', 'nav.notices'],
              ['/downloads', 'nav.downloads'],
              ['/gallery', 'nav.gallery'],
              ['/contact', 'nav.contact'],
            ] as const
          ).map(([to, key]) => (
            <NavLink key={to} to={to} className={linkCls} onClick={onClose}>
              {t(key)}
            </NavLink>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">{t('util.language')}</span>
          <LanguageToggle />
        </div>

        <Link to="/institutions" onClick={onClose} className="btn-primary w-full mt-6 !py-3.5 !text-base">
          {t('nav.find')}
        </Link>
      </div>
    </div>
  );
};

export default MobileDrawer;
