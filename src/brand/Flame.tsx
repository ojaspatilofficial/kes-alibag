import React from 'react';
import { cn } from '../lib/cn';

/**
 * Four-flame samai glyph from the emblem. Used as list bullet, eyebrow prefix and timeline node.
 * `tone="gold"` draws marigold flames on a bronze lamp; `tone="current"` uses the text colour.
 */
const Flame: React.FC<{ className?: string; tone?: 'gold' | 'current' }> = ({ className, tone = 'gold' }) => {
  const flame = tone === 'gold' ? '#F5B534' : 'currentColor';
  const core = tone === 'gold' ? '#E3123F' : 'currentColor';
  const lamp = tone === 'gold' ? '#C47A0B' : 'currentColor';
  return (
    <svg viewBox="0 0 24 24" className={cn('w-4 h-4 shrink-0', className)} aria-hidden>
      {[4.5, 9.5, 14.5, 19.5].map((x) => (
        <g key={x}>
          <path d={`M${x} 2.5 C${x + 2.1} 5.6 ${x + 2.2} 8.4 ${x} 10.4 C${x - 2.2} 8.4 ${x - 2.1} 5.6 ${x} 2.5 Z`} fill={flame} />
          <path d={`M${x} 6.4 C${x + 0.9} 7.6 ${x + 0.9} 8.8 ${x} 9.7 C${x - 0.9} 8.8 ${x - 0.9} 7.6 ${x} 6.4 Z`} fill={core} opacity={tone === 'gold' ? 0.55 : 0.4} />
        </g>
      ))}
      <path d="M2 12 H22 C22 15.2 17.6 17.4 12 17.4 C6.4 17.4 2 15.2 2 12 Z" fill={lamp} />
      <rect x="10.6" y="17.2" width="2.8" height="3" fill={lamp} />
      <rect x="7" y="20" width="10" height="1.8" rx="0.9" fill={lamp} />
    </svg>
  );
};

export default Flame;
