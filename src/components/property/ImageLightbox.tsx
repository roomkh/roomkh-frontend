import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  alt?: string;
}

export default function ImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
  alt = 'Property image',
}: ImageLightboxProps) {
  const total = images.length;
  const hasMultiple = total > 1;

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  // Lock page scroll while the lightbox is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (!hasMultiple) return;
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, goPrev, goNext, hasMultiple]);

  if (total === 0) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top bar: counter + close */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0">
        <span className="text-xs font-bold text-white/80 tabular-nums">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-16 pb-4">
        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-[#0070c0] text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <img
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain rounded-2xl select-none"
        />

        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-[#0070c0] text-white transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div
          className="shrink-0 flex items-center justify-center gap-2 px-4 pb-6 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => onIndexChange(idx)}
              aria-label={`Show image ${idx + 1}`}
              className={`h-14 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                idx === index ? 'border-[#0070c0] opacity-100' : 'border-transparent opacity-50 hover:opacity-90'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
