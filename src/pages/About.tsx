import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import Reveal from '../components/shared/Reveal';
import Picture from '../brand/Picture';
import Flame from '../brand/Flame';
import MottoBand from '../brand/MottoBand';
import ArchivePhoto from '../brand/ArchivePhoto';
import { archivePhotos, founders, history, identity } from '../data/site';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';
import type { TKey } from '../i18n/en';

const emblemParts = [
  { title: 'A ring of crimson lotus petals', text: 'Crimson lotus petals form the outer ring of the emblem.' },
  { title: 'A golden samai with four flames', text: 'At the centre, a golden oil lamp with four flames rises from a sun.' },
  { title: 'Leaf-green accents', text: 'Leaf-green points sit between the inner petals.' },
  { title: 'The Sanskrit motto', text: 'The motto runs around the ring, with the Society’s name in Marathi below it.' },
];

const subPages: { to: string; key: TKey; desc: TKey }[] = [
  { to: '/about/history', key: 'nav.history', desc: 'desc.history' },
  { to: '/about/leadership', key: 'nav.leadership', desc: 'desc.leadership' },
  { to: '/about/board', key: 'nav.board', desc: 'desc.board' },
  { to: '/about/office', key: 'nav.office', desc: 'desc.office' },
];

const About: React.FC = () => {
  const { t } = useI18n();
  usePageMeta('About K.E.S.', `${identity.name}, ${identity.place}: founded in 1917, inspired by Lokmanya Tilak, to bring education to the rural Konkan.`);

  return (
    <>
      <PageHero eyebrow={`Est. ${identity.founded}`} title={t('nav.aboutKes')} description={history.intro} />

      {/* Story */}
      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <SectionTitle eyebrow="Our story" title="Born of a call for national education" />
            <div className="space-y-5 text-slate-700 text-[1.05rem] leading-relaxed">
              {history.origins.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <h3 className="font-serif font-bold text-xl text-primary-900 mt-10 mb-4">Founding members</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {founders.map((f) => (
                <li key={f} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-primary-100">
                  <Flame className="w-5 h-5 mt-0.5" />
                  <span className="text-slate-800 font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 space-y-6 lg:pt-16">
            <ArchivePhoto {...archivePhotos[3]} label="From the K.E.S. archive" sizes="(min-width: 1024px) 36vw, 92vw" tilt="right" />
            <div className="card-gold p-6 flex gap-4">
              <span className="w-12 h-12 rounded-2xl bg-gold-400 text-primary-950 flex items-center justify-center shrink-0">
                <Award size={24} aria-hidden />
              </span>
              <div>
                <p className="font-serif font-bold text-primary-900 text-lg leading-snug">{identity.award}</p>
                <p className="text-sm text-slate-700 mt-1">
                  “{identity.awardGloss}” award conferred by the {identity.awardBy} in {identity.awardYear}.
                </p>
              </div>
            </div>
            <blockquote className="rounded-3xl bg-primary-900 text-white p-6">
              <p className="text-sm text-primary-100">{history.today[1]}</p>
              <p className="font-serif text-xl font-bold text-gold-300 mt-2 leading-snug">{history.principle.charAt(0).toUpperCase() + history.principle.slice(1)}</p>
            </blockquote>
          </div>
        </div>
      </section>

      <MottoBand motto={identity.motto} gloss={identity.mottoGlossMr} meaning={identity.mottoMeaning} />

      {/* Emblem & flag */}
      <section className="section-padding" aria-labelledby="emblem-title">
        <div className="container-custom">
          <SectionTitle id="emblem-title" center eyebrow="Symbols of the Society" title="Our Emblem & Flag" />
          <div className="grid md:grid-cols-2 gap-8">
            <Reveal className="card p-6 md:p-8">
              <div className="w-48 h-48 mx-auto rounded-full bg-white border-4 border-gold-200 p-2 shadow-card">
                <Picture src="/images/brand/kes-emblem" alt="The K.E.S. emblem: lotus ring, golden samai with four flames and the Sanskrit motto" sizes="192px" className="w-full h-full object-contain rounded-full" />
              </div>
              <h3 className="font-serif font-bold text-xl text-primary-900 mt-6 text-center">The Emblem</h3>
              <ul className="mt-5 space-y-3">
                {emblemParts.map((p) => (
                  <li key={p.title} className="flex gap-3">
                    <Flame className="w-5 h-5 mt-0.5" />
                    <span>
                      <span className="block font-semibold text-slate-900">{p.title}</span>
                      <span className="block text-sm text-slate-600">{p.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08} className="card p-6 md:p-8 flex flex-col">
              <div className="w-48 mx-auto">
                <Picture src="/images/brand/kes-torch-flag" alt="The K.E.S. torch flag: a hand raising a torch on a crimson splash" sizes="192px" className="w-full h-auto" />
              </div>
              <h3 className="font-serif font-bold text-xl text-primary-900 mt-4 text-center">The Torch Flag</h3>
              <p lang="sa" className="font-motto text-2xl text-flag text-center mt-4">
                {identity.flagMotto}
              </p>
              <p className="text-center text-slate-700 italic mt-2">“{identity.flagMeaning}”</p>
              <p className="text-sm text-slate-600 mt-5 leading-relaxed text-center">
                A hand raising a torch on a crimson splash, with the words “the lamp of knowledge has been lit”.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sub pages */}
      <section className="pb-16 md:pb-20">
        <div className="container-custom">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subPages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="card !rounded-2xl p-5 flex items-center justify-between gap-3 group hover:border-primary-300 h-full">
                  <span>
                    <span className="block font-serif font-bold text-primary-900">{t(p.key)}</span>
                    <span className="block text-sm text-slate-600 mt-0.5">{t(p.desc)}</span>
                  </span>
                  <ArrowRight size={18} className="text-primary-700 group-hover:translate-x-1 transition-transform shrink-0" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default About;
