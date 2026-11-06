import React from 'react';
import PetalRing from './PetalRing';

/** Loading indicator: a slowly turning petal ring (static when reduced motion is preferred). */
const LotusLoader: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500" role="status">
    <PetalRing className="w-12 h-12 text-primary-600 motion-safe:animate-spin-loader" inner={false} />
    <span className="text-sm">{label}</span>
  </div>
);

export default LotusLoader;
