import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Building2, FileUp, Inbox, Settings, Users } from 'lucide-react';
import { sections } from './sections';

export interface Stats {
  counts: Record<string, number>;
  unread: Record<string, number>;
  emptyDocuments: number;
}

const quickActions = [
  { to: '/admin/documents', label: 'Upload a result or magazine PDF', icon: FileUp },
  { to: '/admin/notices', label: 'Post a notice', icon: Bell },
  { to: '/admin/institutions', label: 'Add or update an institution', icon: Building2 },
  { to: '/admin/boardMembers', label: 'Update the Board of Directors', icon: Users },
];

const Overview: React.FC<{ username: string; stats: Stats | null }> = ({ username, stats }) => {
  const unreadTotal = stats ? Object.values(stats.unread).reduce((a, b) => a + b, 0) : 0;
  const [hour] = useState(() => new Date().getHours());
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-primary-700 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-gold-400/20" aria-hidden />
        <p className="relative text-gold-300 text-sm font-semibold">{greeting},</p>
        <h1 className="relative text-2xl md:text-3xl font-serif font-bold mt-1">K.E.S. website dashboard</h1>
        <p className="relative text-primary-100 text-sm mt-2 max-w-2xl">
          Everything you change here appears on the website straight away. You are signed in as <strong className="text-white">{username}</strong>.
        </p>
      </div>

      {unreadTotal > 0 && (
        <Link to="/admin/inbox" className="flex items-center justify-between gap-4 p-5 rounded-3xl bg-gold-50 border-2 border-gold-300 hover:bg-gold-100 transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-400 text-primary-950 flex items-center justify-center">
              <Inbox size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                You have {unreadTotal} new {unreadTotal === 1 ? 'enquiry' : 'enquiries'}
              </p>
              <p className="text-sm text-slate-600">Sent through the Contact page.</p>
            </div>
          </div>
          <ArrowRight className="text-gold-700" />
        </Link>
      )}

      {stats && stats.emptyDocuments > 0 && (
        <Link to="/admin/documents" className="flex items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-amber-200 hover:border-amber-400 transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileUp size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{stats.emptyDocuments} document slots are waiting for a file</p>
              <p className="text-sm text-slate-600">Results, magazines and forms without a file are hidden from the website.</p>
            </div>
          </div>
          <ArrowRight className="text-amber-700" />
        </Link>
      )}

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Common tasks</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-card transition flex flex-col gap-4 group">
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center group-hover:bg-primary-700 group-hover:text-white transition">
                <a.icon size={20} />
              </div>
              <span className="font-semibold text-slate-800 flex items-center justify-between gap-2">
                {a.label} <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-700" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">What is on the website now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sections.map((sec) => (
            <Link key={sec.key} to={`/admin/${sec.key}`} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary-300 transition">
              <sec.icon size={18} className="text-gold-600" />
              <p className="text-2xl font-bold text-primary-900 mt-2">{stats ? (stats.counts[sec.key] ?? 0) : '–'}</p>
              <p className="text-xs text-slate-600 leading-snug">{sec.label}</p>
            </Link>
          ))}
          <Link to="/admin/settings" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary-300 transition">
            <Settings size={18} className="text-gold-600" />
            <p className="text-sm font-semibold text-primary-900 mt-2">Settings</p>
            <p className="text-xs text-slate-600 leading-snug">Contact details, numbers, social links</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
