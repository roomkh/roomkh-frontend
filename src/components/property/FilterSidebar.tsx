import { useState } from 'react';
import { Check, ChevronDown, RotateCcw, Search } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';
import { useLanguage } from '../../context/LanguageContext';
import type { FacetGroup, FacetSelection, PriceBounds, PriceRange } from '../../utils/propertyFacets';

function FacetCheckbox({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
}) {
  // A zero-count option can still be unticked, never newly ticked.
  const disabled = count === 0 && !checked;

  return (
    <label
      className={`flex items-center gap-2.5 py-[7px] group ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
      />
      <span
        className={`w-[18px] h-[18px] flex-shrink-0 rounded border-2 flex items-center justify-center transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#0070c0]/40 ${
          checked
            ? 'bg-[#0070c0] border-[#0070c0]'
            : `border-gray-300 bg-white ${disabled ? '' : 'group-hover:border-[#0070c0]'}`
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}
      </span>
      <span className="flex-1 min-w-0 text-xs font-medium text-gray-700 leading-snug">{label}</span>
      <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{count}</span>
    </label>
  );
}

function FacetGroupSection({
  group,
  counts,
  selected,
  onToggle,
}: {
  group: FacetGroup;
  counts: Record<string, number>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const limit = group.collapseAfter ?? group.options.length;
  const visible = expanded ? group.options : group.options.slice(0, limit);
  const hiddenCount = group.options.length - visible.length;

  return (
    <div className="border-t border-gray-100 px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 cursor-pointer group"
      >
        <span className="text-xs font-bold text-gray-800">{group.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform group-hover:text-gray-600 ${
            open ? '' : '-rotate-90'
          }`}
        />
      </button>

      {open && (
        <div className="mt-1.5">
          {visible.map((option) => (
            <FacetCheckbox
              key={option.value}
              label={option.label}
              count={counts[option.value] ?? 0}
              checked={selected.includes(option.value)}
              onToggle={() => onToggle(option.value)}
            />
          ))}

          {(hiddenCount > 0 || expanded) && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-1 text-[11px] font-bold text-[#0070c0] hover:underline cursor-pointer"
            >
              {expanded
                ? t('search.showLess')
                : t('search.showAll', { count: group.options.length })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Booking-style filter rail: every control applies immediately and each option
 * carries the number of listings it would return.
 */
export default function FilterSidebar({
  groups,
  counts,
  selection,
  onToggleFacet,
  bounds,
  price,
  histogram,
  onPriceChange,
  search,
  onSearchChange,
  onClearAll,
  selectedCount,
}: {
  groups: FacetGroup[];
  counts: Record<string, Record<string, number>>;
  selection: FacetSelection;
  onToggleFacet: (groupId: string, value: string) => void;
  bounds: PriceBounds;
  price: PriceRange;
  histogram: number[];
  onPriceChange: (next: PriceRange) => void;
  search: string;
  onSearchChange: (next: string) => void;
  onClearAll: () => void;
  selectedCount: number;
}) {
  const { t } = useLanguage();
  const formatPrice = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold text-gray-900">{t('search.filterBy')}</h2>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1 text-[11px] font-bold text-[#0070c0] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {t('search.clearAll')}
            </button>
          )}
        </div>

        {/* Free-text search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t('search.searchPlaceholder')}
              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-[#0070c0] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="border-t border-gray-100 px-4 py-3">
          <PriceRangeSlider
            min={bounds.min}
            max={bounds.max}
            step={bounds.step}
            value={price}
            histogram={histogram}
            onChange={onPriceChange}
            formatValue={formatPrice}
            label={t('search.yourBudget')}
            ariaMinLabel={t('search.minBudget')}
            ariaMaxLabel={t('search.maxBudget')}
          />
        </div>

        {groups.map((group) => (
          <FacetGroupSection
            key={group.id}
            group={group}
            counts={counts[group.id] ?? {}}
            selected={selection[group.id] ?? []}
            onToggle={(value) => onToggleFacet(group.id, value)}
          />
        ))}
      </div>
    </div>
  );
}
