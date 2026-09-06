import type { Property } from '../types';

export type Translate = (key: string, values?: Record<string, string | number>) => string;

export interface FacetOption {
  value: string;
  label: string;
  /** True when the property belongs in this option's bucket. */
  match: (property: Property) => boolean;
}

export interface FacetGroup {
  id: string;
  label: string;
  options: FacetOption[];
  /** Options past this index sit behind a "show all" toggle. */
  collapseAfter?: number;
}

/** Checked option values per group id. Options inside a group are OR-ed. */
export type FacetSelection = Record<string, string[]>;

export type PriceRange = [number, number];

const norm = (value: unknown) => String(value ?? '').trim().toLowerCase();

export const propertyPrice = (property: Property) => Number(property.price) || 0;

export const propertyRating = (property: Property) => Number(property.rating) || 0;

export function amenityNames(property: Property): string[] {
  return (property.amenities ?? [])
    .map((amenity) => (typeof amenity === 'string' ? amenity : amenity?.name || amenity?.title || ''))
    .filter(Boolean);
}

const hasAmenity = (property: Property, keyword: string) =>
  amenityNames(property).some((amenity) => norm(amenity).includes(norm(keyword)));

export const propertyProvince = (property: Property) =>
  property.province || property.district || property.location || '';

/** API values that do not map 1:1 onto a translation key. */
const TYPE_KEY_ALIASES: Record<string, string> = { home: 'house', studio: 'studioRoom' };

export function propertyTypeLabel(value: string, t: Translate): string {
  const slug = norm(value);
  const key = `property.${TYPE_KEY_ALIASES[slug] ?? slug}`;
  const label = t(key);
  // `t` echoes the key back when there is no translation for it.
  return label === key ? value.replace(/_/g, ' ') : label;
}

