import React from 'react';
import Picture from '../../brand/Picture';
import { cn } from '../../lib/cn';

interface PortraitProps {
  name: string;
  role: string;
  photo: string;
  /** Extra line under the role (leaders). */
  line?: string;
  size?: 'lg' | 'md';
  sizes?: string;
  className?: string;
}

/** Portrait in a 4:5 frame with a thin gold ring on hover. */
const Portrait: React.FC<PortraitProps> = ({ name, role, photo, line, size = 'md', sizes = '(min-width: 1024px) 25vw, 50vw', className }) => (
  <figure className={cn('group text-center', className)}>
    <div className="relative rounded-3xl p-1.5 bg-white shadow-card ring-1 ring-primary-100 group-hover:ring-2 group-hover:ring-gold-400 transition-all duration-300">
      <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-slate-100">
        {photo ? (
          <Picture
            src={photo}
            alt={`Portrait of ${name}`}
            sizes={sizes}
            className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-serif text-4xl text-primary-300" aria-hidden>
            {name.replace(/^(Late |Hon\. |Adv\. |Loknete )+/g, '').charAt(0)}
          </div>
        )}
      </div>
    </div>
    <figcaption className="mt-4 px-1">
      <span className={cn('block font-serif font-bold text-primary-900 leading-snug', size === 'lg' ? 'text-lg md:text-xl' : 'text-base')}>{name}</span>
      <span className="block text-xs font-bold uppercase tracking-[0.14em] text-gold-700 mt-1.5">{role}</span>
      {line && <span className="block text-sm text-slate-600 mt-2 leading-relaxed">{line}</span>}
    </figcaption>
  </figure>
);

export default Portrait;
