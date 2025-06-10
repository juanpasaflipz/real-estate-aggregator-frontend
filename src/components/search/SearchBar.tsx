'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchStore } from '@/lib/store';
import { useDebounce } from '@/hooks/useDebounce';

const POPULAR_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla',
  'Cancún',
  'Playa del Carmen',
  'Querétaro',
  'Mérida',
];

export function SearchBar() {
  const router = useRouter();
  const { filters, setFilters, searchHistory, addToSearchHistory } = useSearchStore();
  const [searchValue, setSearchValue] = useState(filters.city || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 300);

  const suggestions = searchValue
    ? [...searchHistory, ...POPULAR_CITIES]
        .filter((city, index, self) => 
          city.toLowerCase().includes(searchValue.toLowerCase()) && 
          self.indexOf(city) === index
        )
        .slice(0, 5)
    : searchHistory.slice(0, 5);

  const handleSearch = (city?: string) => {
    const searchCity = city || searchValue;
    if (searchCity) {
      setFilters({ city: searchCity, page: 1 });
      addToSearchHistory(searchCity);
      router.push('/properties');
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    setFilters({ city: undefined });
  };

  useEffect(() => {
    if (debouncedSearch !== filters.city) {
      setFilters({ city: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters.city, setFilters]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar por ciudad..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
        <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50">
          {suggestions.length > 0 ? (
            <>
              <p className="px-3 py-2 text-xs text-muted-foreground">
                {searchValue ? 'Sugerencias' : 'Búsquedas recientes'}
              </p>
              {suggestions.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchValue(city);
                    handleSearch(city);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {city}
                </button>
              ))}
            </>
          ) : (
            <>
              <p className="px-3 py-2 text-xs text-muted-foreground">Ciudades populares</p>
              {POPULAR_CITIES.slice(0, 5).map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchValue(city);
                    handleSearch(city);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {city}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}