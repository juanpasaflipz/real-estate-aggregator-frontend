import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchFilters } from '@/types/property';

interface SearchStore {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  favoriteProperties: Set<string>;
  toggleFavorite: (propertyId: string) => void;
  searchHistory: string[];
  addToSearchHistory: (city: string) => void;
}

const defaultFilters: SearchFilters = {
  page: 1,
  limit: 20,
  sort: 'relevance',
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
      favoriteProperties: new Set(),
      toggleFavorite: (propertyId) =>
        set((state) => {
          const newFavorites = new Set(state.favoriteProperties);
          if (newFavorites.has(propertyId)) {
            newFavorites.delete(propertyId);
          } else {
            newFavorites.add(propertyId);
          }
          return { favoriteProperties: newFavorites };
        }),
      searchHistory: [],
      addToSearchHistory: (city) =>
        set((state) => {
          const newHistory = [city, ...state.searchHistory.filter(c => c !== city)].slice(0, 10);
          return { searchHistory: newHistory };
        }),
    }),
    {
      name: 'search-store',
      partialize: (state) => ({
        filters: state.filters,
        favoriteProperties: Array.from(state.favoriteProperties),
        searchHistory: state.searchHistory,
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        favoriteProperties: new Set(persistedState?.favoriteProperties || []),
      }),
    }
  )
);