/** Counts distinct string values, biggest bucket first. */
function countBy(properties: Property[], pick: (property: Property) => string[]): string[] {
  const counts = new Map<string, number>();
  properties.forEach((property) => {
    pick(property).forEach((raw) => {
      const value = raw.trim();
      if (!value) return;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([value]) => value);
}

/**
 * Builds the sidebar groups from whatever the catalogue actually contains, so
 * no dead option is ever rendered. Static groups (popular filters, bedrooms,
 * rating) keep their curated order; location and amenity groups are derived.
 */
export function buildFacetGroups(properties: Property[], t: Translate): FacetGroup[] {
  const popular: FacetOption[] = [
    { value: 'featured', label: t('search.popFeatured'), match: (p: Property) => Boolean(p.is_featured) },
    { value: 'top_rated', label: t('search.popTopRated'), match: (p: Property) => propertyRating(p) >= 4.5 },
    { value: 'furnished', label: t('search.popFurnished'), match: (p: Property) => Boolean(p.furnished) || hasAmenity(p, 'furnish') },
    { value: 'pool', label: t('search.popPool'), match: (p: Property) => hasAmenity(p, 'pool') },
    { value: 'wifi', label: t('search.popWifi'), match: (p: Property) => hasAmenity(p, 'wi-fi') || hasAmenity(p, 'wifi') },
    { value: 'aircon', label: t('search.popAircon'), match: (p: Property) => hasAmenity(p, 'air conditioning') },
    { value: 'parking', label: t('search.popParking'), match: (p: Property) => hasAmenity(p, 'parking') },
    { value: 'gym', label: t('search.popGym'), match: (p: Property) => hasAmenity(p, 'gym') || hasAmenity(p, 'fitness') },
  ].filter((option) => properties.some(option.match));

  const types = countBy(properties, (p) => [String(p.property_type ?? '')]);
  const purposes = countBy(properties, (p) => [String(p.purpose ?? p.listing_type ?? '')]);
  const provinces = countBy(properties, (p) => [propertyProvince(p)]);
  const districts = countBy(properties, (p) => [String(p.district ?? '')]);
  const amenities = countBy(properties, amenityNames).slice(0, 12);

  const bedroomOptions: FacetOption[] = [
    { value: '1', label: t('propertyList.1bed'), match: (p: Property) => (p.bedrooms ?? 0) === 1 },
    { value: '2', label: t('propertyList.2beds'), match: (p: Property) => (p.bedrooms ?? 0) === 2 },
    { value: '3', label: t('search.3beds'), match: (p: Property) => (p.bedrooms ?? 0) === 3 },
    { value: '4', label: t('search.4plusBeds'), match: (p: Property) => (p.bedrooms ?? 0) >= 4 },
  ];

  const bathroomOptions: FacetOption[] = [
    { value: '1', label: t('propertyList.1bath'), match: (p: Property) => (p.bathrooms ?? 0) === 1 },
    { value: '2', label: t('search.2baths'), match: (p: Property) => (p.bathrooms ?? 0) === 2 },
    { value: '3', label: t('search.3plusBaths'), match: (p: Property) => (p.bathrooms ?? 0) >= 3 },
  ];

  const ratingOptions: FacetOption[] = [
    { value: '4.5', label: t('search.rating45'), match: (p: Property) => propertyRating(p) >= 4.5 },
    { value: '4', label: t('search.rating40'), match: (p: Property) => propertyRating(p) >= 4 },
    { value: '3.5', label: t('search.rating35'), match: (p: Property) => propertyRating(p) >= 3.5 },
  ];

  const groups: FacetGroup[] = [
    { id: 'popular', label: t('search.popularFilters'), options: popular, collapseAfter: 6 },
    {
      id: 'purpose',
      label: t('propertyList.purpose'),
      options: purposes.map((value) => ({
        value,
        label: value === 'SALE' ? t('propertyList.forSale') : t('propertyList.forRent'),
        match: (p: Property) => String(p.purpose ?? p.listing_type ?? '') === value,
      })),
    },
    {
      id: 'type',
      label: t('propertyList.propertyType'),
      options: types.map((value) => ({
        value,
        label: propertyTypeLabel(value, t),
        match: (p: Property) => String(p.property_type ?? '') === value,
      })),
      collapseAfter: 6,
    },
    {
      id: 'province',
      label: t('search.province'),
      options: provinces.map((value) => ({
        value,
        label: value,
        match: (p: Property) => propertyProvince(p) === value,
      })),
      collapseAfter: 5,
    },
    {
      id: 'district',
      label: t('search.district'),
      options: districts.map((value) => ({
        value,
        label: value,
        match: (p: Property) => String(p.district ?? '') === value,
      })),
      collapseAfter: 6,
    },
    { id: 'bedrooms', label: t('propertyList.bedrooms'), options: bedroomOptions },
    { id: 'bathrooms', label: t('propertyList.bathrooms'), options: bathroomOptions },
    { id: 'rating', label: t('search.guestRating'), options: ratingOptions },
    {
      id: 'amenities',
      label: t('search.amenities'),
      options: amenities.map((value) => ({
        value,
        label: value,
        match: (p: Property) => amenityNames(p).includes(value),
      })),
      collapseAfter: 6,
    },
  ];

  return groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => properties.some(option.match)),
    }))
    .filter((group) => group.options.length > 1 || group.id === 'popular')
    .filter((group) => group.options.length > 0);
}

const groupMatches = (property: Property, group: FacetGroup, chosen: string[]) =>
  chosen.some((value) => group.options.find((option) => option.value === value)?.match(property) ?? false);

/** Groups are AND-ed, options inside one group are OR-ed — like Booking.com. */
export function matchesSelection(
  property: Property,
  groups: FacetGroup[],
  selection: FacetSelection,
  excludeGroupId?: string
): boolean {
  return groups.every((group) => {
    if (group.id === excludeGroupId) return true;
    const chosen = selection[group.id];
    if (!chosen?.length) return true;
    return groupMatches(property, group, chosen);
  });
}

const inPriceRange = (property: Property, [min, max]: PriceRange) => {
  const price = propertyPrice(property);
  return price >= min && price <= max;
};

export function matchesSearchText(property: Property, search: string): boolean {
  const needle = norm(search);
  if (!needle) return true;
  return [property.title, property.address, property.province, property.district, property.location]
    .filter(Boolean)
    .some((field) => norm(field).includes(needle));
}

export interface FilterInput {
  properties: Property[];
  groups: FacetGroup[];
  selection: FacetSelection;
  price: PriceRange;
  search: string;
  /** Destination picked from "Browse by location" or the ?location= param. */
  location?: string;
}

export function applyFilters({
  properties,
  groups,
  selection,
  price,
  search,
  location = '',
}: FilterInput): Property[] {
  return properties.filter(
    (property) =>
      inPriceRange(property, price) &&
      matchesSearchText(property, search) &&
      matchesSearchText(property, location) &&
      matchesSelection(property, groups, selection)
  );
}

