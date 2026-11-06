import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Fades and slides content up the first time it scrolls into view (IntersectionObserver + CSS, so no
 * animation library is needed on first load). Visitors who prefer reduced motion see content immediately.
 */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }> = ({
  children,
  delay = 0,
  className,
  as = 'div',
}) => {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(reducedMotion);

  useEffect(() => {
    const el = ref.current;
    if (shown || !el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  const Tag = as as 'div';
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('transition-[opacity,transform] duration-500 ease-out', shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4', className)}
      style={delay && shown ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
