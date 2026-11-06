import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import PetalRing from '../../brand/PetalRing';
import Flame from '../../brand/Flame';
import { useI18n } from '../../i18n';

export interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Extra breadcrumb steps between Home and this page. */
  crumbs?: Crumb[];
  children?: React.ReactNode;
}

/** Banner at the top of every inner page — same as the school site's, with the petal-ring ornament. */
const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, crumbs = [], children }) => {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-brand-cream to-gold-50 border-b border-primary-100">
      <div className="absolute inset-0 bg-heritage-pattern [background-size:22px_22px] opacity-70" aria-hidden />
      <PetalRing className="absolute -top-28 -right-28 w-96 h-96 text-primary-700 opacity-[0.06]" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-primary-200/40 blur-3xl" aria-hidden />

      <div className="container-custom relative py-12 md:py-16 text-center">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-600 mb-5">
            <li>
              <Link to="/" className="inline-flex items-center gap-1 hover:text-primary-700">
                <Home size={13} aria-hidden /> {t('nav.home')}
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="inline-flex items-center gap-1.5">
                <ChevronRight size={13} aria-hidden />
                {c.to ? (
                  <Link to={c.to} className="hover:text-primary-700">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </li>
            ))}
            <li className="inline-flex items-center gap-1.5">
              <ChevronRight size={13} aria-hidden />
              <span className="text-primary-700 font-semibold" aria-current="page">
                {title.length > 48 ? `${title.slice(0, 46)}…` : title}
              </span>
            </li>
          </ol>
        </nav>
        <span className="eyebrow mb-3">
          <Flame className="w-4 h-4" /> {eyebrow}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary-900 leading-tight max-w-4xl mx-auto">{title}</h1>
        <div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary-600 to-gold-400 mx-auto mt-5" />
        {description && <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mt-5">{description}</p>}
        {children}
      </div>
    </section>
  );
};

export default PageHero;
