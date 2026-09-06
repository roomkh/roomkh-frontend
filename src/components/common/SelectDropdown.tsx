import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  /** Secondary line under the label, like the country in a destination list. */
  hint?: string;
  icon?: ReactNode;
}

/**
 * Replacement for native `<select>` so every dropdown in the app shares the
 * same panel: white card, rounded, bold labels, hover row, check on the
 * selected option. The trigger keeps whatever look its host page needs, so
 * pass the classes the old `<select>` used via `triggerClassName`.
 */
export default function SelectDropdown({
  value,
  onChange,
  options,
  placeholder,
  heading,
  triggerClassName = '',
  chevronClassName = 'text-gray-400',
  placeholderClassName = '',
  panelClassName = '',
  align = 'left',
  ariaLabel,
  disabled = false,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  heading?: string;
  triggerClassName?: string;
  chevronClassName?: string;
  placeholderClassName?: string;
  panelClassName?: string;
  align?: 'left' | 'right';
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value]
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const openPanel = () => {
    setHighlighted(selectedIndex);
    setOpen(true);
  };

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
    setHighlighted(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === 'Escape') {
      setOpen(false);
      setHighlighted(-1);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openPanel();
        return;
      }
      if (options.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlighted((prev) => {
        const from = prev < 0 ? (step === 1 ? -1 : 0) : prev;
        return (from + step + options.length) % options.length;
      });
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && open) {
      if (highlighted >= 0 && options[highlighted]) {
        event.preventDefault();
        choose(options[highlighted].value);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openPanel())}
        onKeyDown={handleKeyDown}
        className={`${triggerClassName} ${
          open ? 'border-amber-400' : ''
        } text-left flex items-center justify-between gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer`}
      >
        <span className={`truncate ${selected ? '' : placeholderClassName}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 pointer-events-none transition-transform ${chevronClassName} ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && options.length > 0 && (
        <div
          id={listId}
          role="listbox"
          className={`absolute ${
            align === 'right' ? 'right-0 min-w-full' : 'left-0 right-0'
          } top-full mt-2 z-50 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 max-h-72 overflow-y-auto ${panelClassName}`}
        >
          {heading && (
            <p className="px-4 py-1.5 text-xs font-semibold text-gray-500">{heading}</p>
          )}
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => choose(option.value)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition cursor-pointer ${
                  index === highlighted ? 'bg-gray-50' : ''
                }`}
              >
                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-normal text-gray-900 truncate">
                    {option.label}
                  </span>
                  {option.hint && (
                    <span className="block text-[11px] text-gray-500 truncate">
                      {option.hint}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#0070c0] flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
