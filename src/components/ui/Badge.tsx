import type { ReactNode } from 'react';

export default function Badge({
  variant = 'default',
  className = '',
  children,
}: {
  variant?: 'primary' | 'default';
  className?: string;
  children: ReactNode;
}) {
  const styles = {
    primary: 'bg-blue-100 text-blue-700',
    default: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[variant] || styles.default} ${className}`}
    >
      {children}
    </span>
  );
}
