import { useState, useCallback } from 'react';
import type { Property } from '../types';

const STORAGE_KEY = 'roomkh-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  const isFavorite = useCallback(
    (propertyId: string | number | undefined) => {
      if (propertyId === undefined || propertyId === null) return false;
      return favorites.some((f) => f.id == propertyId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback((property: Property) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id == property.id);
      const next = exists
        ? prev.filter((f) => f.id != property.id)
        : [...prev, property];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFavorite = useCallback((propertyId: string | number) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id != propertyId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
