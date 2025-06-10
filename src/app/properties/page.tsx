'use client';

import { useEffect, useState } from 'react';
import { useSearchStore } from '@/lib/store';
import { usePropertySearch } from '@/hooks/useProperties';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyMap } from '@/components/property/PropertyMap';
import { FiltersPanel } from '@/components/search/FiltersPanel';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Map, Grid } from 'lucide-react';

export default function PropertiesPage() {
  const { filters, setFilters } = useSearchStore();
  const { data, isLoading, isError } = usePropertySearch(filters);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const properties = data?.data || [];
  const totalResults = data?.meta?.total || 0;
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(totalResults / (filters.limit || 20));

  const handlePageChange = (page: number) => {
    setFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Buscar Propiedades</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 w-full md:max-w-xl">
            <SearchBar />
          </div>
          <FiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            trigger={
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            }
          />
        </div>

        {filters.city && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              {totalResults} propiedades encontradas en {filters.city}
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid className="h-4 w-4" />
                Vista de cuadrícula
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <Map className="h-4 w-4" />
                Vista de mapa
              </Button>
            </div>
          </div>
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
          {viewMode === 'grid' ? (
            <PropertyGrid properties={properties} isLoading={isLoading} />
          ) : (
            <PropertyMap 
              properties={properties} 
              className="w-full h-[600px] mb-8"
            />
          )}
          
          {totalPages > 1 && !isLoading && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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