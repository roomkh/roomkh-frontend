import type { Property, PropertyFilters } from '../types';

// Mock tourism-area listings used by the /tourism route while the API has no
// TOURISM properties to serve. Shaped exactly like the property card/detail DTO
// so the same components render them without special cases.

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

const gallery = (urls: string[]) =>
  urls.map((url, index) => ({
    id: index + 1,
    url,
    is_cover: index === 0,
    sort_order: index,
  }));

export const mockTourismProperties: Property[] = [
  {
    id: 'tourism-koh-rong-samloem',
    slug: 'tourism-koh-rong-samloem',
    title: 'Saracen Bay Beachfront Bungalow Resort',
    price: 165,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Saracen Bay, Koh Rong Samloem',
    province: 'Preah Sihanouk',
    district: 'Koh Rong Samloem',
    bedrooms: 2,
    bathrooms: 2,
    size_sqm: 85,
    is_featured: true,
    rating: 4.9,
    view_count: 2841,
    cover_image_url: img('photo-1507525428034-b723cf961d3e'),
    images: gallery([
      img('photo-1507525428034-b723cf961d3e'),
      img('photo-1506929562872-bb421503ef21'),
      img('photo-1584132967334-10e028bd69f7'),
      img('photo-1519046904884-53103b34b206'),
    ]),
    description:
      'Wooden bungalows sitting directly on the white sand of Saracen Bay. Wake up to sunrise over the gulf, kayak before breakfast, and watch the bioluminescent plankton after dark. Ferry transfer from Sihanoukville port is included in every booking.',
    amenities: [
      'Private beach access',
      'Air conditioning',
      'Free Wi-Fi',
      'Beachfront restaurant',
      'Kayak & snorkel gear',
      'Ferry transfer included',
      'Airport pickup',
      '24/7 security',
    ],
    latitude: 10.6203,
    longitude: 103.3117,
    owner_name: 'Saracen Bay Retreat',
    phone_number: '+855 12 884 210',
    telegram_username: 'saracenbayretreat',
    created_at: '2026-08-28T08:15:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-koh-rong-long-set',
    slug: 'tourism-koh-rong-long-set',
    title: 'Long Set Beach Dive & Snorkel Lodge',
    price: 96,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Long Set (4K) Beach, Koh Rong',
    province: 'Preah Sihanouk',
    district: 'Koh Rong',
    bedrooms: 1,
    bathrooms: 1,
    size_sqm: 42,
    is_featured: false,
    rating: 4.6,
    view_count: 1620,
    cover_image_url: img('photo-1509233725247-49e657c54213'),
    images: gallery([
      img('photo-1509233725247-49e657c54213'),
      img('photo-1544551763-46a013bb70d5'),
      img('photo-1552465011-b4e21bf6e79a'),
      img('photo-1519046904884-53103b34b206'),
    ]),
    description:
      'A small dive lodge at the quiet end of 4K Beach, run by PADI instructors. Two boat dives leave every morning for the reefs around Koh Kon, and the shaded hammock deck is where everyone ends up in the afternoon.',
    amenities: [
      'PADI dive centre',
      'Snorkel trips',
      'Free Wi-Fi',
      'Ceiling fan & mosquito net',
      'Beach bar',
      'Longtail boat transfer',
      'Laundry service',
    ],
    latitude: 10.7264,
    longitude: 103.3113,
    owner_name: 'Koh Rong Dive Co.',
    phone_number: '+855 96 771 448',
    telegram_username: 'kohrongdive',
    created_at: '2026-08-21T04:40:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-siem-reap-angkor-villa',
    slug: 'tourism-siem-reap-angkor-villa',
    title: 'Angkor Heritage Boutique Villa',
    price: 210,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Wat Bo Road, Salakamreuk',
    province: 'Siem Reap',
    district: 'Siem Reap City',
    bedrooms: 3,
    bathrooms: 3,
    size_sqm: 180,
    is_featured: true,
    rating: 4.8,
    view_count: 3975,
    cover_image_url: img('photo-1528181304800-259b08848526'),
    images: gallery([
      img('photo-1528181304800-259b08848526'),
      img('photo-1563492065599-3520f775eeed'),
      img('photo-1512918728675-ed5a9ecdebfd'),
      img('photo-1571896349842-33c89424de2d'),
    ]),
    description:
      'A restored Khmer wooden villa ten minutes from the Angkor ticket gate. Teak floors, a saltwater pool in the garden, and a guide on call for sunrise at Angkor Wat and the temple loop through Bayon and Ta Prohm.',
    amenities: [
      'Saltwater pool',
      'Air conditioning',
      'Free Wi-Fi',
      'Daily breakfast',
      'Temple guide on call',
      'Tuk-tuk service',
      'Bicycle rental',
      'Airport pickup',
    ],
    latitude: 13.3556,
    longitude: 103.8592,
    owner_name: 'Heritage Angkor Stays',
    phone_number: '+855 63 966 122',
    telegram_username: 'heritageangkor',
    created_at: '2026-09-01T02:10:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-kampot-riverside',
    slug: 'tourism-kampot-riverside',
    title: 'Kampot Riverside Eco Lodge',
    price: 74,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Teuk Chhou Riverside, Kampot',
    province: 'Kampot',
    district: 'Teuk Chhou',
    bedrooms: 2,
    bathrooms: 1,
    size_sqm: 68,
    is_featured: false,
    rating: 4.7,
    view_count: 1284,
    cover_image_url: img('photo-1520250497591-112f2f40a3f4'),
    images: gallery([
      img('photo-1520250497591-112f2f40a3f4'),
      img('photo-1439066615861-d1af74d74000'),
      img('photo-1611892440504-42a792e24d32'),
      img('photo-1441974231531-c6227db76b6e'),
    ]),
    description:
      'Timber cabins on the Teuk Chhou river with Bokor mountain filling the view. Paddleboards are free for guests, the pepper farms are a short ride upriver, and dinner is served on the floating deck.',
    amenities: [
      'Riverfront deck',
      'Free paddleboards',
      'Free Wi-Fi',
      'Ceiling fan',
      'Pepper farm tour',
      'Restaurant & bar',
      'Motorbike rental',
    ],
    latitude: 10.6104,
    longitude: 104.1319,
    owner_name: 'Teuk Chhou Eco Lodge',
    phone_number: '+855 88 442 907',
    telegram_username: 'teukchhoulodge',
    created_at: '2026-08-14T09:25:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-kep-seaside-villa',
    slug: 'tourism-kep-seaside-villa',
    title: 'Kep Seaside Pool Villa',
    price: 145,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Crab Market Road, Kep',
    province: 'Kep',
    district: 'Kep City',
    bedrooms: 3,
    bathrooms: 2,
    size_sqm: 140,
    is_featured: true,
    rating: 4.8,
    view_count: 2107,
    cover_image_url: img('photo-1582719508461-905c673771fd'),
    images: gallery([
      img('photo-1582719508461-905c673771fd'),
      img('photo-1566073771259-6a8506099945'),
      img('photo-1600585154340-be6161a56a0c'),
      img('photo-1519046904884-53103b34b206'),
    ]),
    description:
      'A modern villa on the hillside above the Kep crab market, with an infinity pool pointed at the sunset and Phu Quoc on the horizon. Rabbit Island boats leave from the pier five minutes downhill.',
    amenities: [
      'Infinity pool',
      'Sea view terrace',
      'Air conditioning',
      'Free Wi-Fi',
      'Full kitchen',
      'Private parking',
      'Boat trip to Rabbit Island',
      '24/7 security',
    ],
    latitude: 10.4831,
    longitude: 104.3011,
    owner_name: 'Kep Coast Villas',
    phone_number: '+855 17 320 664',
    telegram_username: 'kepcoastvillas',
    created_at: '2026-08-30T11:05:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-bokor-mountain-lodge',
    slug: 'tourism-bokor-mountain-lodge',
    title: 'Bokor Cloud Forest Mountain Lodge',
    price: 118,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Preah Monivong Bokor National Park',
    province: 'Kampot',
    district: 'Bokor',
    bedrooms: 2,
    bathrooms: 2,
    size_sqm: 96,
    is_featured: false,
    rating: 4.5,
    view_count: 1533,
    cover_image_url: img('photo-1470071459604-3b5ec3a7fe05'),
    images: gallery([
      img('photo-1470071459604-3b5ec3a7fe05'),
      img('photo-1519681393784-d120267933ba'),
      img('photo-1508739773434-c26b3d09e071'),
      img('photo-1441974231531-c6227db76b6e'),
    ]),
    description:
      'A stone lodge 1,000 m up inside Bokor National Park, where the cloud line rolls through the pines most afternoons. Cool enough for a fireplace at night and dark enough to see the Milky Way from the terrace.',
    amenities: [
      'Mountain view terrace',
      'Fireplace',
      'Free Wi-Fi',
      'Heated water',
      'Guided hiking trails',
      'Restaurant',
      'Private parking',
    ],
    latitude: 10.6417,
    longitude: 104.0361,
    owner_name: 'Bokor Highland Retreats',
    phone_number: '+855 92 118 305',
    telegram_username: 'bokorhighland',
    created_at: '2026-08-09T06:50:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-mondulkiri-waterfall',
    slug: 'tourism-mondulkiri-waterfall',
    title: 'Sen Monorom Waterfall Jungle Retreat',
    price: 88,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Bou Sra Waterfall Road, Sen Monorom',
    province: 'Mondulkiri',
    district: 'Sen Monorom',
    bedrooms: 2,
    bathrooms: 1,
    size_sqm: 72,
    is_featured: false,
    rating: 4.7,
    view_count: 1176,
    cover_image_url: img('photo-1432405972618-c60b0225b8f9'),
    images: gallery([
      img('photo-1432405972618-c60b0225b8f9'),
      img('photo-1441974231531-c6227db76b6e'),
      img('photo-1611892440504-42a792e24d32'),
      img('photo-1439066615861-d1af74d74000'),
    ]),
    description:
      'Two cabins in the hills outside Sen Monorom, a short walk from the falls. The retreat works with the local elephant sanctuary, so guests can join a half-day walk with the herd instead of riding.',
    amenities: [
      'Waterfall access',
      'Elephant sanctuary visit',
      'Free Wi-Fi in lobby',
      'Hot water',
      'Campfire pit',
      'Home-cooked meals',
      'Trekking guide',
    ],
    latitude: 12.4567,
    longitude: 107.1876,
    owner_name: 'Mondulkiri Jungle Retreat',
    phone_number: '+855 78 664 190',
    telegram_username: 'mondulkirijungle',
    created_at: '2026-08-05T03:30:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-otres-beach-resort',
    slug: 'tourism-otres-beach-resort',
    title: 'Otres Beach Ocean Cliff Resort',
    price: 132,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Otres 2, Sihanoukville',
    province: 'Preah Sihanouk',
    district: 'Sihanoukville',
    bedrooms: 1,
    bathrooms: 1,
    size_sqm: 55,
    is_featured: true,
    rating: 4.4,
    view_count: 2650,
    cover_image_url: img('photo-1540541338287-41700207dee6'),
    images: gallery([
      img('photo-1540541338287-41700207dee6'),
      img('photo-1559827260-dc66d52bef19'),
      img('photo-1502680390469-be75c86b636f'),
      img('photo-1582719508461-905c673771fd'),
    ]),
    description:
      'Cliffside rooms above Otres 2 with a pool that runs to the edge of the headland. Ten minutes to the port for island ferries and close enough to walk the whole beach strip after dinner.',
    amenities: [
      'Cliffside infinity pool',
      'Sea view balcony',
      'Air conditioning',
      'Free Wi-Fi',
      'Beach club access',
      'Airport shuttle',
      'Gym',
      '24/7 reception',
    ],
    latitude: 10.5906,
    longitude: 103.5175,
    owner_name: 'Otres Coast Resorts',
    phone_number: '+855 15 902 337',
    telegram_username: 'otrescoast',
    created_at: '2026-09-03T07:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-ratanakiri-crater-lake',
    slug: 'tourism-ratanakiri-crater-lake',
    title: 'Yeak Laom Crater Lake Cabin',
    price: 62,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Yeak Laom Commune, Banlung',
    province: 'Ratanakiri',
    district: 'Banlung',
    bedrooms: 1,
    bathrooms: 1,
    size_sqm: 38,
    is_featured: false,
    rating: 4.6,
    view_count: 894,
    cover_image_url: img('photo-1439066615861-d1af74d74000'),
    images: gallery([
      img('photo-1439066615861-d1af74d74000'),
      img('photo-1441974231531-c6227db76b6e'),
      img('photo-1508739773434-c26b3d09e071'),
      img('photo-1611892440504-42a792e24d32'),
    ]),
    description:
      'A single cabin a few minutes from the Yeak Laom volcanic crater lake, where the water stays clear all year. Gem mines, Ka Chanh waterfall and the Banlung market are all within a short ride.',
    amenities: [
      'Crater lake access',
      'Free Wi-Fi',
      'Ceiling fan',
      'Hot water',
      'Breakfast included',
      'Motorbike rental',
      'Local guide',
    ],
    latitude: 13.7318,
    longitude: 107.0106,
    owner_name: 'Banlung Lake Cabins',
    phone_number: '+855 97 553 728',
    telegram_username: 'banlunglake',
    created_at: '2026-07-29T05:45:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-koh-kong-cardamom',
    slug: 'tourism-koh-kong-cardamom',
    title: 'Tatai River Cardamom Eco Resort',
    price: 158,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Tatai River, Cardamom Mountains',
    province: 'Koh Kong',
    district: 'Thma Bang',
    bedrooms: 2,
    bathrooms: 2,
    size_sqm: 90,
    is_featured: false,
    rating: 4.9,
    view_count: 1402,
    cover_image_url: img('photo-1566073771259-6a8506099945'),
    images: gallery([
      img('photo-1566073771259-6a8506099945'),
      img('photo-1432405972618-c60b0225b8f9'),
      img('photo-1441974231531-c6227db76b6e'),
      img('photo-1600585154340-be6161a56a0c'),
    ]),
    description:
      'Solar-powered tented villas on the Tatai river at the edge of the Cardamom rainforest. Boat access only, with night safaris, a swim under Tatai waterfall, and no phone signal to speak of.',
    amenities: [
      'Riverfront villa',
      'Boat transfer included',
      'Solar power',
      'All meals included',
      'Kayaks',
      'Night wildlife safari',
      'Waterfall trip',
    ],
    latitude: 11.5253,
    longitude: 103.1447,
    owner_name: 'Cardamom River Camp',
    phone_number: '+855 71 800 214',
    telegram_username: 'cardamomcamp',
    created_at: '2026-08-18T10:20:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-preah-vihear-temple',
    slug: 'tourism-preah-vihear-temple',
    title: 'Preah Vihear Temple View Guesthouse',
    price: 54,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Sra Em, Preah Vihear',
    province: 'Preah Vihear',
    district: 'Choam Ksant',
    bedrooms: 1,
    bathrooms: 1,
    size_sqm: 34,
    is_featured: false,
    rating: 4.3,
    view_count: 733,
    cover_image_url: img('photo-1563492065599-3520f775eeed'),
    images: gallery([
      img('photo-1563492065599-3520f775eeed'),
      img('photo-1528181304800-259b08848526'),
      img('photo-1508739773434-c26b3d09e071'),
      img('photo-1611892440504-42a792e24d32'),
    ]),
    description:
      'A simple guesthouse in Sra Em, the closest base to the Preah Vihear temple on the escarpment. Rooms are plain but cool, and the owner arranges the 4x4 up the mountain road at sunrise.',
    amenities: [
      'Air conditioning',
      'Free Wi-Fi',
      'Breakfast included',
      '4x4 temple transfer',
      'Free parking',
      'Laundry service',
    ],
    latitude: 14.3892,
    longitude: 104.6807,
    owner_name: 'Sra Em Guesthouse',
    phone_number: '+855 69 274 851',
    telegram_username: 'sraemstay',
    created_at: '2026-07-24T08:05:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'tourism-kirirom-pine-chalet',
    slug: 'tourism-kirirom-pine-chalet',
    title: 'Kirirom Pine Forest Chalet',
    price: 105,
    currency: 'USD',
    price_unit: 'NIGHT',
    purpose: 'RENT',
    property_type: 'TOURISM',
    address: 'Kirirom National Park, Phnom Sruoch',
    province: 'Kampong Speu',
    district: 'Phnom Sruoch',
    bedrooms: 3,
    bathrooms: 2,
    size_sqm: 120,
    is_featured: false,
    rating: 4.5,
    view_count: 1958,
    cover_image_url: img('photo-1441974231531-c6227db76b6e'),
    images: gallery([
      img('photo-1441974231531-c6227db76b6e'),
      img('photo-1470071459604-3b5ec3a7fe05'),
      img('photo-1519681393784-d120267933ba'),
      img('photo-1611892440504-42a792e24d32'),
    ]),
    description:
      'A family chalet under the pines in Kirirom, two hours from Phnom Penh. Cool evenings, mountain-bike trails from the door, and a barbecue pit on the deck for the whole group.',
    amenities: [
      'Pine forest setting',
      'BBQ deck',
      'Free Wi-Fi',
      'Full kitchen',
      'Mountain bikes',
      'Free parking',
      'Family friendly',
      'Campfire pit',
    ],
    latitude: 11.3167,
    longitude: 104.05,
    owner_name: 'Kirirom Chalets',
    phone_number: '+855 10 447 620',
    telegram_username: 'kiriromchalets',
    created_at: '2026-08-25T12:35:00Z',
    status: 'ACTIVE',
  },
];

