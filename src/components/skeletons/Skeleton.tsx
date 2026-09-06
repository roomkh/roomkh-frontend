type SkeletonProps = {
  className?: string;
  /** Use on coloured/dark surfaces so the block stays visible. */
  light?: boolean;
};

/** A block placeholder. Give it the same box size as the element it stands in for. */
export function Skeleton({ className = '', light = false }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`block ${light ? 'skeleton-light' : 'skeleton'} rounded-md ${className}`}
    />
  );
}

/**
 * A text-line placeholder. Put it *inside* the element that carries the real
 * typography classes (text-lg, leading-relaxed, ...): `h-[1lh]` makes it
 * exactly one line box of that text, so the line keeps its height when the
 * real string arrives. Stack two for a two-line paragraph.
 */
export function SkeletonText({ className = '', light = false }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[1lh] ${light ? 'skeleton-light' : 'skeleton'} rounded-md ${className}`}
    />
  );
}

export default Skeleton;
