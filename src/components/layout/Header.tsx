import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Loaded only when someone opens search (keeps the first page load small).
const SearchModal = lazy(() => import('../shared/SearchModal'));
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Mail, Menu, Phone, Search, Download, Building2 } from 'lucide-react';
import Emblem from '../../brand/Emblem';

import MobileDrawer from './MobileDrawer';
import { CategoryIcon } from '../shared/InstitutionBits';
import { categories } from '../../data/categories';
import { identity } from '../../data/site';
import { useInstitutions, useSettings } from '../../lib/content';
import { useI18n } from '../../i18n';
import type { TKey } from '../../i18n/en';
import { aboutLinks, publicationLinks } from '../../data/nav';
import LanguageToggle from './LanguageToggle';
import { cn } from '../../lib/cn';

/** Dropdown that opens on hover (desktop) and on click / keyboard. */
const NavDropdown: React.FC<{ label: string; active: boolean; children: (close: () => void) => React.ReactNode; panelClass?: string }> = ({
  label,
  active,
  children,
  panelClass,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const timer = useRef<number | undefined>(undefined);
  // Close when the page changes (adjusting state during render, as React recommends).
  const where = location.pathname + location.search;
  const [lastWhere, setLastWhere] = useState(where);
  if (where !== lastWhere) {
    setLastWhere(where);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        window.clearTimeout(timer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timer.current = window.setTimeout(() => setOpen(false), 120);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          ref.current?.querySelector('button')?.focus();
        }
      }}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'px-3 py-2 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors',
          active ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-700 hover:text-primary-700 hover:bg-primary-50/60'
        )}
      >
        {label}
        <ChevronDown size={14} className={cn('transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div className={cn('absolute top-full pt-2 z-50', panelClass || 'left-0 w-80')}>
          <div className="bg-white rounded-2xl shadow-2xl p-3 border border-primary-100">{children(() => setOpen(false))}</div>
        </div>
      )}
    </div>
  );
};

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'px-3 py-2 min-h-[44px] inline-flex items-center rounded-full text-sm font-medium whitespace-nowrap transition-colors',
    isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-700 hover:text-primary-700 hover:bg-primary-50/60'
  );

