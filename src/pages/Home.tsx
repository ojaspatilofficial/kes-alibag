import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Award, BookOpenText, Download, FileCheck2, Mail, MapPin, Phone, Search, Trophy } from 'lucide-react';
import PetalRing from '../brand/PetalRing';
import Flame from '../brand/Flame';
import Picture from '../brand/Picture';
import MottoBand from '../brand/MottoBand';
import ArchivePhoto from '../brand/ArchivePhoto';
import SectionTitle from '../components/shared/SectionTitle';
import Reveal from '../components/shared/Reveal';
import Portrait from '../components/shared/Portrait';
import MapEmbed from '../components/shared/MapEmbed';
import { CategoryIcon } from '../components/shared/InstitutionBits';
import { toneClasses } from '../components/shared/institutionStyles';
import { categories } from '../data/categories';
import { archivePhotos, identity, stats } from '../data/site';
import { useContent, useInstitutions, usePublishedDocuments, useSettings } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';
import type { TKey } from '../i18n/en';
import type { DocumentItem, District, InstitutionCategory } from '../data/types';
import { cn } from '../lib/cn';

const statKeys: TKey[] = ['stats.est', 'stats.institutions', 'stats.districts', 'stats.award'];

/* ---------------------------------- Hero ---------------------------------- */

const Hero: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-primary-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(165,28,48,0.55),transparent_60%)]" aria-hidden />
      <PetalRing className="absolute -left-[18rem] -top-[14rem] w-[44rem] h-[44rem] text-gold-400 opacity-[0.06]" spin />
      <PetalRing className="absolute -right-40 -bottom-56 w-[30rem] h-[30rem] text-gold-400 opacity-[0.05]" />
      <div className="container-custom relative pt-12 pb-32 md:pt-16 md:pb-40 lg:pt-20 lg:pb-44 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <p lang="sa" className="font-motto text-gold-300 text-base sm:text-lg mb-5 leading-relaxed">
            {identity.motto}
          </p>
          <h1 className="font-serif font-bold text-[2rem] leading-[1.15] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.12] text-white">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-primary-100 leading-relaxed max-w-2xl">{t('hero.subtitle')}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/institutions" className="btn-gold !px-7 !py-3.5 !text-base">
              <Search size={18} aria-hidden /> {t('hero.find')}
            </Link>
            <Link to="/about/history" className="btn-outline-light !px-7 !py-3.5 !text-base">
              {t('hero.story')} <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <figure className="relative max-w-md mx-auto lg:ml-auto">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold-400/30 rotate-2" aria-hidden />
            <div className="relative rounded-[1.75rem] overflow-hidden bg-white p-2 shadow-2xl">
              <Picture
                src="/images/about/datta-patil-sankul-admin-office"
                alt="Poster of the Loknete Adv. Datta Patil Sankul, the Society’s Administrative Office & Training Center at Alibag"
                sizes="(min-width: 1024px) 28rem, 90vw"
                priority
                className="w-full h-auto rounded-[1.4rem]"
              />
            </div>
            <figcaption className="sr-only">Loknete Adv. Datta Patil Sankul, Alibag</figcaption>
            <div className="absolute left-3 sm:-left-10 bottom-8 bg-white text-slate-800 rounded-2xl shadow-2xl p-3.5 pr-5 flex items-center gap-3 max-w-[16rem] border border-gold-200">
              <span className="w-11 h-11 rounded-xl bg-gold-400 text-primary-950 flex items-center justify-center shrink-0">
                <Award size={22} aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold text-primary-900 leading-tight">{t('hero.award')}</span>
                <span className="block text-xs text-slate-600 mt-0.5">{t('hero.awardBy')}</span>
              </span>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
};

/* ----------------------------- Finder bar -------------------------------- */

