'use client';

import { useState, useEffect } from 'react';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Filters {
  city?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  page: number;
  limit: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 20
  });
  
  // Form states for controlled inputs
  const [searchInput, setSearchInput] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [selectedBathrooms, setSelectedBathrooms] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Fetch properties whenever filters change
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Build query params
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());
    
    fetch(`/api/properties?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (data.status === 'success') {
          setProperties(data.data || []);
          setTotal(data.meta?.total || 0);
        } else {
          throw new Error(data.message || 'Failed to load properties');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading properties:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      ...filters,
      city: searchInput,
      page: 1 // Reset to first page on new search
    });
  };

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      priceMin: priceMin ? parseInt(priceMin) : undefined,
      priceMax: priceMax ? parseInt(priceMax) : undefined,
      bedrooms: selectedBedrooms && selectedBedrooms !== 'any' ? parseInt(selectedBedrooms) : undefined,
      bathrooms: selectedBathrooms && selectedBathrooms !== 'any' ? parseInt(selectedBathrooms) : undefined,
      propertyType: selectedType && selectedType !== 'all' ? selectedType : undefined,
      page: 1 // Reset to first page when filters change
    });
  };

  const handleClearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setSelectedBedrooms('any');
    setSelectedBathrooms('any');
    setSelectedType('all');
    setFilters({
      ...filters,
      priceMin: undefined,
      priceMax: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      propertyType: undefined,
      page: 1
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(total / filters.limit);
  const hasActiveFilters = filters.priceMin || filters.priceMax || filters.bedrooms || filters.bathrooms || filters.propertyType;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Properties</h1>
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Dream Property</h1>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 max-w-2xl">
          <Input
            type="text"
            placeholder="Search by city (e.g., Monterrey, Guadalajara)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </form>

      {/* Filters and Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {loading ? 'Loading...' : `${total} properties found`}
          {filters.city && ` in ${filters.city}`}
        </p>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2">Active</span>}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Properties</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Price Range */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Price Range (MXN)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="priceMin" className="text-sm">Min</Label>
                    <Input
                      id="priceMin"
                      type="number"
                      placeholder="0"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceMax" className="text-sm">Max</Label>
                    <Input
                      id="priceMax"
                      type="number"
                      placeholder="Any"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <Label htmlFor="bedrooms" className="text-base font-semibold mb-2 block">Bedrooms</Label>
                <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                  <SelectTrigger id="bedrooms">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div>
                <Label htmlFor="bathrooms" className="text-base font-semibold mb-2 block">Bathrooms</Label>
                <Select value={selectedBathrooms} onValueChange={setSelectedBathrooms}>
                  <SelectTrigger id="bathrooms">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div>
                <Label htmlFor="propertyType" className="text-base font-semibold mb-2 block">Property Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Casa">House</SelectItem>
                    <SelectItem value="Departamento">Apartment</SelectItem>
                    <SelectItem value="Terreno">Land</SelectItem>
                    <SelectItem value="Inmueble">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleApplyFilters} className="flex-1">
                  Apply Filters
                </Button>
                <Button onClick={handleClearFilters} variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Property Grid */}
      <PropertyGrid properties={properties} isLoading={loading} />

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {/* Show first page */}
            <Button
              variant={filters.page === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            
            {/* Show dots if needed */}
            {filters.page > 3 && <span className="px-2">...</span>}
            
            {/* Show current page and neighbors */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (page === 1 || page === totalPages) return false;
                return Math.abs(page - filters.page) <= 1;
              })
              .map(page => (
                <Button
                  key={page}
                  variant={filters.page === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            
            {/* Show dots if needed */}
            {filters.page < totalPages - 2 && <span className="px-2">...</span>}
            
            {/* Show last page */}
            {totalPages > 1 && (
              <Button
                variant={filters.page === totalPages ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}