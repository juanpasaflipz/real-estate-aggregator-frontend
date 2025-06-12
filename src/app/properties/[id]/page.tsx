'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Home, Bed, Bath, Maximize, MapPin, Calendar, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyImages } from '@/components/property/PropertyImages';
import { apiClient } from '@/lib/api';
import { Property } from '@/types/property';
import { formatCurrency } from '@/lib/utils';
import { useSearchStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState<string>('');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favoriteProperties, toggleFavorite } = useSearchStore();

  // Extract the actual property ID from the slug (format: title-id)
  const extractedId = propertyId.split('-').pop() || '';
  const isFavorite = favoriteProperties.has(extractedId);

  useEffect(() => {
    params.then(p => setPropertyId(p.id));
  }, [params]);

  useEffect(() => {
    if (!propertyId) return;
    
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getProperty(extractedId);
        
        if (response.status === 'success' && response.data) {
          setProperty(response.data);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [extractedId, propertyId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/properties">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a propiedades
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-4">
                Propiedad no encontrada
              </h1>
              <p className="text-muted-foreground mb-6">
                No pudimos encontrar los detalles de esta propiedad.
              </p>
              <Button onClick={() => router.push('/properties')}>
                Volver a la búsqueda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/properties">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a propiedades
        </Button>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <PropertyImages
            images={property.images || []}
            title={property.title}
            showIndicator={true}
            className="sticky top-4"
          />
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFavorite(property.id)}
                  aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
                    )}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  aria-label="Compartir propiedad"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="mb-4">
              {property.features.type}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
          </div>

          <div className="text-4xl font-bold text-primary">
            {formatCurrency(property.price, property.currency)}
          </div>

          {/* Features */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Características</h2>
              <div className="grid grid-cols-3 gap-6">
                {property.features.bedrooms > 0 && (
                  <div className="flex flex-col items-center text-center">
                    <Bed className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-2xl font-semibold">{property.features.bedrooms}</span>
                    <span className="text-sm text-muted-foreground">Recámaras</span>
                  </div>
                )}
                {property.features.bathrooms > 0 && (
                  <div className="flex flex-col items-center text-center">
                    <Bath className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-2xl font-semibold">{property.features.bathrooms}</span>
                    <span className="text-sm text-muted-foreground">Baños</span>
                  </div>
                )}
                {property.features.area > 0 && (
                  <div className="flex flex-col items-center text-center">
                    <Maximize className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-2xl font-semibold">{property.features.area}</span>
                    <span className="text-sm text-muted-foreground">{property.features.areaUnit}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {property.description && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Descripción</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {property.features.amenities && property.features.amenities.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Publicado por {property.source}</span>
              </div>
              {property.createdAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Actualizado: {new Date(property.updatedAt).toLocaleDateString('es-MX')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA */}
          {property.url && property.url !== '#' && (
            <a
              href={property.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full" size="lg">
                <ExternalLink className="h-5 w-5 mr-2" />
                Ver en {property.source}
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}