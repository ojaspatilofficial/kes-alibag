import React, { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { LayoutList, MapPin, Search, X } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import { CategoryIcon, InstitutionCard } from '../components/shared/InstitutionBits';
import { categories, categoryByKey } from '../data/categories';
import { identity } from '../data/site';
import type { Institution } from '../data/types';
import { useInstitutions } from '../lib/content';
import { matchScore } from '../lib/search';
import { usePageMeta } from '../lib/meta';
import { useI18n } from '../i18n';
import { cn } from '../lib/cn';
import NotFound from './NotFound';

const Institutions: React.FC = () => {
  const { t } = useI18n();
  const { category: pathCategory } = useParams();
  const [params, setParams] = useSearchParams();
  const all = useInstitutions();

  const landing = pathCategory ? categoryByKey(pathCategory) : undefined;
  const q = params.get('q') || '';
  const category = landing?.key || params.get('category') || '';
  const district = params.get('district') || '';
  const medium = params.get('medium') || '';
  const jr = params.get('jr') === '1';
  const view = params.get('view') === 'town' ? 'town' : 'list';

  usePageMeta(
    pathCategory && !landing ? 'Page not found' : landing ? landing.label : 'Find an Institution',
    landing
      ? `${landing.label} run by ${identity.name}, ${identity.place}. ${landing.description}`
      : `Search all ${all.length} listed K.E.S. schools and colleges by name, town, type, medium and district.`
  );

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const list: { i: Institution; score: number }[] = [];
    for (const i of all) {
      if (category && i.category !== category) continue;
      if (district && i.district !== district) continue;
      if (medium && i.medium !== medium) continue;
      if (jr && !i.hasJuniorCollege) continue;
      const score = q ? matchScore(q, `${i.name} ${i.town} ${i.district}`) : 1;
      if (score) list.push({ i, score });
    }
    if (q) list.sort((a, b) => b.score - a.score);
    return list.map((x) => x.i);
  }, [all, q, category, district, medium, jr]);

  const groups = useMemo(() => {
    if (view === 'town') {
      const m = new Map<string, Institution[]>();
      for (const i of results) {
        const town = i.town.split(',')[0].replace(/\s*\(.*\)$/, '');
        m.set(town, [...(m.get(town) || []), i]);
      }
      return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([title, items]) => ({ key: title, title, items }));
    }
    return categories
      .map((c) => ({ key: c.key, title: c.label, items: results.filter((i) => i.category === c.key) }))
      .filter((g) => g.items.length);
  }, [results, view]);

  if (pathCategory && !landing) return <NotFound />;

  const filtersActive = Boolean(q || (!landing && category) || district || medium || jr);
  const districts = identity.districts;
  const qs = params.toString() ? `?${params}` : '';

  return (
    <>
      <PageHero
        eyebrow={landing ? t('nav.institutions') : `${all.length} institutions listed · 100+ in the K.E.S. family`}
        title={landing ? landing.label : t('nav.find')}
        description={landing ? landing.description : 'Search by name or town, or narrow down by type, medium and district. Each card links to the institution’s own website or profile.'}
        crumbs={landing ? [{ label: t('nav.institutions'), to: '/institutions' }] : []}
      />

      <div className="container-custom py-10 md:py-14">
        {/* Filters */}
        <section aria-label="Search and filters" className="card !rounded-[1.75rem] p-5 md:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder={t('finder.placeholder')}
                aria-label={t('finder.placeholder')}
                className="form-input !pl-11 !py-3 !rounded-full !text-base"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-3">
              <label className="sr-only" htmlFor="f-medium">
                Medium
              </label>
              <select id="f-medium" value={medium} onChange={(e) => update({ medium: e.target.value })} className="form-input !rounded-full sm:!w-40">
                <option value="">Any medium</option>
                <option value="English">English medium</option>
                <option value="Marathi">Marathi medium</option>
              </select>
              <label className="sr-only" htmlFor="f-district">
                {t('finder.district')}
              </label>
              <select id="f-district" value={district} onChange={(e) => update({ district: e.target.value })} className="form-input !rounded-full sm:!w-44">
                <option value="">{t('finder.allDistricts')}</option>
                {districts.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <label className="col-span-2 inline-flex items-center gap-2.5 px-4 min-h-[44px] rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-700 cursor-pointer select-none whitespace-nowrap">
                <input type="checkbox" className="w-5 h-5 accent-primary-700" checked={jr} onChange={(e) => update({ jr: e.target.checked ? '1' : null })} />
                Has Junior College
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Institution type">
            {landing ? (
              <>
                <Link to={`/institutions${qs}`} className="chip chip-idle">
                  All types
                </Link>
                {categories.map((c) => (
                  <Link key={c.key} to={`/institutions/${c.key}${qs}`} aria-current={c.key === category ? 'page' : undefined} className={cn('chip', c.key === category ? 'chip-active' : 'chip-idle')}>
                    {c.short}
                  </Link>
                ))}
              </>
            ) : (
              <>
                <button type="button" aria-pressed={!category} onClick={() => update({ category: null })} className={cn('chip', !category ? 'chip-active' : 'chip-idle')}>
                  All types
                </button>
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.key}
                    aria-pressed={category === c.key}
                    onClick={() => update({ category: category === c.key ? null : c.key })}
                    className={cn('chip', category === c.key ? 'chip-active' : 'chip-idle')}
                  >
                    {c.short}
                  </button>
                ))}
              </>
            )}
          </div>
        </section>

        {/* Summary + view toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-slate-700" role="status" aria-live="polite">
            Showing <strong className="text-primary-800">{results.length}</strong> of {landing ? all.filter((i) => i.category === landing.key).length : all.length}
            {filtersActive && (
              <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="ml-3 inline-flex items-center gap-1 text-primary-700 font-semibold hover:underline min-h-[44px]">
                <X size={14} aria-hidden /> Clear filters
              </button>
            )}
          </p>
          <div className="inline-flex rounded-full bg-white border border-slate-200 p-1" role="group" aria-label="View">
            <button
              type="button"
              aria-pressed={view === 'list'}
              onClick={() => update({ view: null })}
              className={cn('inline-flex items-center gap-1.5 px-4 min-h-[40px] rounded-full text-sm font-semibold', view === 'list' ? 'bg-primary-700 text-white' : 'text-slate-700')}
            >
              <LayoutList size={15} aria-hidden /> List
            </button>
            <button
              type="button"
              aria-pressed={view === 'town'}
              onClick={() => update({ view: 'town' })}
              className={cn('inline-flex items-center gap-1.5 px-4 min-h-[40px] rounded-full text-sm font-semibold', view === 'town' ? 'bg-primary-700 text-white' : 'text-slate-700')}
            >
              <MapPin size={15} aria-hidden /> By town
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="card p-10 md:p-14 text-center">
            <p className="font-serif text-xl font-bold text-primary-900">No institutions match these filters</p>
            <p className="text-slate-600 mt-2">Try a different spelling of the town, or clear the filters to see all institutions.</p>
            <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="btn-primary mt-6">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map((g) => (
              <section key={g.key} aria-labelledby={`g-${g.key}`}>
                <h2 id={`g-${g.key}`} className="flex items-center gap-3 font-serif font-bold text-xl md:text-2xl text-primary-900 mb-5">
                  {view === 'list' ? (
                    <CategoryIcon category={g.key as Institution['category']} className="w-10 h-10 rounded-xl" size={18} />
                  ) : (
                    <MapPin className="text-gold-700" size={22} aria-hidden />
                  )}
                  <span>{g.title}</span>
                  <span className="text-sm font-sans font-semibold text-slate-600 bg-white border border-slate-200 rounded-full px-2.5 py-0.5">{g.items.length}</span>
                </h2>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {g.items.map((i) => (
                    <li key={i.slug}>
                      <InstitutionCard institution={i} showCategory={view === 'town' || !landing} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="mt-12 text-sm text-slate-600 bg-gold-50 border border-gold-200 rounded-2xl p-5">
          The Society runs 100+ institutions in Raigad, Thane and Sindhudurg. This list is being completed — if you cannot find an institution,{' '}
          <Link to="/contact" className="link">
            contact the head office
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default Institutions;
