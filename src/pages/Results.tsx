import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import DocumentList from '../components/shared/DocumentList';
import { usePublishedDocuments } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';
import type { DocumentItem } from '../data/types';

const ofType = (docs: DocumentItem[], type: DocumentItem['type']) => docs.filter((d) => d.type === type).sort((a, b) => b.year.localeCompare(a.year));

const Results: React.FC = () => {
  const { t } = useI18n();
  usePageMeta('SSC & HSC Results', 'SSC (Class X) and HSC (Class XII) board results of Konkan Education Society schools and junior colleges, by academic year.');
  const docs = usePublishedDocuments();

  return (
    <>
      <PageHero eyebrow="Board examinations" title={t('nav.results')} description="Society-wide SSC (Class X) and HSC (Class XII) results, published one document per academic year." />
      <div className="container-custom py-12 md:py-16 space-y-14">
        <section aria-labelledby="ssc">
          <SectionTitle id="ssc" eyebrow="Class X" title="SSC Results" />
          <DocumentList docs={ofType(docs, 'ssc-result')} empty="SSC results for this year will be published here." downloadLabel={t('common.download')} />
        </section>
        <section aria-labelledby="hsc">
          <SectionTitle id="hsc" eyebrow="Class XII" title="HSC Results" />
          <DocumentList docs={ofType(docs, 'hsc-result')} empty="HSC results for this year will be published here." downloadLabel={t('common.download')} />
        </section>
        <p className="text-sm text-slate-700 bg-gold-50 border border-gold-200 rounded-2xl p-5">
          The <Link to="/downloads" className="link">SSC &amp; HSC Result Blank Form</Link> is available on the Downloads page.
        </p>
      </div>
    </>
  );
};

export default Results;
