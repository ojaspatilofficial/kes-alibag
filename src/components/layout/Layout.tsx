import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LotusLoader from '../../brand/LotusLoader';
import { useI18n } from '../../i18n';
import { useInstitutions, useSettings } from '../../lib/content';
import { identity } from '../../data/site';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
};

/** JSON-LD EducationalOrganization for search engines, with every institution that has a website. */
const OrgJsonLd: React.FC = () => {
  const settings = useSettings();
  const institutions = useInstitutions();
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: identity.name,
      alternateName: [`${identity.shortName} ${identity.place}`, identity.nameMr],
      url: window.location.origin,
      logo: `${window.location.origin}/images/brand/kes-emblem-474.webp`,
      foundingDate: String(identity.founded),
      slogan: identity.brandLine,
      email: settings.email,
      telephone: ['+91 2141 222105', settings.phone_alt].filter(Boolean),
      address: {
        '@type': 'PostalAddress',
        streetAddress: [settings.head_office, settings.street_address].filter(Boolean).join(', '),
        addressLocality: 'Alibag',
        addressRegion: 'Maharashtra',
        postalCode: '402201',
        addressCountry: 'IN',
      },
      award: `${identity.award}, ${identity.awardBy}, ${identity.awardYear}`,
      subOrganization: institutions
        .filter((i) => i.website)
        .map((i) => ({
          '@type': i.category === 'homoeopathic-medical' || i.category === 'senior-college' ? 'CollegeOrUniversity' : 'School',
          name: i.name,
          url: i.website,
          address: { '@type': 'PostalAddress', addressLocality: i.town, addressRegion: `${i.district}, Maharashtra`, addressCountry: 'IN' },
        })),
    };
    let el = document.getElementById('org-jsonld') as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'org-jsonld';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }, [settings, institutions]);
  return null;
};

const Layout: React.FC = () => {
  const { t } = useI18n();
  const settings = useSettings();
  return (
    <>
      <ScrollToTop />
      <OrgJsonLd />
      <a href="#main" className="skip-link">
        {t('header.skip')}
      </a>
      <div className="flex flex-col min-h-screen bg-brand-light text-slate-800">
        {settings.announcement && (
          <div className="bg-gold-400 text-primary-950 text-sm font-medium text-center px-4 py-2" role="status">
            {settings.announcement}
          </div>
        )}
        <Header />
        <main id="main" tabIndex={-1} className="flex-grow outline-none">
          <Suspense fallback={<div className="min-h-screen"><LotusLoader /></div>}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