const FinderBar: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<InstitutionCategory | ''>('');
  const [district, setDistrict] = useState<District | ''>('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (category) p.set('category', category);
    if (district) p.set('district', district);
    navigate(`/institutions${p.toString() ? `?${p}` : ''}`);
  };

  return (
    <div className="container-custom relative z-10 -mt-20 md:-mt-24">
      <form onSubmit={submit} role="search" aria-labelledby="finder-title" className="card !rounded-[1.75rem] p-5 md:p-7 shadow-soft">
        <h2 id="finder-title" className="font-serif font-bold text-primary-900 text-lg md:text-xl mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5" /> {t('finder.title')}
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
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
          <label className="sr-only" htmlFor="finder-district">
            {t('finder.district')}
          </label>
          <select
            id="finder-district"
            value={district}
            onChange={(e) => setDistrict(e.target.value as District | '')}
            className="form-input !rounded-full md:!w-52 !py-3"
          >
            <option value="">{t('finder.allDistricts')}</option>
            {identity.districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary !py-3 !px-8">
            <Search size={17} aria-hidden /> {t('finder.search')}
          </button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Institution type">
          {categories.map((c) => (
            <button
              type="button"
              key={c.key}
              aria-pressed={category === c.key}
              onClick={() => setCategory((cur) => (cur === c.key ? '' : c.key))}
              className={cn('chip', category === c.key ? 'chip-active' : 'chip-idle')}
            >
              {c.short}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

/* ------------------------------- Stats band ------------------------------ */

const StatsBand: React.FC = () => {
  const { t } = useI18n();
  const settings = useSettings();
  const extra = settings.show_extended_stats
    ? [
        { value: settings.stat_institutions, label: 'Institutions (latest count)' },
        { value: settings.stat_students, label: 'Students' },
        { value: settings.stat_staff, label: 'Staff' },
      ].filter((s) => s.value)
    : [];
  return (
    <section aria-label="K.E.S. at a glance" className="container-custom pt-14 md:pt-16">
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="card !rounded-2xl p-5 md:p-6 text-center flex flex-col-reverse">
            <dt className="mt-2">
              <span className="block text-sm font-semibold text-slate-800">{t(statKeys[i])}</span>
              <span className="block text-xs text-slate-600 mt-1">{s.sub}</span>
            </dt>
            <dd className="font-serif font-black text-3xl md:text-5xl text-primary-800">{s.value}</dd>
          </Reveal>
        ))}
      </dl>
      {extra.length > 0 && (
        <dl className="grid grid-cols-3 gap-4 mt-4">
          {extra.map((s) => (
            <div key={s.label} className="card-gold p-4 text-center flex flex-col-reverse">
              <dt className="text-xs font-semibold text-slate-700 mt-1">{s.label}</dt>
              <dd className="font-serif font-bold text-2xl text-primary-800">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};

/* ------------------------- Family of institutions ------------------------ */

const Family: React.FC = () => {
  const { t } = useI18n();
  const institutions = useInstitutions();
  const byCat = useMemo(() => {
    const m: Record<string, typeof institutions> = {};
    for (const i of institutions) (m[i.category] ||= []).push(i);
    return m;
  }, [institutions]);

  return (
    <section className="section-padding" aria-labelledby="family-title">
      <div className="container-custom">
        <SectionTitle
          id="family-title"
          eyebrow={t('home.family.eyebrow')}
          title={t('home.family.title')}
          description="Over a hundred institutions share one emblem and one purpose. Choose a type to see every school or college in it."
          action={
            <Link to="/institutions" className="btn-secondary">
              {t('nav.allInstitutions')} <ArrowRight size={16} aria-hidden />
            </Link>
          }
        />
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c, idx) => {
            const list = byCat[c.key] || [];
            const showColleges = c.key === 'homoeopathic-medical' || c.key === 'senior-college';
            const tone = toneClasses[c.tone];
            return (
              <Reveal as="li" key={c.key} delay={(idx % 3) * 0.06} className="card p-6 flex flex-col relative overflow-hidden group hover:shadow-soft transition">
                <span className={cn('absolute top-0 left-0 right-0 h-1', tone.bar)} aria-hidden />
                <div className="flex items-start justify-between gap-4">
                  <CategoryIcon category={c.key} />
                  <span className={cn('font-serif font-black text-4xl leading-none', tone.text)}>{list.length}</span>
                </div>
                <h3 className="mt-4 font-serif font-bold text-lg text-primary-900 leading-snug">
                  <Link to={`/institutions/${c.key}`} className="hover:text-primary-700">
                    {c.label}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.description}</p>
                {showColleges && (
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {list.map((i) => (
                      <li key={i.slug}>
                        <a
                          href={i.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-start gap-2 text-sm text-slate-700 hover:text-primary-700"
                        >
                          <ArrowUpRight size={15} className="text-brand-accent shrink-0 mt-0.5" aria-hidden />
                          <span>
                            {i.name}, <span className="text-slate-500">{i.town.split(',')[0]}</span>
                            <span className="sr-only"> (website, opens in a new tab)</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <Link to={`/institutions/${c.key}`} className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 min-h-[44px]">
                  {t('common.viewAll')} <span className="sr-only">{c.label}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" aria-hidden />
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

/* ------------------------------ Century preview -------------------------- */

const Century: React.FC = () => {
  const { t } = useI18n();
  const timeline = useContent('timeline');
  const preview = useMemo(() => {
    const sorted = [...timeline].sort((a, b) => a.sort_year - b.sort_year);
    const hl = sorted.filter((x) => x.highlight);
    return (hl.length >= 4 ? hl : sorted).slice(0, 5);
  }, [timeline]);

  return (
    <section className="section-padding bg-brand-cream border-y border-gold-100 relative overflow-hidden" aria-labelledby="century-title">
      <div className="absolute inset-0 bg-heritage-pattern [background-size:22px_22px] opacity-60" aria-hidden />
      <div className="container-custom relative grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-6">
          <SectionTitle id="century-title" eyebrow={t('home.century.eyebrow')} title={t('home.century.title')} />
          <ol className="relative border-l-2 border-gold-300 ml-3 space-y-7">
            {preview.map((m, i) => (
              <Reveal as="li" key={m.date_label} delay={i * 0.05} className="pl-8 relative">
                <span className="absolute -left-[15px] top-0 w-7 h-7 rounded-full bg-white border-2 border-gold-300 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </span>
                <p className="text-sm font-bold text-gold-700 tracking-wide">{m.date_label}</p>
                <h3 className="font-serif font-bold text-primary-900 text-lg leading-snug mt-0.5">{m.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{m.description}</p>
              </Reveal>
            ))}
          </ol>
          <Link to="/about/history" className="btn-primary mt-10">
            {t('common.readMore')} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6 lg:pt-24">
          <ArchivePhoto {...archivePhotos[0]} label="From the K.E.S. archive" caption={undefined} className="col-span-2" tilt="left" sizes="(min-width: 1024px) 40vw, 92vw" />
          <ArchivePhoto {...archivePhotos[2]} label="Archive" caption={undefined} tilt="right" sizes="(min-width: 1024px) 20vw, 46vw" />
          <ArchivePhoto {...archivePhotos[4]} label="Archive" caption={undefined} tilt="left" sizes="(min-width: 1024px) 20vw, 46vw" />
        </div>
      </div>
    </section>
  );
};

/* ------------------------------ Inspiration ------------------------------ */

const Inspiration: React.FC = () => {
  const { t } = useI18n();
  const leaders = [...useContent('leaders')].sort((a, b) => a.order - b.order);
  return (
    <section className="section-padding" aria-labelledby="inspiration-title">
      <div className="container-custom">
        <SectionTitle id="inspiration-title" center eyebrow={t('home.inspiration.eyebrow')} title={t('home.inspiration.title')} />
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {leaders.map((l, i) => (
            <Reveal as="li" key={l.name} delay={i * 0.06}>
              <Portrait name={l.name} role={l.label} photo={l.photo_url} sizes="(min-width: 1024px) 22vw, 45vw" />
            </Reveal>
          ))}
        </ul>
        <p className="text-center mt-10">
          <Link to="/about/leadership" className="link inline-flex items-center gap-1.5 min-h-[44px]">
            {t('nav.leadership')} <ArrowRight size={15} aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  );
};

/* -------------------------------- Board ---------------------------------- */

const BoardPreview: React.FC = () => {
  const { t } = useI18n();
  const officers = useContent('boardMembers')
    .filter((m) => m.group === 'office-bearer')
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);
  return (
    <section className="section-padding bg-white border-y border-primary-100/70" aria-labelledby="board-title">
      <div className="container-custom">
        <SectionTitle
          id="board-title"
          eyebrow={t('home.board.eyebrow')}
          title={t('home.board.title')}
          action={
            <Link to="/about/board" className="btn-secondary">
              {t('home.board.cta')} <ArrowRight size={16} aria-hidden />
            </Link>
          }
        />
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10 max-w-4xl">
          {officers.map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 0.06} className={i === 2 ? 'col-span-2 md:col-span-1 max-w-[50%] md:max-w-none mx-auto md:mx-0 w-full' : ''}>
              <Portrait name={m.name} role={m.role} photo={m.photo_url} size="lg" sizes="(min-width: 768px) 280px, 45vw" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* --------------------- Results · Publications · Downloads ----------------- */

const latest = (docs: DocumentItem[], types: DocumentItem['type'][]) =>
  docs.filter((d) => types.includes(d.type)).sort((a, b) => b.year.localeCompare(a.year))[0];

const DocsTrio: React.FC = () => {
  const { t } = useI18n();
  const docs = usePublishedDocuments();
  const cards = [
    {
      to: '/results',
      icon: FileCheck2,
      title: 'SSC & HSC Results',
      latest: latest(docs, ['ssc-result', 'hsc-result']),
      empty: 'Results for this year will be published here.',
    },
    {
      to: '/vikas-magazine',
      icon: BookOpenText,
      title: 'Vikas Magazine',
      latest: latest(docs, ['magazine']),
      empty: 'New issues will be published here.',
      extra: { to: '/competition', icon: Trophy, label: 'The Ceremony of Glory' },
    },
    {
      to: '/downloads',
      icon: Download,
      title: 'Forms & Downloads',
      latest: latest(docs, ['form']),
      empty: 'Forms will be published here.',
    },
  ];
  return (
    <section className="section-padding" aria-labelledby="docs-title">
      <div className="container-custom">
        <SectionTitle id="docs-title" eyebrow={t('home.docs.eyebrow')} title={t('home.docs.title')} />
        <ul className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.to} delay={i * 0.06} className="card p-6 flex flex-col">
              <span className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center">
                <c.icon size={22} aria-hidden />
              </span>
              <h3 className="font-serif font-bold text-lg text-primary-900 mt-4">{c.title}</h3>
              {c.latest ? (
                <p className="text-sm text-slate-600 mt-2">
                  Latest: <span className="font-semibold text-slate-800">{c.latest.title}</span>
                </p>
              ) : (
                <p className="text-sm text-slate-600 mt-2">{c.empty}</p>
              )}
              {c.extra && (
                <Link to={c.extra.to} className="mt-2 inline-flex items-center gap-2 min-h-[44px] text-sm text-slate-700 hover:text-primary-700">
                  <c.extra.icon size={15} className="text-gold-700" aria-hidden /> {c.extra.label}
                </Link>
              )}
              <Link to={c.to} className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 min-h-[44px]">
                {t('common.viewAll')} <span className="sr-only">{c.title}</span> <ArrowRight size={15} aria-hidden />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* --------------------------------- Visit --------------------------------- */

const Visit: React.FC = () => {
  const { t } = useI18n();
  const s = useSettings();
  return (
    <section className="section-padding bg-brand-cream border-t border-gold-100" aria-labelledby="visit-title">
      <div className="container-custom grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <SectionTitle id="visit-title" eyebrow={t('home.visit.eyebrow')} title={t('home.visit.title')} />
          <ul className="space-y-5 text-slate-700">
            <li className="flex gap-4">
              <span className="w-11 h-11 rounded-xl bg-white border border-gold-200 text-gold-700 flex items-center justify-center shrink-0">
                <MapPin size={20} aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-slate-900">{s.head_office.replace('Administrative Office & Training Center, ', '')}</span>
                {s.street_address && <span className="block">{s.street_address}</span>}
                <span className="block">{s.city_line}</span>
              </span>
            </li>
            <li className="flex gap-4 items-center">
              <span className="w-11 h-11 rounded-xl bg-white border border-gold-200 text-gold-700 flex items-center justify-center shrink-0">
                <Phone size={20} aria-hidden />
              </span>
              <span className="flex flex-wrap gap-x-4">
                <a className="link" href="tel:+912141222105">
                  {s.phone}
                </a>
                {s.phone_alt && (
                  <a className="link" href={`tel:${s.phone_alt.replace(/[^\d+]/g, '')}`}>
                    {s.phone_alt}
                  </a>
                )}
              </span>
            </li>
            <li className="flex gap-4 items-center">
              <span className="w-11 h-11 rounded-xl bg-white border border-gold-200 text-gold-700 flex items-center justify-center shrink-0">
                <Mail size={20} aria-hidden />
              </span>
              <a className="link break-all" href={`mailto:${s.email}`}>
                {s.email}
              </a>
            </li>
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/contact" className="btn-primary">
              {t('common.sendEnquiry')} <ArrowRight size={16} aria-hidden />
            </Link>
            <Link to="/about/office" className="btn-secondary">
              {t('nav.office')}
            </Link>
          </div>
        </div>
        <MapEmbed defer query={s.map_query} title={`Map showing ${identity.name}, ${identity.place}`} />
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  usePageMeta('', `${identity.name}, ${identity.place} — ${identity.brandLine} Find any of our 100+ schools and colleges in Raigad, Thane and Sindhudurg.`);
  return (
    <>
      <Hero />
      <FinderBar />
      <StatsBand />
      <Family />
      <Century />
      <MottoBand motto={identity.motto} gloss={identity.mottoGlossMr} meaning={identity.mottoMeaning} label="The Society’s motto" />
      <Inspiration />
      <BoardPreview />
      <DocsTrio />
      <Visit />
    </>
  );
};

export default Home;
