import React, { useEffect, useState } from 'react';
import { KeyRound, Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../components/shared/toast';
import FieldInput from './FieldInput';
import { Spinner } from './ui';
import type { Field, Item } from './sections';

const groups: { title: string; description: string; fields: Field[] }[] = [
  {
    title: 'Head office contact details',
    description: 'Shown in the header, footer, Contact and Administrative Office pages. Empty fields are hidden.',
    fields: [
      { name: 'head_office', label: 'Office name', type: 'text' },
      { name: 'street_address', label: 'Street address', type: 'text', help: 'Not yet known — add it when confirmed.' },
      { name: 'city_line', label: 'Town, district, state, PIN', type: 'text' },
      { name: 'phone', label: 'Main phone', type: 'text', half: true },
      { name: 'phone_alt', label: 'Second phone', type: 'text', half: true },
      { name: 'email', label: 'Email', type: 'email', half: true },
      { name: 'office_hours', label: 'Office hours', type: 'text', half: true, placeholder: 'Leave empty to hide' },
      { name: 'registration', label: 'Registration numbers', type: 'text', half: true },
      { name: 'map_query', label: 'Google Maps search text', type: 'text', half: true, help: 'What the map searches for. Use the exact address once known.' },
    ],
  },
  {
    title: 'Announcement bar',
    description: 'A short message shown in a gold bar at the very top of every page. Leave empty to hide it.',
    fields: [{ name: 'announcement', label: 'Message', type: 'text' }],
  },
  {
    title: 'Extra numbers on the Home page',
    description:
      'Hidden by default. The figures below come from an older source (about 10 years old) — verify them before switching this on.',
    fields: [
      { name: 'show_extended_stats', label: 'Show these numbers on the Home page', type: 'checkbox' },
      { name: 'stat_institutions', label: 'Institutions', type: 'text', half: true },
      { name: 'stat_students', label: 'Students', type: 'text', half: true },
      { name: 'stat_staff', label: 'Staff', type: 'text', half: true },
    ],
  },
  {
    title: 'Social media',
    description: 'Links shown in the footer. Leave empty to hide.',
    fields: [
      { name: 'social_facebook', label: 'Facebook page', type: 'url', half: true, placeholder: 'https://' },
      { name: 'social_youtube', label: 'YouTube channel', type: 'url', half: true, placeholder: 'https://' },
      { name: 'social_instagram', label: 'Instagram', type: 'url', half: true, placeholder: 'https://' },
      { name: 'social_x', label: 'X (Twitter)', type: 'url', half: true, placeholder: 'https://' },
    ],
  },
];

const ChangePassword: React.FC = () => {
  const { showToast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      showToast('Passwords do not match', 'Please type the same new password in both boxes.', 'error');
      return;
    }
    setBusy(true);
    try {
      await api.post('/auth/change-password', { current_password: current, new_password: next });
      showToast('Password changed', 'Use your new password the next time you log in.', 'success');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      showToast('Could not change password', err instanceof Error ? err.message : 'Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8">
      <h2 className="text-lg font-serif font-bold text-primary-900 flex items-center gap-2">
        <KeyRound size={20} className="text-gold-600" /> Change admin password
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-5">Use at least 10 characters.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        <label>
          <span className="form-label text-sm">Current password</span>
          <input type="password" autoComplete="current-password" className="form-input" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </label>
        <label>
          <span className="form-label text-sm">New password</span>
          <input type="password" autoComplete="new-password" className="form-input" value={next} onChange={(e) => setNext(e.target.value)} minLength={10} required />
        </label>
        <label>
          <span className="form-label text-sm">Type new password again</span>
          <input type="password" autoComplete="new-password" className="form-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={10} required />
        </label>
      </div>
      <button type="submit" disabled={busy} className="btn-secondary !rounded-xl mt-5 disabled:opacity-60">
        {busy && <Loader2 size={16} className="animate-spin" />}
        Change password
      </button>
    </form>
  );
};

const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get<Item>('/settings')
      .then(setSettings)
      .catch((err) => showToast('Could not load', err.message, 'error'));
  }, [showToast]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      setSettings(await api.put<Item>('/settings', settings));
      showToast('Saved', 'The settings have been updated on the website.', 'success');
    } catch (err) {
      showToast('Could not save', err instanceof Error ? err.message : 'Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <Spinner />;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary-700 text-gold-300 flex items-center justify-center shrink-0">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary-900">Settings</h1>
          <p className="text-sm text-slate-600 mt-1">
            Details used across the whole website. Change what you need, then press <strong>Save changes</strong> at the bottom.
          </p>
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.title} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-serif font-bold text-primary-900">{group.title}</h2>
          <p className="text-sm text-slate-500 mt-1 mb-5">{group.description}</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {group.fields.map((field) => (
              <div key={field.name} className={field.half ? '' : 'sm:col-span-2'}>
                <FieldInput field={field} item={settings} onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <ChangePassword />

      <div className="fixed bottom-0 right-0 left-0 lg:left-72 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-end gap-3">
        <span className="hidden sm:inline text-sm text-slate-500">Changes appear on the website as soon as you save.</span>
        <button onClick={save} disabled={saving} className="btn-primary !rounded-xl !py-3 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
