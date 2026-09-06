import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets the window scroll on every navigation. React Router keeps the scroll
 * position across route changes, which is especially noticeable when moving
 * between two property detail pages (same route, different :id) — the page
 * swaps content but stays scrolled down where the previous listing was.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Let in-page anchors (#section) keep their default behaviour.
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
}
