import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Property } from '../types';

const STORAGE_KEY = 'roomkh-favorites';

interface FavoritesContextValue {
  favorites: Property[];
  isFavorite: (propertyId: string | number | undefined) => boolean;
  toggleFavorite: (property: Property) => void;
  removeFavorite: (propertyId: string | number) => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadInitial(): Property[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // ignore
  }
  return [];
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Property[]>(loadInitial);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setFavorites(loadInitial());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isFavorite = useCallback(
    (propertyId: string | number | undefined) => {
      if (propertyId === undefined || propertyId === null) return false;
      return favorites.some((f) => f.id == propertyId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (property: Property) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id == property.id);
        const next = exists
          ? prev.filter((f) => f.id != property.id)
          : [...prev, property];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const removeFavorite = useCallback((propertyId: string | number) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id != propertyId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, removeFavorite, count: favorites.length }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
