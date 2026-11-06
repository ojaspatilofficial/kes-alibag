import React, { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

/**
 * Google Maps embed (lazy iframe with a title). With `defer`, the iframe is created only when the
 * visitor presses "Show map" — used on the home page to keep it light on slow mobile networks.
 */
const MapEmbed: React.FC<{ query: string; title: string; className?: string; defer?: boolean }> = ({ query, title, className, defer = false }) => {
  const [show, setShow] = useState(!defer);
  const q = encodeURIComponent(query);
  return (
    <div className={`relative rounded-3xl overflow-hidden border border-gold-200 shadow-card bg-primary-50 aspect-[4/3] ${className || ''}`}>
      {show ? (
        <iframe
          title={title}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center bg-heritage-pattern [background-size:18px_18px]">
          <span className="w-14 h-14 rounded-full bg-white text-primary-700 shadow-card flex items-center justify-center">
            <MapPin size={26} aria-hidden />
          </span>
          <p className="text-sm text-slate-700 max-w-xs">{query}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setShow(true)} className="btn-primary !py-2.5">
              Show map
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${q}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-2.5 bg-white"
            >
              Open in Google Maps <ExternalLink size={14} aria-hidden />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapEmbed;
