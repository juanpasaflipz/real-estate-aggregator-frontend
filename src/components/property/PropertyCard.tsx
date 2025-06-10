'use client';

import Link from 'next/link';
import { Heart, Bed, Bath, Maximize, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import { formatCurrency, formatArea, truncateText, generatePropertySlug } from '@/lib/utils';
import { useSearchStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { PropertyImages } from './PropertyImages';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { favoriteProperties, toggleFavorite } = useSearchStore();
  const isFavorite = favoriteProperties.has(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(property.id);
  };

  // If property has a valid external URL, use that. Otherwise, use internal detail page
  const propertyUrl = property.url && property.url !== '#' 
    ? property.url 
    : `/properties/${generatePropertySlug(property.title, property.id)}`;
  
  const isExternalLink = property.url && property.url !== '#' && property.url.startsWith('http');

  const CardWrapper = isExternalLink ? 'a' : Link;
  const cardProps = isExternalLink 
    ? { href: propertyUrl, target: '_blank', rel: 'noopener noreferrer' }
    : { href: propertyUrl };

  return (
    <CardWrapper {...cardProps}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <PropertyImages 
            images={property.images || []} 
            title={property.title}
            className="aspect-[4/3]"
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors z-10"
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
            />
          </button>
          <Badge className="absolute top-2 left-2 z-10" variant="secondary">
            {property.features.type}
          </Badge>
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
              <Camera className="h-3 w-3" />
              <span>{property.images.length}</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {property.title}
          </h3>
          
          <p className="text-2xl font-bold text-primary mb-2">
            {formatCurrency(property.price, property.currency)}
          </p>
          
          <p className="text-sm text-muted-foreground mb-3">
            {property.location.city}, {property.location.state}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.features.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.features.bathrooms}</span>
              </div>
            )}
            {property.features.area > 0 && (
              <div className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                <span>{formatArea(property.features.area, property.features.areaUnit)}</span>
              </div>
            )}
          </div>
          
          {property.description && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {truncateText(property.description, 100)}
            </p>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}