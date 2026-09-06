import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Names stay in English because the backend matches the location filter with a
// case-insensitive LIKE against province/district/commune, which are stored in
// English. The Khmer name is only used for display and for matching what the
// user types, and `aliases` cover common alternate spellings.
type Destination = { name: string; nameKm: string; aliases?: string[] };

// All 25 provinces / municipalities of Cambodia. The capital leads, the rest
// are alphabetical.
const DESTINATIONS: Destination[] = [
  { name: 'Phnom Penh', nameKm: 'ភ្នំពេញ' },
  { name: 'Banteay Meanchey', nameKm: 'បន្ទាយមានជ័យ', aliases: ['Poipet', 'Sisophon'] },
  { name: 'Battambang', nameKm: 'បាត់ដំបង' },
  { name: 'Kampong Cham', nameKm: 'កំពង់ចាម' },
  { name: 'Kampong Chhnang', nameKm: 'កំពង់ឆ្នាំង' },
  { name: 'Kampong Speu', nameKm: 'កំពង់ស្ពឺ' },
  { name: 'Kampong Thom', nameKm: 'កំពង់ធំ' },
  { name: 'Kampot', nameKm: 'កំពត' },
  { name: 'Kandal', nameKm: 'កណ្ដាល', aliases: ['Ta Khmau'] },
  { name: 'Kep', nameKm: 'កែប' },
  { name: 'Koh Kong', nameKm: 'កោះកុង' },
  { name: 'Kratie', nameKm: 'ក្រចេះ', aliases: ['Kracheh'] },
  { name: 'Mondulkiri', nameKm: 'មណ្ឌលគិរី', aliases: ['Sen Monorom'] },
  { name: 'Oddar Meanchey', nameKm: 'ឧត្តរមានជ័យ', aliases: ['Samraong'] },
  { name: 'Pailin', nameKm: 'ប៉ៃលិន' },
  { name: 'Preah Sihanouk', nameKm: 'ព្រះសីហនុ', aliases: ['Sihanoukville', 'Kampong Som', 'Koh Rong'] },
  { name: 'Preah Vihear', nameKm: 'ព្រះវិហារ' },
  { name: 'Prey Veng', nameKm: 'ព្រៃវែង' },
  { name: 'Pursat', nameKm: 'ពោធិ៍សាត់', aliases: ['Pouthisat'] },
  { name: 'Ratanakiri', nameKm: 'រតនគិរី', aliases: ['Banlung'] },
  { name: 'Siem Reap', nameKm: 'សៀមរាប', aliases: ['Angkor'] },
  { name: 'Stung Treng', nameKm: 'ស្ទឹងត្រែង' },
  { name: 'Svay Rieng', nameKm: 'ស្វាយរៀង' },
  { name: 'Takeo', nameKm: 'តាកែវ', aliases: ['Takeo Province'] },
  { name: 'Tboung Khmum', nameKm: 'ត្បូងឃ្មុំ', aliases: ['Suong'] },
];

export default function DestinationInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return DESTINATIONS;
    return DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.nameKm.includes(value.trim()) ||
        d.aliases?.some((alias) => alias.toLowerCase().includes(query))
    );
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const selectDestination = (name: string) => {
    onChange(name);
    setOpen(false);
    setHighlighted(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      setHighlighted(-1);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (matches.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlighted((prev) => (prev + step + matches.length) % matches.length);
      return;
    }
    // Let Enter submit the search form unless an option is actively highlighted.
    if (event.key === 'Enter' && open && highlighted >= 0 && matches[highlighted]) {
      event.preventDefault();
      selectDestination(matches[highlighted].name);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`relative flex items-center bg-white rounded-lg px-3 py-2.5 border-2 transition ${
          open ? 'border-amber-400' : 'border-transparent hover:bg-blue-50'
        }`}
      >
        <Search className="w-4 h-4 text-[#0070c0] flex-shrink-0 mr-2" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder ?? t('hero.whereAreYouGoing')}
          className="w-full text-base font-normal text-gray-900 bg-transparent outline-none placeholder:text-gray-500"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHighlighted(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && matches.length > 0 && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 max-h-72 overflow-y-auto"
        >
          <p className="px-4 py-1.5 text-xs font-semibold text-gray-500">
            {t('hero.allProvinces')}
          </p>
          {matches.map((destination, index) => (
            <button
              key={destination.name}
              type="button"
              role="option"
              aria-selected={index === highlighted}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => selectDestination(destination.name)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition cursor-pointer ${
                index === highlighted ? 'bg-gray-50' : ''
              }`}
            >
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="min-w-0">
                <span className="block text-base font-normal text-gray-900 truncate">
                  {destination.name}
                </span>
                <span className="block text-[11px] text-gray-500 truncate">
                  {language === 'km'
                    ? `${destination.nameKm} · ${t('dest.cambodia')}`
                    : t('dest.cambodia')}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
