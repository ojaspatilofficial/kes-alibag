import React, { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import DocumentList from '../components/shared/DocumentList';
import { usePublishedDocuments } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';

const Competition: React.FC = () => {
  const { t } = useI18n();
  usePageMeta('The Ceremony of Glory', 'K.E.S. Inter-school Competition — “The Ceremony of Glory”: results and photographs by year.');
  const docs = usePublishedDocuments();
  const list = useMemo(() => docs.filter((d) => d.type === 'competition').sort((a, b) => b.year.localeCompare(a.year)), [docs]);

  return (
    <>
      <PageHero eyebrow="K.E.S. Inter-school Competition" title="The Ceremony of Glory" crumbs={[{ label: t('nav.publications') }]}>
        <Trophy className="mx-auto mt-6 text-gold-600" size={40} aria-hidden />
      </PageHero>
      <div className="container-custom py-12 md:py-16">
        <SectionTitle eyebrow="By year" title="Results & photographs" />
        <DocumentList docs={list} empty="Results of the Ceremony of Glory will be published here." downloadLabel={t('common.download')} />
      </div>
    </>
  );
};

export default Competition;
