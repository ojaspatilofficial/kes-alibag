import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import DocumentList from '../components/shared/DocumentList';
import { usePublishedDocuments } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';

const more = [
  ['/results', 'SSC & HSC Results'],
  ['/vikas-magazine', 'Vikas Magazine'],
  ['/competition', 'The Ceremony of Glory'],
  ['/notices', 'Notices & Circulars'],
];

const Downloads: React.FC = () => {
  const { t } = useI18n();
  usePageMeta('Downloads & Forms', 'Forms and documents from Konkan Education Society, Alibag.');
  const docs = usePublishedDocuments();
  const forms = useMemo(() => docs.filter((d) => d.type === 'form'), [docs]);

  return (
    <>
      <PageHero eyebrow="Forms & documents" title={t('nav.downloads')} description="Forms used by K.E.S. schools and colleges, and links to the Society’s published documents." />
      <div className="container-custom py-12 md:py-16 space-y-14">
        <section aria-labelledby="forms">
          <SectionTitle id="forms" eyebrow="Forms" title="Blank forms" />
          <DocumentList docs={forms} empty="Forms will be published here." downloadLabel={t('common.download')} />
        </section>
        <section aria-labelledby="more">
          <SectionTitle id="more" eyebrow="More documents" title="Results, publications & notices" />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {more.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="card !rounded-2xl p-5 flex items-center justify-between gap-3 font-serif font-bold text-primary-900 hover:border-primary-300 h-full">
                  {label} <ArrowRight size={17} className="text-primary-700 shrink-0" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default Downloads;
