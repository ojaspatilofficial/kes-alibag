import React from 'react';
import { useI18n, type Lang } from '../../i18n';
import { cn } from '../../lib/cn';

/** EN | Marathi switch. The choice is remembered in the browser. */
const LanguageToggle: React.FC<{ className?: string; dark?: boolean }> = ({ className, dark }) => {
  const { lang, setLang, t } = useI18n();
  const opt = (value: Lang, label: string, langAttr: string) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      aria-pressed={lang === value}
      lang={langAttr}
      className={cn(
        'px-2.5 py-1 min-h-[32px] rounded-full text-xs font-semibold transition-colors',
        lang === value
          ? dark
            ? 'bg-gold-400 text-primary-950'
            : 'bg-primary-700 text-white'
          : dark
            ? 'text-primary-100 hover:text-white'
            : 'text-slate-700 hover:text-primary-700'
      )}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label={t('util.language')} className={cn('inline-flex items-center gap-0.5 rounded-full p-0.5', dark ? 'bg-white/10' : 'bg-slate-100', className)}>
      {opt('en', 'EN', 'en')}
      {opt('mr', 'मराठी', 'mr')}
    </div>
  );
};

export default LanguageToggle;
