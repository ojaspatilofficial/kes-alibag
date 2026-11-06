import React from 'react';
import Flame from '../../brand/Flame';
import { cn } from '../../lib/cn';

interface SectionTitleProps {
  title: string;
  eyebrow?: string;
  description?: string;
  center?: boolean;
  light?: boolean;
  id?: string;
  className?: string;
  action?: React.ReactNode;
}

/** Eyebrow (with flame) + serif heading + crimson-to-gold rule. */
const SectionTitle: React.FC<SectionTitleProps> = ({ title, eyebrow, description, center = false, light = false, id, className, action }) => (
  <div className={cn('mb-10', center && 'text-center', action && 'md:flex md:items-end md:justify-between md:gap-6', className)}>
    <div className={cn(center && 'mx-auto max-w-3xl')}>
      {eyebrow && (
        <span className={cn('eyebrow mb-2', light && '!text-gold-300')}>
          <Flame className="w-4 h-4" /> {eyebrow}
        </span>
      )}
      <h2 id={id} className={cn('text-3xl md:text-4xl font-serif font-bold leading-tight', light ? 'text-white' : 'text-primary-900')}>
        {title}
      </h2>
      <div className={cn('h-1 w-20 rounded-full bg-gradient-to-r from-primary-600 to-gold-400 mt-4', center && 'mx-auto')} />
      {description && <p className={cn('mt-4 text-base leading-relaxed', light ? 'text-primary-100' : 'text-slate-600')}>{description}</p>}
    </div>
    {action && <div className="mt-5 md:mt-0 shrink-0">{action}</div>}
  </div>
);

export default SectionTitle;
