import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Emblem from './Emblem';
import { cn } from '../lib/cn';

interface FamilyLockupProps {
  emblemSrc: string;
  /** Parent site: "Konkan Education Society, Alibag". Child sites: "A Konkan Education Society institution". */
  title: string;
  /** e.g. "Est. 1917" */
  subtitle?: string;
  /** Child sites: link back to the parent Society website. */
  href?: string;
  linkLabel?: string;
  /** Text colour scheme — `dark` for maroon footers, `light` for white backgrounds. */
  on?: 'dark' | 'light';
  className?: string;
}

/**
 * The K.E.S. Family lockup — emblem + Society name. The parent site uses it in its footer; every child
 * site (school / college) imports it as "A Konkan Education Society institution" with a link back.
 */
const FamilyLockup: React.FC<FamilyLockupProps> = ({ emblemSrc, title, subtitle, href, linkLabel, on = 'dark', className }) => (
  <div className={cn('flex items-center gap-3', className)}>
    <Emblem src={emblemSrc} alt="" className="w-14 h-14" />
    <div className="min-w-0">
      <p className={cn('font-serif font-bold leading-snug', on === 'dark' ? 'text-white' : 'text-primary-900')}>{title}</p>
      {subtitle && (
        <p className={cn('text-[11px] font-bold uppercase tracking-[0.16em]', on === 'dark' ? 'text-gold-300' : 'text-gold-700')}>{subtitle}</p>
      )}
      {href && (
        <a
          href={href}
          className={cn(
            'inline-flex items-center gap-1 text-xs font-semibold mt-1 underline-offset-4 hover:underline',
            on === 'dark' ? 'text-primary-100' : 'text-primary-700'
          )}
        >
          {linkLabel} <ArrowUpRight size={12} aria-hidden />
        </a>
      )}
    </div>
  </div>
);

export default FamilyLockup;
