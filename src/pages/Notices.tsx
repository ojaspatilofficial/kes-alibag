import React, { useMemo } from 'react';
import { Bell, Paperclip, Pin } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import { useContent } from '../lib/content';
import { formatDate } from '../lib/api';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';

const Notices: React.FC = () => {
  const { t } = useI18n();
  usePageMeta('Notices & Circulars', 'Society-wide notices and circulars from the Konkan Education Society head office.');
  const notices = useContent('notices');
  const list = useMemo(
    () => [...notices].sort((a, b) => Number(!!b.is_pinned) - Number(!!a.is_pinned) || b.publish_date.localeCompare(a.publish_date)),
    [notices]
  );

  return (
    <>
      <PageHero eyebrow="From the head office" title={t('nav.notices')} description="Society-wide announcements and circulars." />
      <div className="container-custom py-12 md:py-16 max-w-4xl">
        {list.length === 0 ? (
          <div className="card p-10 text-center">
            <Bell className="mx-auto text-primary-300" size={36} aria-hidden />
            <p className="font-serif text-lg font-bold text-primary-900 mt-4">There are no notices at the moment</p>
            <p className="text-slate-600 mt-1">New circulars from the head office will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {list.map((n) => (
              <li key={n.id || n.title} className={`card !rounded-2xl p-5 md:p-6 ${n.is_pinned ? 'ring-2 ring-gold-200' : ''}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {n.is_pinned && (
                    <span className="inline-flex items-center gap-1 font-bold text-gold-800 bg-gold-50 border border-gold-200 rounded-full px-2 py-0.5">
                      <Pin size={12} aria-hidden /> Pinned
                    </span>
                  )}
                  <span className="font-semibold text-primary-700 bg-primary-50 rounded-full px-2 py-0.5">{n.category}</span>
                  <time dateTime={n.publish_date} className="text-slate-600">
                    {formatDate(n.publish_date)}
                  </time>
                </div>
                <h2 className="font-serif font-bold text-lg text-primary-900 mt-2">{n.title}</h2>
                {n.description && <p className="text-slate-700 mt-2 whitespace-pre-line">{n.description}</p>}
                {n.attachment_url && (
                  <a href={n.attachment_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 link min-h-[44px]">
                    <Paperclip size={15} aria-hidden /> {n.attachment_name || 'Attachment'}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notices;
