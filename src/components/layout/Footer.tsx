import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone, Globe } from 'lucide-react';
import FamilyLockup from '../../brand/FamilyLockup';
import PetalRing from '../../brand/PetalRing';
import { categories } from '../../data/categories';
import { identity } from '../../data/site';
import { useInstitutions, useSettings } from '../../lib/content';
import { useI18n } from '../../i18n';
import type { TKey } from '../../i18n/en';

const quick: [string, TKey][] = [
  ['/about', 'nav.aboutKes'],
  ['/about/history', 'nav.history'],
  ['/about/board', 'nav.board'],
  ['/results', 'nav.results'],
  ['/vikas-magazine', 'nav.vikas'],
  ['/competition', 'nav.competition'],
  ['/notices', 'nav.notices'],
  ['/downloads', 'nav.downloads'],
  ['/gallery', 'nav.gallery'],
  ['/contact', 'nav.contact'],
];

const YEAR = new Date().getFullYear();

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xs font-bold uppercase tracking-[0.16em] mb-4 text-gold-300 font-sans">{children}</h2>
);

const Footer: React.FC = () => {
  const { t } = useI18n();
  const settings = useSettings();
  const institutions = useInstitutions();
  const colleges = institutions.filter((i) => (i.category === 'homoeopathic-medical' || i.category === 'senior-college') && i.website);
  const socials = (
    [
      ['Facebook', settings.social_facebook],
      ['YouTube', settings.social_youtube],
      ['Instagram', settings.social_instagram],
      ['X', settings.social_x],
    ] as const
  ).filter(([, url]) => url);

  return (
    <footer className="bg-primary-950 text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-700 via-gold-400 to-primary-700" />
      <PetalRing className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] text-gold-400 opacity-[0.05]" />
      <div className="container-custom relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-4 space-y-5">
            <FamilyLockup emblemSrc="/images/brand/kes-emblem" title={`${identity.name}, ${identity.place}`} subtitle={`Est. ${identity.founded}`} />
            <p className="text-primary-100/90 text-sm leading-relaxed max-w-sm">{identity.brandLine}</p>
            <p lang="sa" className="font-motto text-gold-300 text-lg leading-relaxed">
              {identity.flagMotto}
            </p>
            <ul className="space-y-3 text-sm text-primary-100/90">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="text-gold-400 shrink-0 mt-0.5" aria-hidden />
                <span>
                  {settings.head_office}
                  {settings.street_address && <>, {settings.street_address}</>}, {settings.city_line}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={17} className="text-gold-400 shrink-0 mt-0.5" aria-hidden />
                <span>
                  <a href={`tel:+912141222105`} className="hover:text-white">
                    {settings.phone}
                  </a>
                  {settings.phone_alt && (
                    <>
                      {' · '}
                      <a href={`tel:${settings.phone_alt.replace(/[^\d+]/g, '')}`} className="hover:text-white">
                        {settings.phone_alt}
                      </a>
                    </>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} className="text-gold-400 shrink-0 mt-0.5" aria-hidden />
                <a href={`mailto:${settings.email}`} className="hover:text-white break-all">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <Heading>{t('footer.quick')}</Heading>
            <ul>
              {quick.map(([to, key]) => (
                <li key={to}>
                  <Link to={to} className="text-primary-100/90 hover:text-white text-sm inline-flex items-center gap-2 min-h-[40px]">
                    <span className="w-1 h-1 rounded-full bg-gold-400" aria-hidden />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <Heading>{t('footer.categories')}</Heading>
            <ul>
              {categories.map((c) => (
                <li key={c.key}>
                  <Link to={`/institutions/${c.key}`} className="text-primary-100/90 hover:text-white text-sm inline-flex items-start gap-2 py-2.5">
                    <span className="w-1 h-1 rounded-full bg-gold-400 mt-2 shrink-0" aria-hidden />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <Heading>{t('footer.colleges')}</Heading>
            <ul className="space-y-3">
              {colleges.map((c) => (
                <li key={c.slug}>
                  <a href={c.website} target="_blank" rel="noopener noreferrer" className="group text-sm text-primary-100/90 hover:text-white inline-flex items-start gap-2 py-2">
                    <ArrowUpRight size={15} className="text-gold-400 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                    <span>
                      {c.name}, {c.town.split(',')[0]}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {socials.map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs">
                    <Globe size={13} aria-hidden /> {name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-primary-100/80 text-center">
          <p>
            © {YEAR} {identity.name}, {identity.place}. {t('footer.rights')}
          </p>
          <p>{settings.registration}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
