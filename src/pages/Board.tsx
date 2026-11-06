import React from 'react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import Reveal from '../components/shared/Reveal';
import Portrait from '../components/shared/Portrait';
import { useContent } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import type { BoardGroup } from '../data/types';

const groups: { key: BoardGroup; eyebrow: string; title: string; cols: string; size: 'lg' | 'md'; sizes: string }[] = [
  { key: 'office-bearer', eyebrow: 'Office-bearers', title: 'President, Vice-President & Secretary', cols: 'grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto', size: 'lg', sizes: '(min-width: 768px) 300px, 45vw' },
  { key: 'director', eyebrow: 'Directors', title: 'Board of Directors', cols: 'grid-cols-2 lg:grid-cols-4', size: 'md', sizes: '(min-width: 1024px) 22vw, 45vw' },
  { key: 'administration', eyebrow: 'Administration', title: 'Executive Officers', cols: 'grid-cols-2 max-w-2xl mx-auto', size: 'md', sizes: '(min-width: 768px) 300px, 45vw' },
];

const Board: React.FC = () => {
  usePageMeta('Board of Directors', 'The office-bearers, directors and executive officers of Konkan Education Society, Alibag.');
  const members = [...useContent('boardMembers')].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero eyebrow="Governance" title="Board of Directors" description="The elected office-bearers and directors who guide the Society, and the officers who run its administration." crumbs={[{ label: 'About', to: '/about' }]} />
      {groups.map((g, gi) => {
        const list = members.filter((m) => m.group === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key} className={gi % 2 ? 'section-padding bg-white border-y border-primary-100/70' : 'section-padding'} aria-labelledby={`b-${g.key}`}>
            <div className="container-custom">
              <SectionTitle id={`b-${g.key}`} center eyebrow={g.eyebrow} title={g.title} />
              <ul className={`grid gap-6 md:gap-8 ${g.cols}`}>
                {list.map((m, i) => (
                  <Reveal as="li" key={m.name} delay={i * 0.05} className={g.key === 'office-bearer' && i === 2 ? 'col-span-2 md:col-span-1 w-1/2 md:w-auto mx-auto' : ''}>
                    <Portrait name={m.name} role={m.role} photo={m.photo_url} size={g.size} sizes={g.sizes} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default Board;