/**
 * Count each option against everything *except* its own group, so checking one
 * box never zeroes out its siblings — the count answers "how many results if I
 * also tick this one".
 */
export function countFacets({
  properties,
  groups,
  selection,
  price,
  search,
  location = '',
}: FilterInput): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};

  groups.forEach((group) => {
    const base = properties.filter(
      (property) =>
        inPriceRange(property, price) &&
        matchesSearchText(property, search) &&
        matchesSearchText(property, location) &&
        matchesSelection(property, groups, selection, group.id)
    );
    counts[group.id] = {};
    group.options.forEach((option) => {
      counts[group.id][option.value] = base.filter(option.match).length;
    });
  });

  return counts;
}

/** Result set the budget slider describes: every filter applied but the price. */
export function priceCandidates({
  properties,
  groups,
  selection,
  search,
  location = '',
}: Omit<FilterInput, 'price'>): Property[] {
  return properties.filter(
    (property) =>
      matchesSearchText(property, search) &&
      matchesSearchText(property, location) &&
      matchesSelection(property, groups, selection)
  );
}

export interface PriceBounds {
  min: number;
  max: number;
  step: number;
}

/** Rounded slider bounds so the handles land on readable numbers. */
export function priceBounds(properties: Property[]): PriceBounds {
  const prices = properties.map(propertyPrice).filter((price) => price > 0);
  if (prices.length === 0) return { min: 0, max: 1000, step: 10 };

  const rawMin = Math.min(...prices);
  const rawMax = Math.max(...prices);
  const span = Math.max(rawMax - rawMin, 1);
  const step = span > 5000 ? 100 : span > 1000 ? 50 : span > 200 ? 10 : 5;
  const min = Math.max(0, Math.floor(rawMin / step) * step);
  const max = Math.ceil(rawMax / step) * step;
  return { min, max: max > min ? max : min + step, step };
}

/** Bar heights for the histogram behind the slider, normalised to 0..1. */
export function priceHistogram(properties: Property[], bounds: PriceBounds, buckets = 26): number[] {
  const width = (bounds.max - bounds.min) / buckets || 1;
  const totals = new Array(buckets).fill(0);

  properties.forEach((property) => {
    const price = propertyPrice(property);
    if (price < bounds.min || price > bounds.max) return;
    const index = Math.min(buckets - 1, Math.floor((price - bounds.min) / width));
    totals[index] += 1;
  });

  const peak = Math.max(...totals, 1);
  return totals.map((total) => total / peak);
}

export const SORT_TOP_PICKS = 'top_picks';

export function sortProperties(properties: Property[], sortBy: string): Property[] {
  const list = [...properties];
  const time = (property: Property) =>
    new Date(property.created_at ?? property.published_at ?? property.listed_at ?? 0).getTime();

  switch (sortBy) {
    case 'price_asc':
      return list.sort((a, b) => propertyPrice(a) - propertyPrice(b));
    case 'price_desc':
      return list.sort((a, b) => propertyPrice(b) - propertyPrice(a));
    case 'rating_desc':
      return list.sort((a, b) => propertyRating(b) - propertyRating(a));
    case 'newest':
      return list.sort((a, b) => time(b) - time(a));
    default:
      // Top picks: featured first, then rating, then freshness.
      return list.sort((a, b) => {
        const featured = Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured));
        if (featured !== 0) return featured;
        const rating = propertyRating(b) - propertyRating(a);
        if (rating !== 0) return rating;
        return time(b) - time(a);
      });
  }
}

export function countSelected(selection: FacetSelection): number {
  return Object.values(selection).reduce((total, values) => total + values.length, 0);
}

export function toggleFacet(selection: FacetSelection, groupId: string, value: string): FacetSelection {
  const current = selection[groupId] ?? [];
  const next = current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value];
  const updated = { ...selection, [groupId]: next };
  if (next.length === 0) delete updated[groupId];
  return updated;
}

export function clampRange([low, high]: PriceRange, bounds: PriceBounds): PriceRange {
  // Only the ceiling is enforced. A budget typed below the cheapest listing
  // (say $20 in a catalogue that starts at $2,000) is kept as typed, so the
  // page answers with "no results" instead of quietly widening the filter.
  const min = Math.max(0, Math.min(low, bounds.max));
  const max = Math.max(0, Math.min(high, bounds.max));
  return [Math.min(min, max), Math.max(min, max)];
}
