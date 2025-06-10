'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyMapProps {
  properties?: Property[];
  selectedProperty?: Property;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

// Since we don't have Mapbox token configured, let's create a placeholder map
export function PropertyMap({ 
  properties = [], 
  selectedProperty,
  center = { lat: 19.4326, lng: -99.1332 }, // Default to Mexico City
  zoom = 12,
  className = ''
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // Placeholder for map - in production, you'd use Mapbox or Google Maps here
  return (
    <div 
      ref={mapRef}
      className={`relative bg-muted rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: '400px' }}
    >
      {/* Map placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        {/* Grid pattern to simulate map */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Property markers */}
      {properties.map((property, index) => {
        // Generate pseudo-random positions for demo
        const offsetX = (index * 137) % 80 + 10; // Pseudo-random X between 10-90%
        const offsetY = (index * 73) % 80 + 10;  // Pseudo-random Y between 10-90%
        
        return (
          <div
            key={`${property.id}-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer"
            style={{ left: `${offsetX}%`, top: `${offsetY}%` }}
            title={property.title}
          >
            <div className="relative">
              <MapPin 
                className={`h-8 w-8 text-primary drop-shadow-lg transition-all hover:scale-110 ${
                  selectedProperty?.id === property.id ? 'text-red-500 scale-125' : ''
                }`}
                fill="currentColor"
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background px-2 py-1 rounded shadow-lg whitespace-nowrap text-xs">
                {formatCurrency(property.price)}
              </div>
            </div>
          </div>
        );
      })}

      {/* Map controls placeholder */}
      <div className="absolute top-4 right-4 bg-background rounded-lg shadow-lg p-2">
        <button className="p-2 hover:bg-muted rounded" title="Zoom in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button className="p-2 hover:bg-muted rounded" title="Zoom out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Mapa interactivo (demo)
      </div>

      {/* Message to configure real map */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground max-w-xs">
          Para ver las ubicaciones reales, configura tu token de Mapbox en las variables de entorno
        </p>
      </div>
    </div>
  );
}

function formatCurrency(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}