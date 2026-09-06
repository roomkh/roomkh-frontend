import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, Rows3, SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from '../../../components/property/FilterSidebar';
import PropertyCard from '../../../components/property/PropertyCard';
import PropertyListRow from '../../../components/property/PropertyListRow';
import SelectDropdown from '../../../components/common/SelectDropdown';
import SearchPageSkeleton from '../../../components/skeletons/SearchPageSkeleton';
import { getAllProperties } from '../../../service/api';
import { mockTourismProperties } from '../../../data/mockTourismProperties';
import { useLanguage } from '../../../context/LanguageContext';
import {
  SORT_TOP_PICKS,
  applyFilters,
  clampRange,
  buildFacetGroups,
  countFacets,
  countSelected,
  priceBounds,
  priceCandidates,
  priceHistogram,
  sortProperties,
  toggleFacet,
} from '../../../utils/propertyFacets';
import type { FacetSelection, PriceRange } from '../../../utils/propertyFacets';
import type { Property } from '../../../types';

const FACET_PARAM_PREFIX = 'f.';
const VALUE_SEPARATOR = '|';

function parseSelection(params: URLSearchParams): FacetSelection {
  const selection: FacetSelection = {};
  params.forEach((value, key) => {
    if (!key.startsWith(FACET_PARAM_PREFIX) || !value) return;
    selection[key.slice(FACET_PARAM_PREFIX.length)] = value.split(VALUE_SEPARATOR).filter(Boolean);
  });
  return selection;
}

