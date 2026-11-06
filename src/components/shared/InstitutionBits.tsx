import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { categoryIcons, profilePath, toneClasses } from './institutionStyles';
import { categoryByKey } from '../../data/categories';
import type { Institution, InstitutionCategory } from '../../data/types';
import { cn } from '../../lib/cn';
import { useI18n } from '../../i18n';

export const CategoryIcon: React.FC<{ category: InstitutionCategory; className?: string; size?: number }> = ({ category, className, size = 22 }) => {
  const info = categoryByKey(category);
  const Icon = categoryIcons[category];
  const tone = toneClasses[info?.tone || 'secondary'];
  return (
    <span className={cn('inline-flex items-center justify-center rounded-2xl w-12 h-12 shrink-0', tone.bg, tone.text, className)}>
      <Icon size={size} aria-hidden />
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: InstitutionCategory; className?: string }> = ({ category, className }) => {
  const info = categoryByKey(category);
  const tone = toneClasses[info?.tone || 'secondary'];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border', tone.bg, tone.text, tone.border, className)}>
      {info?.short}
    </span>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'green' | 'gold' }> = ({ children, tone = 'neutral' }) => (
  <span
    className={cn(
      'inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border',
      tone === 'neutral' && 'bg-slate-50 text-slate-700 border-slate-200',
      tone === 'green' && 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
      tone === 'gold' && 'bg-gold-50 text-gold-800 border-gold-200'
    )}
  >
    {children}
  </span>
);

/** Card used in the finder, category pages and search. */
export const InstitutionCard: React.FC<{ institution: Institution; showCategory?: boolean }> = ({ institution: i, showCategory = true }) => {
  const { t } = useI18n();
  const info = categoryByKey(i.category);
  const tone = toneClasses[info?.tone || 'secondary'];
  return (
    <article className="relative card !rounded-2xl p-5 pl-6 flex flex-col h-full overflow-hidden hover:shadow-soft hover:border-primary-200 transition">
      <span className={cn('absolute left-0 top-0 bottom-0 w-1.5', tone.bar)} aria-hidden />
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        {showCategory && <CategoryBadge category={i.category} />}
        {i.hasJuniorCollege && <Badge tone="gold">Jr. College</Badge>}
        {i.medium && <Badge>{i.medium} medium</Badge>}
      </div>
      <h3 className="font-serif font-bold text-primary-900 leading-snug text-[1.02rem]">
        <Link to={profilePath(i)} className="hover:text-primary-700 after:absolute after:inset-0 after:content-['']">
          {i.name}
        </Link>
      </h3>
      <p className="mt-1.5 text-sm text-slate-600 inline-flex items-center gap-1.5">
        <MapPin size={14} className="text-gold-700 shrink-0" aria-hidden /> {i.town} · {i.district}
      </p>
      <div className="mt-auto pt-4 relative z-10">
        {i.website ? (
          <a
            href={i.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-brand-accent hover:underline underline-offset-4"
          >
            {t('common.visitWebsite')} <ArrowUpRight size={15} aria-hidden />
            <span className="sr-only">(opens {i.name} website in a new tab)</span>
          </a>
        ) : (
          <Link to={profilePath(i)} className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-primary-700 hover:underline underline-offset-4">
            {t('common.viewProfile')} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </article>
  );
};
