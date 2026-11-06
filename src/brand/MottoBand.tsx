import React from 'react';
import PetalRing from './PetalRing';
import Flame from './Flame';

interface MottoBandProps {
  motto: string;
  meaning: string;
  /** Optional regional-language gloss shown between the motto and the English meaning. */
  gloss?: string;
  label?: string;
}

/** Sanskrit motto set large on deep maroon, with its meaning below. */
const MottoBand: React.FC<MottoBandProps> = ({ motto, meaning, gloss, label }) => (
  <section className="relative overflow-hidden bg-primary-900 text-white py-16 md:py-20" aria-label={label || 'Motto'}>
    <PetalRing className="absolute -left-24 top-1/2 -translate-y-1/2 w-80 h-80 text-gold-400 opacity-[0.07]" />
    <PetalRing className="absolute -right-24 top-1/2 -translate-y-1/2 w-80 h-80 text-gold-400 opacity-[0.07]" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
    <div className="container-custom relative text-center">
      <Flame className="w-10 h-10 mx-auto mb-5" />
      <p lang="sa" className="font-motto text-2xl sm:text-3xl md:text-[2.6rem] leading-relaxed text-gold-300">
        {motto}
      </p>
      {gloss && (
        <p lang="mr" className="font-deva text-sm sm:text-base text-primary-100/90 mt-4">
          {gloss}
        </p>
      )}
      <p className="text-sm sm:text-base text-primary-100 mt-3 italic">“{meaning}”</p>
    </div>
  </section>
);

export default MottoBand;
