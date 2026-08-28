import { formatCurrency } from '../../utils/formatCurrency';

export default function PriceTag({
  price = 0,
  currency = 'USD',
  priceUnit = 'MONTH',
  purpose = 'RENT',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}: {
  price?: number;
  currency?: string;
  priceUnit?: string;
  purpose?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  // Normalize unit formatting (e.g., MONTH -> / month, TOTAL -> total price)
  const isRent = purpose === 'RENT' || priceUnit === 'MONTH';
  
  const unitLabel = isRent 
    ? '/ month' 
    : priceUnit && priceUnit !== 'TOTAL' 
      ? `/ ${priceUnit.toLowerCase()}` 
      : '';

  // Size styling variants
  const sizeClasses = {
    sm: {
      price: 'text-sm font-extrabold',
      unit: 'text-[10px]',
    },
    md: {
      price: 'text-base sm:text-lg font-extrabold',
      unit: 'text-[10px] sm:text-xs',
    },
    lg: {
      price: 'text-xl sm:text-2xl font-black',
      unit: 'text-xs sm:text-sm',
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-baseline gap-1 text-blue-600 ${className}`}>
      <span className={`${currentSize.price} tracking-tight`}>
        {formatCurrency(price, currency)}
      </span>
      {unitLabel && (
        <span className={`${currentSize.unit} text-gray-400 font-normal`}>
          {unitLabel}
        </span>
      )}
    </div>
  );
}
