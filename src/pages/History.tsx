import React, { useMemo } from 'react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import Reveal from '../components/shared/Reveal';
import Flame from '../brand/Flame';
import ArchivePhoto from '../brand/ArchivePhoto';
import { archivePhotos, history, identity } from '../data/site';
import { useContent } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { cn } from '../lib/cn';

const History: React.FC = () => {
  usePageMeta('History & Legacy', 'The legacy of Konkan Education Society from the Kulaba Students Association of 1917 to 100+ institutions and the 2017 centenary.');
  const timeline = useContent('timeline');
  const items = useMemo(() => [...timeline].sort((a, b) => a.sort_year - b.sort_year), [timeline]);
  const usedImages = new Set(items.map((i) => i.image_url).filter(Boolean));
  const extraPhotos = archivePhotos.filter((p) => !usedImages.has(p.src));

  return (
    <>
      <PageHero eyebrow="1917 → today" title="A Century of Service" description={identity.brandLine} crumbs={[{ label: 'About', to: '/about' }]} />

      {/* Big numbers */}
      <section className="container-custom py-12 md:py-16">
        <dl className="grid grid-cols-3 gap-4 text-center max-w-3xl mx-auto">
          {[
            ['1917', 'Kulaba Students Association founded'],
            ['24 → 100+', 'Schools, 1977 to today'],
            ['2017', 'Centenary celebrated at Alibag'],
          ].map(([v, l]) => (
            <div key={v} className="flex flex-col-reverse">
              <dt className="text-xs sm:text-sm text-slate-600 mt-2">{l}</dt>
              <dd className="font-serif font-black text-2xl sm:text-4xl md:text-5xl text-primary-800">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Timeline */}
      <section className="pb-16 md:pb-20" aria-labelledby="timeline-title">
        <div className="container-custom">
          <SectionTitle id="timeline-title" center eyebrow="Legacy timeline" title="Milestones" />
          <ol className="relative max-w-5xl mx-auto">
            <span className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-300 via-primary-300 to-gold-300 md:-translate-x-1/2" aria-hidden />
            {items.map((m, i) => {
              const right = i % 2 === 1;
              return (
                <li key={m.date_label + m.title} className="relative pl-14 md:pl-0 pb-10 md:grid md:grid-cols-2 md:gap-12">
                  <span
                    className={cn(
                      'absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white z-10',
                      m.highlight ? 'border-gold-400 shadow-[0_0_0_6px_rgba(245,181,52,0.18)]' : 'border-primary-200'
                    )}
                  >
                    <Flame className="w-5 h-5" />
                  </span>
                  <Reveal className={cn(right ? 'md:col-start-2' : 'md:text-right md:pr-4', right && 'md:pl-4')}>
                    <p className="text-sm font-bold text-gold-700 tracking-wide">{m.date_label}</p>
                    <h3 className="font-serif font-bold text-xl text-primary-900 mt-1 leading-snug">{m.title}</h3>
                    <p className="text-slate-700 mt-2 leading-relaxed">{m.description}</p>
                    {m.image_url && (
                      <ArchivePhoto
                        src={m.image_url}
                        alt={archivePhotos.find((p) => p.src === m.image_url)?.alt || m.title}
                        label="From the K.E.S. archive"
                        className="mt-5 max-w-md md:inline-block w-full text-left"
                        sizes="(min-width: 768px) 28rem, 85vw"
                      />
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Narrative */}
      <section className="section-padding bg-brand-cream border-y border-gold-100">
        <div className="container-custom grid lg:grid-cols-2 gap-12">
          <div>
            <SectionTitle eyebrow="1917 – 1977" title="The founding decades" />
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {history.origins.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              <p>{history.growth[0]}</p>
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="1977 – today" title="The golden era and beyond" />
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {history.growth.slice(1).map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              {history.today.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              <p className="font-serif text-xl font-bold text-primary-800 border-l-4 border-gold-400 pl-4">{history.principle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Archive */}
      <section className="section-padding" aria-labelledby="archive-title">
        <div className="container-custom">
          <SectionTitle id="archive-title" eyebrow="From the K.E.S. archive" title="Moments from our past" description="Old film photographs of school inaugurations, Bhoomi Pujans and gatherings." />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {extraPhotos.map((p, i) => (
              <Reveal as="li" key={p.src} delay={i * 0.05}>
                <ArchivePhoto {...p} label="Archive" tilt={i % 2 ? 'right' : 'left'} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default History;
