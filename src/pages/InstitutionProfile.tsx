import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, CalendarDays, GraduationCap, Languages, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import { Badge, CategoryBadge, CategoryIcon, InstitutionCard } from '../components/shared/InstitutionBits';
import FamilyLockup from '../brand/FamilyLockup';
import Picture from '../brand/Picture';
import { categoryByKey } from '../data/categories';
import { identity } from '../data/site';
import { useInstitutions } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';
import NotFound from './NotFound';

/**
 * Institution profile — the seed template for every future K.E.S. school/college site.
 * Shows only the fields that are filled in.
 */
const InstitutionProfile: React.FC = () => {
  const { t } = useI18n();
  const { category, slug } = useParams();
  const all = useInstitutions();
  const inst = all.find((i) => i.slug === slug && i.category === category);
  const info = categoryByKey(category);

  usePageMeta(
    inst ? `${inst.name}, ${inst.town.split(',')[0]}` : 'Institution not found',
    inst ? `${inst.name}, ${inst.town} (${inst.district}) — ${info?.label}. A ${identity.name} institution.` : 'This institution could not be found.'
  );

  if (!inst || !info) return <NotFound />;

  const facts = [
    { icon: MapPin, label: 'Location', value: `${inst.town}, ${inst.district} district, Maharashtra` },
    inst.medium && { icon: Languages, label: 'Medium of instruction', value: `${inst.medium} medium` },
    inst.hasJuniorCollege && { icon: GraduationCap, label: 'Junior College', value: 'Yes — junior college attached' },
    inst.principal && { icon: UserRound, label: 'Principal', value: inst.principal },
    inst.established && { icon: CalendarDays, label: 'Established', value: String(inst.established) },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  const nearby = all.filter((i) => i.slug !== inst.slug && i.town.split(',')[0] === inst.town.split(',')[0]).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={info.label}
        title={inst.name}
        crumbs={[
          { label: t('nav.institutions'), to: '/institutions' },
          { label: info.short, to: `/institutions/${info.key}` },
        ]}
      >
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <CategoryBadge category={inst.category} />
          {inst.hasJuniorCollege && <Badge tone="gold">Jr. College</Badge>}
          {inst.medium && <Badge>{inst.medium} medium</Badge>}
          {inst.isJrh && inst.website && <Badge tone="green">New website</Badge>}
        </div>
        {inst.website && (
          <a href={inst.website} target="_blank" rel="noopener noreferrer" className="btn-primary mt-7 !px-7">
            {t('common.visitWebsite')} <ArrowUpRight size={17} aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </PageHero>

      <div className="container-custom py-12 md:py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="card p-6 md:p-8" aria-labelledby="facts-title">
            <div className="flex items-center gap-4 mb-6">
              {inst.logo ? (
                <Picture src={inst.logo} alt={`${inst.name} logo`} className="w-16 h-16 object-contain rounded-xl bg-white border border-slate-200" />
              ) : (
                <CategoryIcon category={inst.category} className="w-16 h-16" size={28} />
              )}
              <h2 id="facts-title" className="font-serif font-bold text-xl text-primary-900">
                At a glance
              </h2>
            </div>
            <dl className="grid sm:grid-cols-2 gap-5">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <dt className="sr-only">{f.label}</dt>
                  <f.icon size={20} className="text-gold-700 shrink-0 mt-0.5" aria-hidden />
                  <dd>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">{f.label}</span>
                    <span className="block text-slate-900 font-medium mt-0.5">{f.value}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {(inst.phone || inst.email) && (
            <section className="card p-6 md:p-8" aria-labelledby="contact-title">
              <h2 id="contact-title" className="font-serif font-bold text-xl text-primary-900 mb-4">
                Contact
              </h2>
              <ul className="space-y-3">
                {inst.phone && (
                  <li className="flex items-center gap-3">
                    <Phone size={18} className="text-gold-700" aria-hidden />
                    <a className="link" href={`tel:${inst.phone.replace(/[^\d+]/g, '')}`}>
                      {inst.phone}
                    </a>
                  </li>
                )}
                {inst.email && (
                  <li className="flex items-center gap-3">
                    <Mail size={18} className="text-gold-700" aria-hidden />
                    <a className="link break-all" href={`mailto:${inst.email}`}>
                      {inst.email}
                    </a>
                  </li>
                )}
              </ul>
            </section>
          )}

          {!inst.website && !inst.phone && !inst.email && (
            <p className="text-sm text-slate-700 bg-gold-50 border border-gold-200 rounded-2xl p-5">
              More details about this institution will be added soon. For enquiries, please{' '}
              <Link to="/contact" className="link">
                contact the K.E.S. head office
              </Link>
              .
            </p>
          )}

          {nearby.length > 0 && (
            <section aria-labelledby="nearby-title">
              <h2 id="nearby-title" className="font-serif font-bold text-xl text-primary-900 mb-4">
                Other K.E.S. institutions in {inst.town.split(',')[0]}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {nearby.map((i) => (
                  <li key={i.slug}>
                    <InstitutionCard institution={i} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-primary-900 text-white p-6 relative overflow-hidden" aria-label="Part of the Konkan Education Society">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300 mb-4">Part of the family</p>
            <FamilyLockup emblemSrc="/images/brand/kes-emblem" title="A Konkan Education Society institution" subtitle={`Alibag · Est. ${identity.founded}`} />
            <p className="text-sm text-primary-100 mt-4 leading-relaxed">{identity.brandLine}</p>
            <div className="mt-5 flex flex-col gap-2">
              <Link to="/about" className="btn-gold !py-2.5">
                About K.E.S.
              </Link>
              <Link to={`/institutions/${info.key}`} className="btn-outline-light !py-2.5">
                All {info.short.toLowerCase()} institutions
              </Link>
            </div>
          </section>
          <Link to="/institutions" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 min-h-[44px]">
            <ArrowLeft size={16} aria-hidden /> Back to the institution finder
          </Link>
        </aside>
      </div>
    </>
  );
};

export default InstitutionProfile;
