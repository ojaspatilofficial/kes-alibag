import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import Reveal from '../components/shared/Reveal';
import MagazineCover from '../components/shared/MagazineCover';
import { identity } from '../data/site';
import { usePublishedDocuments } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';

const Magazine: React.FC = () => {
  const { t } = useI18n();
  usePageMeta('Vikas Magazine', 'Vikas — the magazine of Konkan Education Society, Alibag. Read past issues by publication year.');
  const docs = usePublishedDocuments();
  const issues = useMemo(() => docs.filter((d) => d.type === 'magazine').sort((a, b) => b.year.localeCompare(a.year)), [docs]);
  const publisher = `${identity.shortName} ${identity.place}`;

  return (
    <>
      <PageHero eyebrow={t('nav.publications')} title="Vikas Magazine" description="The Society’s magazine, one issue per publication year." crumbs={[{ label: t('nav.publications') }]} />
      <div className="container-custom py-12 md:py-16">
        {issues.length === 0 ? (
          <div className="max-w-[15rem] mx-auto text-center">
            <MagazineCover title="Vikas" subtitle="विकास" year="" emblemSrc="/images/brand/kes-emblem" publisher={publisher} />
            <p className="text-slate-700 mt-6">Issues of Vikas will be published here.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {issues.map((d, i) => (
              <Reveal as="li" key={d.id || d.year} delay={i * 0.05}>
                <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="group-hover:-translate-y-1 transition-transform">
                    <MagazineCover title="Vikas" subtitle="विकास" year={d.year} cover={d.cover_image} emblemSrc="/images/brand/kes-emblem" publisher={publisher} />
                  </div>
                  <span className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold text-slate-900">
                    {d.title}
                    <Download size={16} className="text-primary-700" aria-hidden />
                  </span>
                  <span className="sr-only">(PDF, opens in a new tab)</span>
                </a>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Magazine;