const matchesLocation = (property: Property, location: string) => {
  const needle = location.trim().toLowerCase();
  if (!needle) return true;
  return [property.address, property.province, property.district, property.title]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(needle));
};

const matchesPriceRange = (property: Property, priceRange: string) => {
  if (!priceRange) return true;
  const [min, max] = priceRange.split('-').map(Number);
  const price = property.price ?? 0;
  return price >= (min || 0) && (Number.isFinite(max) ? price <= max : true);
};

/**
 * Applies the property list page filters client-side. `bedrooms`/`bathrooms`
 * behave like the API: the highest option ("3", "2") means "that many or more".
 */
export function filterMockTourismProperties(
  filters: PropertyFilters = {},
  sortBy = 'newest'
): Property[] {
  const { location = '', propertyType = '', purpose = '', priceRange = '' } = filters;
  const bedrooms = Number(filters.bedrooms) || 0;
  const bathrooms = Number(filters.bathrooms) || 0;

  const results = mockTourismProperties.filter((property) => {
    if (propertyType && propertyType !== property.property_type) return false;
    if (purpose && purpose !== property.purpose) return false;
    if (!matchesLocation(property, String(location))) return false;
    if (!matchesPriceRange(property, String(priceRange))) return false;
    if (bedrooms && (property.bedrooms ?? 0) < bedrooms) return false;
    if (bathrooms && (property.bathrooms ?? 0) < bathrooms) return false;
    return true;
  });

  return results.sort((a, b) => {
    if (sortBy === 'price_asc') return (a.price ?? 0) - (b.price ?? 0);
    if (sortBy === 'price_desc') return (b.price ?? 0) - (a.price ?? 0);
    return (
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    );
  });
}

export function getMockTourismProperty(idOrSlug?: string | number): Property | undefined {
  if (!idOrSlug) return undefined;
  const key = String(idOrSlug);
  return mockTourismProperties.find(
    (property) => String(property.id) === key || property.slug === key
  );
}

export function getMockTourismSimilar(idOrSlug?: string | number): Property[] {
  const key = String(idOrSlug ?? '');
  return mockTourismProperties.filter(
    (property) => String(property.id) !== key && property.slug !== key
  );
}
