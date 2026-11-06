import React from 'react';
import Picture from './Picture';
import { cn } from '../lib/cn';

/**
 * The emblem in a white disc with a gold ring (the source art has a white background).
 * Minimum size: 32px. Keep a clear space of at least ¼ of the diameter around it.
 */
const Emblem: React.FC<{ src: string; alt: string; className?: string; ring?: boolean; sizes?: string; priority?: boolean }> = ({
  src,
  alt,
  className,
  ring = true,
  sizes = '64px',
  priority,
}) => (
  <span
    className={cn(
      'inline-flex items-center justify-center rounded-full bg-white overflow-hidden shrink-0 p-[3%] shadow-md',
      ring && 'border-2 border-gold-300',
      className
    )}
  >
    <Picture src={src} alt={alt} sizes={sizes} priority={priority} className="w-full h-full object-contain" pictureClassName="contents" />
  </span>
);

export default Emblem;