const Header: React.FC = () => {
  const { t } = useI18n();
  const settings = useSettings();
  const institutions = useInstitutions();
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 24);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [megaQuery, setMegaQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const i of institutions) c[i.category] = (c[i.category] || 0) + 1;
    return c;
  }, [institutions]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const path = location.pathname;
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setDrawer(false);
  }
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const closeSearch = useCallback(() => setSearch(false), []);
  const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '').replace(/^0/, '+91')}`;

  return (
    <>
      {/* Utility bar */}
      <div className="bg-primary-900 text-primary-100 text-xs">
        <div className="container-custom flex items-center justify-between gap-3 min-h-[40px]">
          <div className="flex items-center gap-4 min-w-0">
            <a href={tel(settings.phone)} className="inline-flex items-center gap-1.5 hover:text-white min-h-[44px]">
              <Phone size={13} className="text-gold-400" aria-hidden />
              <span>{settings.phone}</span>
            </a>
            <a href={`mailto:${settings.email}`} className="hidden sm:inline-flex items-center gap-1.5 hover:text-white min-h-[44px]">
              <Mail size={13} className="text-gold-400" aria-hidden />
              {settings.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/downloads" className="hidden md:inline-flex items-center gap-1.5 hover:text-white min-h-[44px]">
              <Download size={13} className="text-gold-400" aria-hidden /> {t('util.downloads')}
            </Link>
            <LanguageToggle dark />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <header
        className={cn(
          'sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-all duration-300',
          scrolled ? 'border-primary-100 shadow-md py-1.5' : 'border-transparent shadow-sm py-3'
        )}
      >
        <div className="container-custom flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <Emblem
              src="/images/brand/kes-emblem"
              alt=""
              sizes="56px"
              priority
              className={cn('transition-all duration-300 group-hover:scale-105', scrolled ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14')}
            />
            <span className="min-w-0">
              <span className="block text-[15px] sm:text-lg md:text-xl font-serif font-bold text-primary-800 leading-tight sm:whitespace-nowrap">
                {identity.name}
              </span>
              <span className="block text-[11px] font-bold text-gold-700 tracking-[0.16em] uppercase whitespace-nowrap">{t('header.place')}</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
            <NavDropdown label={t('nav.about')} active={path.startsWith('/about')}>
              {() => (
                <ul className="grid gap-1">
                  {[{ key: 'nav.aboutKes' as TKey, to: '/about', desc: 'desc.history' as TKey }, ...aboutLinks].map((l, i) => (
                    <li key={l.to}>
                      <Link to={l.to} className={cn('block p-3 rounded-xl hover:bg-gold-50', path === l.to && 'bg-primary-50 text-primary-700')}>
                        <span className="block text-sm font-semibold text-slate-800">{t(l.key)}</span>
                        {i > 0 && <span className="block text-xs text-slate-600">{t(l.desc)}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </NavDropdown>

            <NavDropdown label={t('nav.institutions')} active={path.startsWith('/institutions')} panelClass="-left-40 w-[40rem]">
              {() => (
                <div>
                  <form
                    role="search"
                    onSubmit={(e) => {
                      e.preventDefault();
                      navigate(`/institutions${megaQuery.trim() ? `?q=${encodeURIComponent(megaQuery.trim())}` : ''}`);
                      setMegaQuery('');
                    }}
                    className="relative mb-3"
                  >
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
                    <input
                      value={megaQuery}
                      onChange={(e) => setMegaQuery(e.target.value)}
                      placeholder={t('finder.placeholder')}
                      aria-label={t('finder.placeholder')}
                      className="form-input !pl-10 !rounded-full"
                    />
                  </form>
                  <ul className="grid grid-cols-2 gap-1">
                    {categories.map((c) => (
                      <li key={c.key}>
                        <Link to={`/institutions/${c.key}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gold-50">
                          <CategoryIcon category={c.key} className="w-10 h-10 rounded-xl" size={18} />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-slate-800 leading-snug">{c.label}</span>
                            <span className="block text-xs text-slate-600">
                              {counts[c.key] || 0} {t('common.institutions')}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link to="/institutions" className="mt-2 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary-50 text-primary-800 text-sm font-semibold hover:bg-primary-100">
                    <Building2 size={16} aria-hidden /> {t('nav.allInstitutions')} ({institutions.length})
                  </Link>
                </div>
              )}
            </NavDropdown>

            <NavLink to="/results" className={navClass}>
              {t('nav.results')}
            </NavLink>

            <NavDropdown label={t('nav.publications')} active={['/vikas-magazine', '/competition'].includes(path)}>
              {() => (
                <ul className="grid gap-1">
                  {publicationLinks.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="block p-3 rounded-xl hover:bg-gold-50">
                        <span className="block text-sm font-semibold text-slate-800">{t(l.key)}</span>
                        <span className="block text-xs text-slate-600">{t(l.desc)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </NavDropdown>

            <NavLink to="/gallery" className={navClass}>
              {t('nav.gallery')}
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              {t('nav.contact')}
            </NavLink>

            <button
              onClick={() => setSearch(true)}
              className="ml-1 w-11 h-11 inline-flex items-center justify-center rounded-full text-slate-700 hover:text-primary-700 hover:bg-primary-50 border border-slate-200"
              title={`${t('header.searchHint')} (Ctrl+K)`}
              aria-label={t('header.search')}
            >
              <Search size={18} />
            </button>
            <Link to="/institutions" className="btn-primary !py-2.5 !px-5 ml-1.5 whitespace-nowrap">
              {t('nav.find')}
            </Link>
          </nav>

          <div className="flex items-center gap-0.5 xl:hidden shrink-0">
            <button onClick={() => setSearch(true)} className="w-11 h-11 inline-flex items-center justify-center rounded-full text-slate-700 hover:bg-primary-50" aria-label={t('header.search')}>
              <Search size={21} />
            </button>
            <button
              onClick={() => setDrawer(true)}
              className="w-11 h-11 inline-flex items-center justify-center rounded-full text-slate-800 hover:bg-primary-50"
              aria-label={t('header.menu')}
              aria-expanded={drawer}
              aria-controls="mobile-drawer"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawer} onClose={closeDrawer} counts={counts} />
      {search && (
        <Suspense fallback={null}>
          <SearchModal isOpen onClose={closeSearch} />
        </Suspense>
      )}
    </>
  );
};

export default Header;
