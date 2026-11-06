import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Clock, Mail, MapPin, Phone } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import Picture from '../brand/Picture';
import MapEmbed from '../components/shared/MapEmbed';
import { identity } from '../data/site';
import { useSettings } from '../lib/content';
import { usePageMeta } from '../lib/meta';

const Office: React.FC = () => {
  usePageMeta('Administrative Office & Training Center', 'The head office of Konkan Education Society: Loknete Adv. Datta Patil Sankul, Alibag, Raigad 402 201.');
  const s = useSettings();
  const rows = [
    { icon: MapPin, label: 'Address', value: [s.head_office, s.street_address, s.city_line].filter(Boolean).join(', ') },
    { icon: Phone, label: 'Phone', value: [s.phone, s.phone_alt].filter(Boolean).join(' · ') },
    { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    s.office_hours ? { icon: Clock, label: 'Office hours', value: s.office_hours } : null,
    { icon: BadgeCheck, label: 'Registration', value: s.registration },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        eyebrow="Head office"
        title="Administrative Office & Training Center"
        description="Loknete Adv. Datta Patil Sankul, Alibag — the home of the Society’s administration."
        crumbs={[{ label: 'About', to: '/about' }]}
      />
      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-start">
          <figure className="rounded-[2rem] bg-white p-2 shadow-soft border border-primary-100 max-w-xl mx-auto w-full">
            <Picture
              src="/images/about/datta-patil-sankul-admin-office"
              alt="Poster of the Loknete Adv. Datta Patil Sankul building, with the Society’s emblem and torch flag"
              sizes="(min-width: 1024px) 36rem, 92vw"
              className="w-full h-auto rounded-[1.6rem]"
            />
            <figcaption className="text-center text-sm text-slate-600 py-3">
              <span lang="mr" className="font-deva">
                लोकनेते ॲड. दत्ता पाटील संकुल
              </span>{' '}
              · Loknete Adv. Datta Patil Sankul
            </figcaption>
          </figure>
          <div>
            <SectionTitle eyebrow={identity.nameMr} title="Visit the head office" />
            <dl className="space-y-5">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-4">
                  <dt className="sr-only">{r.label}</dt>
                  <r.icon size={22} className="text-gold-700 shrink-0 mt-0.5" aria-hidden />
                  <dd>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">{r.label}</span>
                    {r.href ? (
                      <a href={r.href} className="link">
                        {r.value}
                      </a>
                    ) : (
                      <span className="block text-slate-900">{r.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <Link to="/contact" className="btn-primary mt-8">
              Send an enquiry <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        <div className="container-custom mt-12">
          <MapEmbed query={s.map_query} title={`Map showing ${identity.name}, ${identity.place}`} className="!aspect-[16/7] min-h-[300px]" />
        </div>
      </section>
    </>
  );
};

export default Office;
