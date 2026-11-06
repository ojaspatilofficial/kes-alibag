import React from 'react';
import Picture from '../../brand/Picture';
import PetalRing from '../../brand/PetalRing';
import Emblem from '../../brand/Emblem';

/** Magazine cover: the uploaded cover image, or a generated cover (emblem + title + year) until one is uploaded. */
const MagazineCover: React.FC<{ title: string; subtitle?: string; year: string; cover?: string; emblemSrc: string; publisher: string }> = ({
  title,
  subtitle,
  year,
  cover,
  emblemSrc,
  publisher,
}) =>
  cover ? (
    <Picture src={cover} alt={`Cover of ${title} ${year}`} className="w-full aspect-[3/4] object-cover rounded-lg shadow-card" />
  ) : (
    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-b from-primary-800 to-primary-950 text-white shadow-card flex flex-col items-center justify-between p-5 text-center">
      <PetalRing className="absolute -bottom-16 -right-16 w-56 h-56 text-gold-400 opacity-[0.12]" />
      <div className="absolute inset-2 border border-gold-400/40 rounded" aria-hidden />
      <span className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300 mt-2">{publisher}</span>
      <div className="relative">
        <Emblem src={emblemSrc} alt="" className="w-16 h-16 mx-auto mb-3" sizes="64px" />
        <span className="block font-serif font-black text-3xl tracking-wide">{title}</span>
        {subtitle && (
          <span lang="mr" className="block font-deva text-gold-300 text-sm mt-1">
            {subtitle}
          </span>
        )}
      </div>
      <span className="relative font-serif text-xl font-bold text-gold-300 mb-2">{year}</span>
    </div>
  );

export default MagazineCover;
