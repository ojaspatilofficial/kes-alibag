import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import Reveal from '../components/shared/Reveal';
import Picture from '../brand/Picture';
import Flame from '../brand/Flame';
import PetalRing from '../brand/PetalRing';
import { history } from '../data/site';
import { useContent } from '../lib/content';
import { usePageMeta } from '../lib/meta';

const Leadership: React.FC = () => {
  usePageMeta('Our Inspiration', 'Loknete Adv. Datta Patil (Dada), Late Hon. Prabhakar Patil (Bhau) and the leaders who inspire Konkan Education Society.');
  const leaders = [...useContent('leaders')].sort((a, b) => a.order - b.order);
  const [first, ...rest] = leaders;

  return (
    <>
      <PageHero eyebrow="Our Inspiration" title="The Leaders Who Lit the Way" crumbs={[{ label: 'About', to: '/about' }]} />

      {first && (
        <section className="section-padding">
          <div className="container-custom grid md:grid-cols-12 gap-10 items-center">
            <Reveal className="md:col-span-5">
              <div className="relative max-w-sm mx-auto">
                <PetalRing className="absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)] text-primary-700 opacity-[0.07]" />
                <div className="relative rounded-[2rem] p-2 bg-white shadow-soft ring-2 ring-gold-300">
                  <Picture src={first.photo_url} alt={`Portrait of ${first.name}`} sizes="(min-width: 768px) 24rem, 85vw" className="w-full aspect-[4/5] object-cover object-top rounded-[1.6rem]" />
                </div>
              </div>
            </Reveal>
            <div className="md:col-span-7">
              <span className="eyebrow">
                <Flame /> {first.label}
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-primary-900 mt-2">{first.name}</h2>
              <p className="text-lg text-slate-700 mt-4 leading-relaxed">{first.line}</p>
              <p className="text-slate-700 mt-4 leading-relaxed">{history.growth[1]}</p>
              <Link to="/about/history" className="btn-secondary mt-6">
                Read our history <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((l, i) => (
              <Reveal as="li" key={l.name} delay={i * 0.06} className="card p-5 flex flex-col">
                <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-[4/5] ring-1 ring-primary-100">
                  <Picture src={l.photo_url} alt={`Portrait of ${l.name}`} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="w-full h-full object-cover object-top" />
                </div>
                <span className="eyebrow mt-5">
                  <Flame /> {l.label}
                </span>
                <h3 className="font-serif font-bold text-xl text-primary-900 mt-1">{l.name}</h3>
                <p className="text-slate-600 mt-2">{l.line}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Leadership;
