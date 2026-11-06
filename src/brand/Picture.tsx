import React from 'react';
import { imageEntry } from './images';

interface PictureProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  /** Layout width hint for the browser, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes?: string;
  /** Hero / LCP image: load eagerly with high priority. */
  priority?: boolean;
  pictureClassName?: string;
}

/**
 * Responsive image. Generated images (see `npm run images`) get WebP/AVIF srcsets with their real
 * width/height; uploaded images (full URLs) are shown as-is.
 */
const Picture: React.FC<PictureProps> = ({ src, alt, sizes = '100vw', priority, pictureClassName, ...img }) => {
  const entry = imageEntry(src);
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : undefined;

  if (!entry) {
    return <img src={src} alt={alt} loading={loading} decoding="async" fetchPriority={fetchPriority} {...img} />;
  }
  const set = (ext: string) => entry.widths.map((w) => `${entry.base}-${w}.${ext} ${w}w`).join(', ');
  const fallbackWidth = entry.widths.find((w) => w >= 480) ?? entry.widths[entry.widths.length - 1];
  return (
    <picture className={pictureClassName}>
      {entry.avif && <source type="image/avif" srcSet={set('avif')} sizes={sizes} />}
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${entry.base}-${fallbackWidth}.webp`}
        alt={alt}
        width={entry.width}
        height={entry.height}
        loading={loading}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={fetchPriority}
        {...img}
      />
    </picture>
  );
};

export default Picture;
