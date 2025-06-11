'use client';

import { useState, useEffect } from 'react';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Filters {
  city?: string;
  page: number;
  limit: number;
}

export default function PropertiesV2Page() {
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 20 });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());
      
      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
    enabled: mounted,
  });

  if (!mounted) {
    return null;
  }

  const properties = data?.data || [];
  const totalResults = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalResults / filters.limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, city: searchInput, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Buscar Propiedades (V2)</h1>
        
        <form onSubmit={handleSearch} className="max-w-xl mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar por ciudad..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>
        </form>

        {filters.city && (
          <p className="text-muted-foreground">
            {totalResults} propiedades encontradas en {filters.city}
          </p>
        )}
      </div>

      {isError ? (
        <div className="text-center py-12">
          <p className="text-red-500">
            Error al cargar las propiedades. Por favor, intenta de nuevo.
          </p>
        </div>
      ) : (
        <>
          <PropertyGrid properties={properties} isLoading={isLoading} />
          
          {totalPages > 1 && !isLoading && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Anterior
              </Button>
              
              <span className="flex items-center px-4">
                Página {filters.page} de {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}