import React from 'react';
import { cn } from '../lib/cn';

interface PetalRingProps {
  className?: string;
  /** Number of outer petals (the emblem has 16). */
  petals?: number;
  /** Slowly rotate (stops automatically when the visitor prefers reduced motion). */
  spin?: boolean;
  /** Draw the inner ring of small petals too. */
  inner?: boolean;
  title?: string;
}

/**
 * Lotus petal ring echoing the K.E.S. emblem. Uses `currentColor`, so colour and opacity come from the
 * parent's text colour (e.g. `text-gold-400 opacity-[0.06]`). Decorative unless a `title` is given.
 */
const PetalRing: React.FC<PetalRingProps> = ({ className, petals = 16, spin = false, inner = true, title }) => {
  const step = 360 / petals;
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn(spin && 'motion-safe:animate-spin-slow', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      {Array.from({ length: petals }, (_, i) => (
        <path key={i} d="M100 2 C113 18 115 33 100 42 C85 33 87 18 100 2 Z" transform={`rotate(${i * step} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="3" />
      {inner &&
        Array.from({ length: petals }, (_, i) => (
          <path
            key={`i${i}`}
            d="M100 50 C106 58 107 66 100 74 C93 66 94 58 100 50 Z"
            transform={`rotate(${i * step + step / 2} 100 100)`}
            opacity="0.7"
          />
        ))}
      <circle cx="100" cy="100" r="22" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
    </svg>
  );
};

export default PetalRing;
