import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import Picture from '../brand/Picture';
import { imageUrl } from '../brand/images';
import ArchivePhoto from '../brand/ArchivePhoto';
import { useContent } from '../lib/content';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';
import type { GalleryItem } from '../data/types';

const Lightbox: React.FC<{ items: GalleryItem[]; index: number; onClose: () => void; onMove: (i: number) => void }> = ({ items, index, onClose, onMove }) => {
  const item = items[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onMove((index - 1 + items.length) % items.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [index, items.length, onClose, onMove]);

  return (
    <div role="dialog" aria-modal="true" aria-label={item.title} className="fixed inset-0 z-[9999] bg-primary-950/95 flex flex-col">
      <div className="flex items-center justify-between p-3 text-white">
        <p className="text-sm px-2">
          {index + 1} / {items.length}
        </p>
        <button autoFocus onClick={onClose} className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Close">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center gap-2 px-2 min-h-0">
        <button onClick={() => onMove((index - 1 + items.length) % items.length)} className="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous photo">
          <ChevronLeft size={24} />
        </button>
        <figure className="flex-1 h-full flex flex-col items-center justify-center min-w-0">
          <img
            src={imageUrl(item.image_url, 1600)}
            alt={item.description || item.title}
            className={`max-h-[75vh] max-w-full object-contain rounded-lg ${item.is_archive ? 'sepia-[0.5]' : ''}`}
          />
          <figcaption className="text-center text-white mt-4 px-4">
            <span className="block font-serif font-bold">{item.title}</span>
            {item.description && <span className="block text-sm text-primary-100 mt-1 max-w-2xl">{item.description}</span>}
          </figcaption>
        </figure>
        <button onClick={() => onMove((index + 1) % items.length)} className="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next photo">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const { t } = useI18n();
  usePageMeta('Gallery', 'Photographs from the Konkan Education Society archive and of the Society’s head office, emblem and flag.');
  const gallery = useContent('gallery');
  const items = useMemo(() => [...gallery].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [gallery]);
  const albums = useMemo(() => [...new Set(items.map((i) => i.album))], [items]);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <PageHero eyebrow="Photographs" title={t('nav.gallery')} description="Moments from the K.E.S. archive. New albums from our schools and colleges will be added here." />
      <div className="container-custom py-12 md:py-16 space-y-16">
        {albums.map((album) => {
          const list = items.filter((i) => i.album === album);
          return (
            <section key={album} aria-labelledby={`al-${album}`}>
              <SectionTitle id={`al-${album}`} eyebrow={`${list.length} photographs`} title={album} />
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((item) => {
                  const idx = items.indexOf(item);
                  return (
                    <li key={item.id || item.image_url}>
                      <button type="button" onClick={() => setOpen(idx)} className="block w-full text-left rounded-sm" aria-label={`Open photo: ${item.title}`}>
                        {item.is_archive ? (
                          <ArchivePhoto src={item.image_url} alt={item.description || item.title} caption={item.title} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" />
                        ) : (
                          <figure className="card !rounded-2xl p-3 h-full">
                            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-brand-cream flex items-center justify-center">
                              <Picture src={item.image_url} alt={item.description || item.title} sizes="(min-width: 1024px) 30vw, 92vw" className="max-h-full max-w-full object-contain" />
                            </div>
                            <figcaption className="text-sm font-semibold text-slate-800 mt-3 px-1">{item.title}</figcaption>
                          </figure>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      {open !== null && items[open] && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onMove={setOpen} />}
    </>
  );
};

export default Gallery;
