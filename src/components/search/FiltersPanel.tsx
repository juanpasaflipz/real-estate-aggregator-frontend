'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { SearchFilters, PropertyType } from '@/types/property';
import { formatCurrency } from '@/lib/utils';

interface FiltersPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  trigger: React.ReactNode;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Departamento' },
  { value: 'house', label: 'Casa' },
  { value: 'condo', label: 'Condominio' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Más relevantes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'date', label: 'Más recientes' },
];

export function FiltersPanel({ filters, onFiltersChange, trigger }: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [open, setOpen] = useState(false);

  const handlePriceChange = (value: number[], field: 'priceMin' | 'priceMax') => {
    setLocalFilters({ ...localFilters, [field]: value[0] });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: SearchFilters = {
      city: localFilters.city, // Keep the city
      page: 1,
      limit: 20,
      sort: 'relevance',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = 
    localFilters.priceMin || 
    localFilters.priceMax || 
    localFilters.bedrooms || 
    localFilters.bathrooms || 
    localFilters.propertyType ||
    localFilters.areaMin ||
    localFilters.areaMax ||
    (localFilters.sort && localFilters.sort !== 'relevance');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filtros de búsqueda</SheetTitle>
          <SheetDescription>
            Ajusta los filtros para encontrar la propiedad perfecta
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="propertyType">Tipo de propiedad</Label>
            <Select
              value={localFilters.propertyType}
              onValueChange={(value: PropertyType) => 
                setLocalFilters({ ...localFilters, propertyType: value })
              }
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Rango de precio (MXN)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={localFilters.priceMin || ''}
                  onChange={(e) => 
                    setLocalFilters({ 
                      ...localFilters, 
                      priceMin: e.target.value ? Number(e.target.value) : undefined 
                    })
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={localFilters.priceMax || ''}
                  onChange={(e) => 
                    setLocalFilters({ 
                      ...localFilters, 
                      priceMax: e.target.value ? Number(e.target.value) : undefined 
                    })
                  }
                />
              </div>
            </div>
            {(localFilters.priceMin || localFilters.priceMax) && (
              <p className="text-sm text-muted-foreground">
                {localFilters.priceMin && formatCurrency(localFilters.priceMin, 'MXN')} 
                {localFilters.priceMin && localFilters.priceMax && ' - '}
                {localFilters.priceMax && formatCurrency(localFilters.priceMax, 'MXN')}
              </p>
            )}
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Recámaras</Label>
            <Select
              value={localFilters.bedrooms?.toString()}
              onValueChange={(value) => 
                setLocalFilters({ 
                  ...localFilters, 
                  bedrooms: value === 'all' ? undefined : Number(value) 
                })
              }
            >
              <SelectTrigger id="bedrooms">
                <SelectValue placeholder="Cualquier cantidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier cantidad</SelectItem>
                <SelectItem value="0">Estudio</SelectItem>
                <SelectItem value="1">1 recámara</SelectItem>
                <SelectItem value="2">2 recámaras</SelectItem>
                <SelectItem value="3">3 recámaras</SelectItem>
                <SelectItem value="4">4+ recámaras</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Baños</Label>
            <Select
              value={localFilters.bathrooms?.toString()}
              onValueChange={(value) => 
                setLocalFilters({ 
                  ...localFilters, 
                  bathrooms: value === 'all' ? undefined : Number(value) 
                })
              }
            >
              <SelectTrigger id="bathrooms">
                <SelectValue placeholder="Cualquier cantidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier cantidad</SelectItem>
                <SelectItem value="1">1 baño</SelectItem>
                <SelectItem value="2">2 baños</SelectItem>
                <SelectItem value="3">3 baños</SelectItem>
                <SelectItem value="4">4+ baños</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Area/Size */}
          <div className="space-y-2">
            <Label>Tamaño (m²)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={localFilters.areaMin || ''}
                  onChange={(e) => 
                    setLocalFilters({ 
                      ...localFilters, 
                      areaMin: e.target.value ? Number(e.target.value) : undefined 
                    })
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={localFilters.areaMax || ''}
                  onChange={(e) => 
                    setLocalFilters({ 
                      ...localFilters, 
                      areaMax: e.target.value ? Number(e.target.value) : undefined 
                    })
                  }
                />
              </div>
            </div>
            {(localFilters.areaMin || localFilters.areaMax) && (
              <p className="text-sm text-muted-foreground">
                {localFilters.areaMin && `${localFilters.areaMin} m²`} 
                {localFilters.areaMin && localFilters.areaMax && ' - '}
                {localFilters.areaMax && `${localFilters.areaMax} m²`}
              </p>
            )}
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label htmlFor="sort">Ordenar por</Label>
            <Select
              value={localFilters.sort || 'relevance'}
              onValueChange={(value) => 
                setLocalFilters({ ...localFilters, sort: value as any })
              }
            >
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex w-full gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1"
              >
                Limpiar filtros
              </Button>
            )}
            <Button 
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Aplicar filtros
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}