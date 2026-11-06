import React, { useState } from 'react';
import { Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import Emblem from '../brand/Emblem';
import { api, authStore } from '../lib/api';

const Login: React.FC<{ onLoggedIn: (username: string) => void }> = ({ onLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post<{ token: string; username: string }>('/auth/login', { username, password });
      authStore.set(res.token);
      onLoggedIn(res.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-brand-cream to-gold-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-heritage-pattern [background-size:22px_22px]" aria-hidden />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <Emblem src="/images/brand/kes-emblem" alt="K.E.S. emblem" className="w-20 h-20 mx-auto" sizes="80px" />
          <h1 className="text-2xl font-serif font-bold text-primary-900 mt-4">Website Admin</h1>
          <p className="text-sm text-slate-600">Konkan Education Society, Alibag</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl border border-primary-100 p-6 sm:p-8 space-y-5">
          <label className="block">
            <span className="form-label text-sm">Username</span>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="form-input !pl-11 !py-3" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
            </div>
          </label>
          <label className="block">
            <span className="form-label text-sm">Password</span>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input !pl-11 !pr-12 !py-3"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {error && <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full !rounded-xl !py-3.5 !text-base disabled:opacity-60">
            {busy && <Loader2 size={18} className="animate-spin" />}
            Log in
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-6">This page is only for K.E.S. staff who manage the website.</p>
      </div>
    </div>
  );
};

export default Login;
