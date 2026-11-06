import React from 'react';
import Picture from './Picture';
import { cn } from '../lib/cn';

interface ArchivePhotoProps {
  src: string;
  alt: string;
  caption?: string;
  /** Small label under the photo, e.g. "From the K.E.S. archive". */
  label?: string;
  sizes?: string;
  className?: string;
  tilt?: 'left' | 'right' | 'none';
}

/**
 * Old film scans shown like printed photographs: warm sepia tone, cream border, small caption.
 * Never stretch these full-bleed at full opacity.
 */
const ArchivePhoto: React.FC<ArchivePhotoProps> = ({ src, alt, caption, label, sizes = '(min-width: 768px) 33vw, 100vw', className, tilt = 'none' }) => (
  <figure
    className={cn(
      'archive-photo transition-transform duration-300 hover:rotate-0',
      tilt === 'left' && 'md:-rotate-1',
      tilt === 'right' && 'md:rotate-1',
      className
    )}
  >
    <Picture src={src} alt={alt} sizes={sizes} className="w-full aspect-[16/10] object-cover" />
    <figcaption className="absolute left-3 right-3 bottom-1.5 flex items-baseline justify-between gap-2 text-[11px] leading-tight">
      {caption && <span className="text-slate-700 font-medium line-clamp-1">{caption}</span>}
      {label && <span className="text-gold-700 font-semibold italic shrink-0">{label}</span>}
    </figcaption>
  </figure>
);

export default ArchivePhoto;
