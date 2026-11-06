// Admin dashboard — opened at /admin. Not linked from the public website.
import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation, useParams, Navigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Inbox, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import Emblem from '../brand/Emblem';
import { api, authStore } from '../lib/api';
import { sections, sectionByKey } from './sections';
import Login from './Login';
import Overview, { type Stats } from './Overview';
import ResourceManager from './ResourceManager';
import SettingsPage from './SettingsPage';
import InboxPage from './InboxPage';
import { Spinner } from './ui';

const SectionRoute: React.FC = () => {
  const { section } = useParams();
  const config = sectionByKey(section);
  if (!config) return <Navigate to="/admin" replace />;
  return <ResourceManager key={config.key} section={config} />;
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
    isActive ? 'bg-white text-primary-800 shadow-sm' : 'text-primary-100 hover:bg-white/10 hover:text-white'
  }`;

const AdminApp: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'out' | 'in'>(authStore.get() ? 'checking' : 'out');
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.title = 'Admin Dashboard – K.E.S. Alibag';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    if (status !== 'checking') return;
    api
      .get<{ username: string }>('/auth/me')
      .then((me) => {
        setUsername(me.username);
        setStatus('in');
      })
      .catch(() => {
        authStore.clear();
        setStatus('out');
      });
  }, [status]);

  useEffect(() => {
    const onExpired = () => setStatus('out');
    window.addEventListener('kes-auth-expired', onExpired);
    return () => window.removeEventListener('kes-auth-expired', onExpired);
  }, []);

  const refreshStats = useCallback(() => {
    api.get<Stats>('/admin/stats').then(setStats).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (status === 'in') refreshStats();
  }, [status, location.pathname, refreshStats]);

  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  const logout = () => {
    authStore.clear();
    setStatus('out');
  };

  if (status === 'checking') return <Spinner label="Opening dashboard…" />;
  if (status === 'out')
    return (
      <Login
        onLoggedIn={(name) => {
          setUsername(name);
          setStatus('in');
        }}
      />
    );

  const unreadTotal = stats ? Object.values(stats.unread).reduce((a, b) => a + b, 0) : 0;

  const sidebar = (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      <NavLink to="/admin" end className={linkClass}>
        <LayoutDashboard size={18} /> Home
      </NavLink>
      <NavLink to="/admin/inbox" className={linkClass}>
        <Inbox size={18} /> Enquiries
        {unreadTotal > 0 && (
          <span className="ml-auto text-[11px] font-bold min-w-[1.5rem] text-center px-1.5 py-0.5 rounded-full bg-gold-400 text-primary-950">{unreadTotal}</span>
        )}
      </NavLink>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-300/80 mt-5 mb-1 px-3.5">Website content</p>
      {sections.map((sec) => (
        <NavLink key={sec.key} to={`/admin/${sec.key}`} className={linkClass}>
          <sec.icon size={18} /> {sec.label}
        </NavLink>
      ))}
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-300/80 mt-5 mb-1 px-3.5">Society</p>
      <NavLink to="/admin/settings" className={linkClass}>
        <Settings size={18} /> Settings
      </NavLink>
    </nav>
  );

  const footerLinks = (
    <>
      <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-primary-100 hover:bg-white/10">
        <ExternalLink size={18} /> Open the website
      </a>
      <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-primary-100 hover:bg-white/10">
        <LogOut size={18} /> Log out
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-brand-light">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col bg-primary-900 text-white">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <Emblem src="/images/brand/kes-emblem" alt="" className="w-11 h-11" sizes="44px" />
          <div>
            <p className="font-serif font-bold leading-tight">K.E.S. Alibag</p>
            <p className="text-xs text-gold-300">Website Admin</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">{sidebar}</div>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">{footerLinks}</div>
      </aside>

      <header className="lg:hidden sticky top-0 z-40 bg-primary-900 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Emblem src="/images/brand/kes-emblem" alt="" className="w-9 h-9" sizes="36px" />
          <span className="font-serif font-bold">Website Admin</span>
        </div>
        <button onClick={() => setMenuOpen((v) => !v)} className="p-2 rounded-lg hover:bg-white/10" aria-label="Menu" aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      {menuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 z-40 bg-primary-900 text-white overflow-y-auto px-3 py-4">
          {sidebar}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-1">{footerLinks}</div>
        </div>
      )}

      <main className="lg:pl-72">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 md:py-10">
          <Routes>
            <Route index element={<Overview username={username} stats={stats} />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="inbox" element={<InboxPage onChanged={refreshStats} />} />
            <Route path=":section" element={<SectionRoute />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminApp;
