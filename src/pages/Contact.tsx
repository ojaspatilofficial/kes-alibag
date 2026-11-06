import React, { useState } from 'react';
import { Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import MapEmbed from '../components/shared/MapEmbed';
import { useToast } from '../components/shared/toast';
import { identity } from '../data/site';
import { submitEnquiry, useInstitutions, useSettings } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';

const empty = { name: '', email: '', phone: '', institution: '', subject: '', message: '', website: '' };

const Contact: React.FC = () => {
  const { t } = useI18n();
  usePageMeta('Contact', 'Contact the Konkan Education Society head office at Alibag: phone (02141) 222105, email kesalibag@gmail.com, or send an enquiry.');
  const s = useSettings();
  const institutions = useInstitutions();
  const { showToast } = useToast();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value; // read now — the event target may change before the updater runs
    setForm((f) => ({ ...f, [k]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email && !form.phone) {
      showToast('How can we reply?', 'Please give an email address or a phone number.', 'error');
      return;
    }
    setBusy(true);
    try {
      await submitEnquiry(form);
      setSent(true);
      setForm(empty);
    } catch (err) {
      showToast('Could not send', err instanceof Error ? err.message : 'Please try again, or call the office.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Head office" title={t('nav.contact')} description="Questions about admissions, results or a K.E.S. institution? Write to the head office or call during office hours." />
      <div className="container-custom py-12 md:py-16 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="font-serif font-bold text-xl text-primary-900">{identity.name}</h2>
            <p className="flex gap-3 text-slate-700">
              <MapPin className="text-gold-700 shrink-0 mt-0.5" size={20} aria-hidden />
              <span>
                {s.head_office}
                {s.street_address && <>, {s.street_address}</>}
                <br />
                {s.city_line}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="text-gold-700 shrink-0 mt-0.5" size={20} aria-hidden />
              <span className="flex flex-col">
                <a className="link" href="tel:+912141222105">
                  {s.phone}
                </a>
                {s.phone_alt && (
                  <a className="link" href={`tel:${s.phone_alt.replace(/[^\d+]/g, '')}`}>
                    {s.phone_alt}
                  </a>
                )}
              </span>
            </p>
            <p className="flex gap-3">
              <Mail className="text-gold-700 shrink-0 mt-0.5" size={20} aria-hidden />
              <a className="link break-all" href={`mailto:${s.email}`}>
                {s.email}
              </a>
            </p>
            {s.office_hours && <p className="text-sm text-slate-600">Office hours: {s.office_hours}</p>}
            <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">{s.registration}</p>
          </div>
          <MapEmbed query={s.map_query} title={`Map showing ${identity.name}, ${identity.place}`} />
        </div>

        <div className="lg:col-span-3">
          {sent ? (
            <div className="card p-8 md:p-10 text-center" role="status">
              <span className="w-14 h-14 mx-auto rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                <Send size={24} aria-hidden />
              </span>
              <h2 className="font-serif font-bold text-2xl text-primary-900 mt-5">Thank you — your enquiry has been sent</h2>
              <p className="text-slate-600 mt-2">The head office will get back to you.</p>
              <button onClick={() => setSent(false)} className="btn-secondary mt-6">
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-6 md:p-8 space-y-5" noValidate={false}>
              <h2 className="font-serif font-bold text-2xl text-primary-900">{t('common.sendEnquiry')}</h2>
              <p className="text-sm text-slate-600">Fields marked * are required. Give an email address or a phone number so we can reply.</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="block sm:col-span-2">
                  <span className="form-label">Your name *</span>
                  <input className="form-input" required maxLength={100} autoComplete="name" value={form.name} onChange={set('name')} />
                </label>
                <label className="block">
                  <span className="form-label">Email</span>
                  <input type="email" className="form-input" maxLength={120} autoComplete="email" value={form.email} onChange={set('email')} />
                </label>
                <label className="block">
                  <span className="form-label">Phone</span>
                  <input type="tel" className="form-input" maxLength={20} autoComplete="tel" pattern="[0-9+()\- ]{7,20}" value={form.phone} onChange={set('phone')} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="form-label">About an institution (optional)</span>
                  <select className="form-input" value={form.institution} onChange={set('institution')}>
                    <option value="">General enquiry to the head office</option>
                    {institutions.map((i) => (
                      <option key={i.slug} value={`${i.name}, ${i.town}`}>
                        {i.name}, {i.town}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="form-label">Subject *</span>
                  <input className="form-input" required maxLength={150} value={form.subject} onChange={set('subject')} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="form-label">Message *</span>
                  <textarea className="form-input min-h-[140px]" required maxLength={3000} rows={6} value={form.message} onChange={set('message')} />
                </label>
                {/* Honeypot: hidden from people, filled in by spam bots. */}
                <label className="hidden" aria-hidden>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
                </label>
              </div>
              <button type="submit" disabled={busy} className="btn-primary !px-8 disabled:opacity-60">
                {busy ? <Loader2 size={17} className="animate-spin" aria-hidden /> : <Send size={17} aria-hidden />}
                {t('common.sendEnquiry')}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Contact;