export default function SearchPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);

  const [rawSelection, setRawSelection] = useState<FacetSelection>(() => parseSelection(searchParams));
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') ?? SORT_TOP_PICKS);
  const [view, setView] = useState<'list' | 'grid'>(() =>
    searchParams.get('view') === 'grid' ? 'grid' : 'list'
  );
  // `null` until the visitor drags a handle, so the budget keeps tracking the
  // catalogue bounds instead of freezing at load-time numbers.
  const [price, setPrice] = useState<PriceRange | null>(() => {
    const min = searchParams.get('min');
    const max = searchParams.get('max');
    return min !== null && max !== null ? [Number(min), Number(max)] : null;
  });
  const [location, setLocation] = useState(() => searchParams.get('location') ?? '');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAllProperties()
      .then((data) => {
        if (cancelled) return;
        const list = data as Property[];
        // The catalogue is empty on a fresh backend, so fall back to the sample
        // listings rather than showing an empty filter rail.
        setUsingSample(list.length === 0);
        setProperties(list.length === 0 ? mockTourismProperties : list);
      })
      .catch(() => {
        if (cancelled) return;
        setUsingSample(true);
        setProperties(mockTourismProperties);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => buildFacetGroups(properties, t), [properties, t]);

  // Drop facet values that this catalogue has no option for, otherwise a stale
  // shared link would filter every listing away.
  const selection = useMemo<FacetSelection>(() => {
    if (groups.length === 0) return rawSelection;
    const next: FacetSelection = {};
    Object.entries(rawSelection).forEach(([groupId, values]) => {
      const group = groups.find((entry) => entry.id === groupId);
      const kept = group
        ? values.filter((value) => group.options.some((option) => option.value === value))
        : [];
      if (kept.length > 0) next[groupId] = kept;
    });
    return next;
  }, [rawSelection, groups]);

  // Everything except the budget itself: what the slider describes and rescales to.
  const candidates = useMemo(
    () => priceCandidates({ properties, groups, selection, search, location }),
    [properties, groups, selection, search, location]
  );
  const bounds = useMemo(() => priceBounds(candidates), [candidates]);
  const activePrice = useMemo<PriceRange>(
    () => (price ? clampRange(price, bounds) : [bounds.min, bounds.max]),
    [price, bounds]
  );
  const histogram = useMemo(() => priceHistogram(candidates, bounds), [candidates, bounds]);

  const filterInput = useMemo(
    () => ({ properties, groups, selection, price: activePrice, search, location }),
    [properties, groups, selection, activePrice, search, location]
  );

  const results = useMemo(
    () => sortProperties(applyFilters(filterInput), sortBy),
    [filterInput, sortBy]
  );
  const counts = useMemo(() => countFacets(filterInput), [filterInput]);

  const selectedCount = countSelected(selection);
  const priceNarrowed = activePrice[0] > bounds.min || activePrice[1] < bounds.max;
  const activeCount =
    selectedCount + (priceNarrowed ? 1 : 0) + (search ? 1 : 0) + (location ? 1 : 0);

  // Keep the URL shareable: it always describes what is on screen.
  useEffect(() => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    Object.entries(selection).forEach(([groupId, values]) => {
      if (values.length > 0) params.set(`${FACET_PARAM_PREFIX}${groupId}`, values.join(VALUE_SEPARATOR));
    });
    if (search) params.set('q', search);
    if (sortBy !== SORT_TOP_PICKS) params.set('sort', sortBy);
    if (view !== 'list') params.set('view', view);
    if (price && priceNarrowed) {
      params.set('min', String(activePrice[0]));
      params.set('max', String(activePrice[1]));
    }
    setSearchParams(params, { replace: true });
  }, [selection, search, sortBy, view, price, priceNarrowed, activePrice, location, setSearchParams]);

  const handleToggleFacet = useCallback(
    (groupId: string, value: string) => {
      setRawSelection(toggleFacet(selection, groupId, value));
    },
    [selection]
  );

  const handleClearAll = useCallback(() => {
    setRawSelection({});
    setPrice(null);
    setSearch('');
    setLocation('');
  }, []);

  const SORT_OPTIONS = [
    { value: SORT_TOP_PICKS, label: t('search.sortTopPicks') },
    { value: 'price_asc', label: t('propertyList.priceLowToHigh') },
    { value: 'price_desc', label: t('propertyList.priceHighToLow') },
    { value: 'rating_desc', label: t('search.sortRating') },
    { value: 'newest', label: t('propertyList.newest') },
  ];

  const chosenProvinces = selection.province ?? [];
  const place =
    location || (chosenProvinces.length === 1 ? chosenProvinces[0] : t('search.allCambodia'));

  const chips = [
    ...Object.entries(selection).flatMap(([groupId, values]) =>
      values.map((value) => {
        const group = groups.find((entry) => entry.id === groupId);
        const option = group?.options.find((entry) => entry.value === value);
        return {
          key: `${groupId}:${value}`,
          label: option?.label ?? value,
          onRemove: () => handleToggleFacet(groupId, value),
        };
      })
    ),
    ...(priceNarrowed
      ? [
          {
            key: 'price',
            label: `$${activePrice[0].toLocaleString()} – $${activePrice[1].toLocaleString()}`,
            onRemove: () => setPrice(null),
          },
        ]
      : []),
    ...(location
      ? [{ key: 'location', label: location, onRemove: () => setLocation('') }]
      : []),
    ...(search
      ? [{ key: 'search', label: `“${search}”`, onRemove: () => setSearch('') }]
      : []),
  ];

  const sidebar = (
    <FilterSidebar
      groups={groups}
      counts={counts}
      selection={selection}
      onToggleFacet={handleToggleFacet}
      bounds={bounds}
      price={activePrice}
      histogram={histogram}
      onPriceChange={setPrice}
      search={search}
      onSearchChange={setSearch}
      onClearAll={handleClearAll}
      selectedCount={activeCount}
    />
  );

  if (loading) return <SearchPageSkeleton />;

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link to="/" className="flex items-center gap-1 hover:text-[#0070c0] transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('propertyList.home')}</span>
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-gray-800">{t('search.title')}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 pr-1">
              {sidebar}
            </div>
          </aside>

          {/* Results */}
          <section className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {t('search.resultsTitle', { place, count: results.length.toLocaleString() })}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t('search.showingOf', { total: properties.length.toLocaleString() })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white border border-gray-200 rounded-full p-0.5">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    aria-pressed={view === 'list'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      view === 'list' ? 'bg-[#0070c0] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Rows3 className="w-3.5 h-3.5" />
                    {t('search.list')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('grid')}
                    aria-pressed={view === 'grid'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      view === 'grid' ? 'bg-[#0070c0] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    {t('search.grid')}
                  </button>
                </div>

                <SelectDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  align="right"
                  ariaLabel={t('propertyList.sortBy')}
                  triggerClassName="bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:border-gray-300"
                  panelClassName="w-56"
                />
              </div>
            </div>

            {usingSample && (
              <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                {t('search.sampleData')}
              </p>
            )}

            {/* Mobile filter trigger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-2.5 text-xs font-bold text-gray-800 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0070c0]" />
              {t('search.filters')}
              {activeCount > 0 && (
                <span className="bg-[#0070c0] text-white rounded-full px-1.5 py-0.5 text-[10px]">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Active filter chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="flex items-center gap-1.5 bg-[#0070c0]/10 text-[#0070c0] text-[11px] font-bold rounded-full pl-3 pr-2 py-1.5 hover:bg-[#0070c0]/20 transition cursor-pointer"
                  >
                    {chip.label}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-bold text-gray-500 hover:text-[#0070c0] underline cursor-pointer"
                >
                  {t('search.clearAll')}
                </button>
              </div>
            )}

            {results.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
                <p className="text-sm font-bold text-gray-800">{t('search.noResults')}</p>
                <p className="text-xs text-gray-500 mt-1">{t('search.noResultsHint')}</p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="mt-4 bg-[#0070c0] hover:bg-[#005da1] text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  {t('search.clearFilters')}
                </button>
              </div>
            ) : view === 'list' ? (
              <div className="space-y-4">
                {results.map((property) => (
                  <PropertyListRow key={property.id || property.slug} property={property} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((property) => (
                  <PropertyCard key={property.id || property.slug} property={property} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto w-[88%] max-w-sm bg-gray-50 h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <span className="text-sm font-extrabold text-gray-900">{t('search.filters')}</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={t('search.close')}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{sidebar}</div>
            <div className="p-4 bg-white border-t border-gray-200">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-[#0070c0] hover:bg-[#005da1] text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer"
              >
                {t('search.showResults', { count: results.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
