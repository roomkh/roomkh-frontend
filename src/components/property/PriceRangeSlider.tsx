import { useEffect, useState } from 'react';
import type { PriceRange } from '../../utils/propertyFacets';

const digits = (raw: string) => raw.replace(/[^\d]/g, '');

const THUMB =
  'pointer-events-none absolute inset-x-0 top-0 h-4 w-full appearance-none bg-transparent ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none ' +
  '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full ' +
  '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0070c0] ' +
  '[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab ' +
  '[&::-webkit-slider-thumb]:active:cursor-grabbing ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 ' +
  '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 ' +
  '[&::-moz-range-thumb]:border-[#0070c0] [&::-moz-range-thumb]:cursor-grab ' +
  'focus:outline-none';

/**
 * Two-handle budget slider with the price histogram behind it. Bars inside the
 * selected range stay blue so the distribution reads at a glance, exactly like
 * the booking-style budget filter.
 */
export default function PriceRangeSlider({
  min,
  max,
  step,
  value,
  histogram,
  onChange,
  formatValue,
  label,
  ariaMinLabel,
  ariaMaxLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: PriceRange;
  histogram: number[];
  onChange: (next: PriceRange) => void;
  formatValue: (price: number) => string;
  label: string;
  ariaMinLabel: string;
  ariaMaxLabel: string;
}) {
  const [low, high] = value;
  // Typed values are kept as text while editing so a half-finished number
  // ("2" on the way to "20") is never clamped out from under the visitor.
  const [draft, setDraft] = useState({ low: String(low), high: String(high) });

  useEffect(() => {
    setDraft({ low: String(low), high: String(high) });
  }, [low, high]);

  // Commit on blur/Enter. Unlike the handles, a typed number is not snapped to
  // `step`, so exact budgets such as $20 stay reachable even when the
  // catalogue's span makes the slider move in hundreds.
  const commit = (field: 'low' | 'high') => {
    const raw = digits(draft[field]);
    if (raw === '') {
      setDraft({ low: String(low), high: String(high) });
      return;
    }

    // Floored at $0 rather than at `min`: a visitor may look for something
    // cheaper than anything currently listed, and an empty result is a more
    // honest answer than silently raising their budget.
    const typed = Math.min(Math.max(Number(raw), 0), max);
    // A typed bound pushes the other one along rather than being clamped by it:
    // asking for a $20 maximum should lower the minimum too, not be ignored.
    const next: PriceRange =
      field === 'low' ? [typed, Math.max(typed, high)] : [Math.min(typed, low), typed];
    setDraft({ low: String(next[0]), high: String(next[1]) });
    if (next[0] !== low || next[1] !== high) onChange(next);
  };

  const span = Math.max(max - min, 1);
  // Clamped so a typed budget outside the catalogue's range still parks the
  // handle on the track instead of off the end of it.
  const toPercent = (price: number) => Math.min(100, Math.max(0, ((price - min) / span) * 100));

  const bucketWidth = span / (histogram.length || 1);
  const inRange = (index: number) => {
    const start = min + index * bucketWidth;
    return start + bucketWidth > low && start < high;
  };

  const setLow = (next: number) => onChange([Math.min(next, high - step), high]);
  const setHigh = (next: number) => onChange([low, Math.max(next, low + step)]);

  return (
    <div>
      <p className="text-xs font-bold text-gray-800">{label}</p>
      <p className="text-xs text-gray-600 mt-1.5 font-medium">
        {formatValue(low)} &ndash; {formatValue(high)}
        {high >= max && '+'}
      </p>

      {/* Typed budget: the handles are coarse, these are exact. */}
      <div className="flex items-end gap-2 mt-2 mb-2.5">
        {(['low', 'high'] as const).map((field) => (
          <label key={field} className="flex-1 min-w-0">
            <span className="block text-[11px] font-medium text-gray-500 mb-1">
              {field === 'low' ? ariaMinLabel : ariaMaxLabel}
            </span>
            <span className="relative block">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={draft[field]}
                aria-label={field === 'low' ? ariaMinLabel : ariaMaxLabel}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [field]: digits(event.target.value) }))
                }
                onBlur={() => commit(field)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    event.currentTarget.blur();
                  }
                }}
                className="w-full pl-5 pr-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 tabular-nums outline-none focus:border-[#0070c0] transition"
              />
            </span>
          </label>
        ))}
      </div>

      {/* Histogram */}
      <div className="flex items-end gap-[2px] h-12 px-0.5" aria-hidden="true">
        {histogram.map((height, index) => (
          <span
            key={index}
            className={`flex-1 rounded-t-[2px] transition-colors ${
              inRange(index) ? 'bg-[#0070c0]/70' : 'bg-gray-200'
            }`}
            style={{ height: `${Math.max(height * 100, 6)}%` }}
          />
        ))}
      </div>

      {/* Track + handles */}
      <div className="relative h-4 mt-1.5">
        <span className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-1 rounded-full bg-gray-200" />
        <span
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-[#0070c0]"
          style={{ left: `${toPercent(low)}%`, right: `${100 - toPercent(high)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          aria-label={ariaMinLabel}
          onChange={(event) => setLow(Number(event.target.value))}
          className={THUMB}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          aria-label={ariaMaxLabel}
          onChange={(event) => setHigh(Number(event.target.value))}
          className={THUMB}
        />
      </div>
    </div>
  );
}
