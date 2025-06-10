'use client';

import { useSearchStore } from '@/lib/store';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock data for favorites - in a real app, you'd fetch these based on IDs
const MOCK_FAVORITES = [
  {
    id: '1',
    title: 'Casa moderna en Polanco',
    description: 'Hermosa casa con acabados de lujo en la mejor zona de Polanco',
    price: 15000000,
    currency: 'MXN',
    location: {
      city: 'Ciudad de México',
      state: 'CDMX',
      address: 'Polanco',
    },
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      areaUnit: 'm²',
      type: 'house' as const,
      amenities: ['pool', 'garage', 'garden'],
    },
    source: 'inmuebles24',
    url: '#',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Departamento con vista al mar',
    description: 'Espectacular departamento frente al mar en Cancún',
    price: 8500000,
    currency: 'MXN',
    location: {
      city: 'Cancún',
      state: 'Quintana Roo',
      address: 'Zona Hotelera',
    },
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      areaUnit: 'm²',
      type: 'apartment' as const,
      amenities: ['pool', 'gym', 'security'],
    },
    source: 'vivanuncios',
    url: '#',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function FavoritesPage() {
  const { favoriteProperties } = useSearchStore();
  
  // Filter mock data to only show favorites
  const favoritesList = MOCK_FAVORITES.filter(property => 
    favoriteProperties.has(property.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          Mis Favoritos
        </h1>
        <p className="text-muted-foreground">
          {favoritesList.length} propiedad{favoritesList.length !== 1 ? 'es' : ''} guardada{favoritesList.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favoritesList.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No tienes propiedades guardadas en favoritos.
          </p>
          <Link href="/properties">
            <Button>
              Explorar propiedades
            </Button>
          </Link>
        </div>
      ) : (
        <PropertyGrid properties={favoritesList} />
      )}
    </div>
  );
}