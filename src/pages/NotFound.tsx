import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PetalRing from '../brand/PetalRing';
import Flame from '../brand/Flame';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';

const NotFound: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  usePageMeta('Page not found', 'This page could not be found. Search for a K.E.S. school or college instead.');

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <PetalRing className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] text-primary-700 opacity-[0.05]" />
      <div className="container-custom relative text-center max-w-2xl">
        <Flame className="w-12 h-12 mx-auto" />
        <p className="eyebrow mt-4">Error 404</p>
        <h1 className="font-serif font-bold text-3xl md:text-5xl text-primary-900 mt-2">This page could not be found</h1>
        <p className="text-slate-600 mt-4">The link may be old or mistyped. Looking for a school or college? Search for it here.</p>
        <form
          role="search"
          className="mt-8 flex flex-col sm:flex-row gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/institutions${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
          }}
        >
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('finder.placeholder')}
              aria-label={t('finder.placeholder')}
              className="form-input !pl-11 !py-3 !rounded-full !text-base"
            />
          </div>
          <button className="btn-primary">{t('finder.search')}</button>
        </form>
        <Link to="/" className="btn-secondary mt-8">
          {t('common.backHome')}
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
