import { ApiResponse, Property, PropertyType, SearchFilters, UserPreferences } from '@/types/property';

// Use local API routes - temporarily use test endpoint
const API_BASE_URL = '/api';

// Updated API structure with enhanced fields
interface ApiProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms?: number;
  size?: number;
  propertyType?: string;
  link: string;
  images?: string[];
  image?: string; // Fallback for backward compatibility
  source: string;
  features?: string[];
  description?: string;
}

function mapApiPropertyToProperty(apiProp: ApiProperty): Property {
  // Use property type from API or determine based on title
  let propertyType: 'apartment' | 'house' | 'condo' | 'land' | 'commercial' = 'apartment';
  
  if (apiProp.propertyType) {
    // Map API property types to our enum
    const typeMap: Record<string, PropertyType> = {
      'departamento': 'apartment',
      'casa': 'house',
      'penthouse': 'condo',
      'terreno': 'land',
      'oficina': 'commercial',
      'local': 'commercial',
      'edificio': 'commercial'
    };
    propertyType = typeMap[apiProp.propertyType.toLowerCase()] || 'apartment';
  } else {
    // Fallback to title analysis
    const titleLower = apiProp.title.toLowerCase();
    if (titleLower.includes('casa') || titleLower.includes('finca')) {
      propertyType = 'house';
    } else if (titleLower.includes('departamento') || titleLower.includes('penthouse') || titleLower.includes('ph')) {
      propertyType = 'apartment';
    } else if (titleLower.includes('terreno')) {
      propertyType = 'land';
    } else if (titleLower.includes('oficina') || titleLower.includes('local') || titleLower.includes('edificio') || apiProp.bedrooms === 0) {
      propertyType = 'commercial';
    }
  }

  // Extract location from title if location field is empty
  let extractedLocation = apiProp.location;
  if (!extractedLocation || extractedLocation === ',') {
    const locationMatch = apiProp.title.match(/en\s+([A-Za-zÀ-ÿ\s]+)(?:\s|$)/i);
    extractedLocation = locationMatch ? locationMatch[1].trim() : 'Ciudad de México';
  }

  // Handle multiple images or single image
  let propertyImages: string[] = [];
  if (apiProp.images && apiProp.images.length > 0) {
    propertyImages = apiProp.images;
  } else if (apiProp.image) {
    propertyImages = [apiProp.image];
  } else {
    // Fallback placeholder images
    const imageUrls = {
      apartment: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
    };
    propertyImages = [imageUrls[propertyType]];
  }

  // Use actual bathrooms from API or estimate
  const bathrooms = apiProp.bathrooms || Math.max(1, Math.floor(apiProp.bedrooms / 2) + 1);

  // Check if it's for rent or sale based on price and title
  const titleLower = apiProp.title.toLowerCase();
  const isRental = titleLower.includes('renta') || apiProp.price < 100000;

  // Use the URL provided by the backend (should now be complete)
  const propertyUrl = apiProp.link || '#';

  return {
    id: apiProp.id,
    title: apiProp.title,
    description: apiProp.description || `${propertyType === 'commercial' ? 'Espacio comercial' : 'Propiedad'} en ${isRental ? 'renta' : 'venta'} ubicada en ${extractedLocation}. ${apiProp.bedrooms > 0 ? `${apiProp.bedrooms} recámaras, ${bathrooms} baños.` : ''}`,
    price: apiProp.price,
    currency: 'MXN',
    location: {
      city: extractedLocation.includes('Ciudad de México') || extractedLocation.includes('CDMX') ? 'Ciudad de México' : extractedLocation,
      state: extractedLocation.includes('Ciudad de México') || extractedLocation.includes('CDMX') ? 'CDMX' : 'México',
      address: extractedLocation,
      coordinates: undefined
    },
    images: propertyImages,
    features: {
      bedrooms: apiProp.bedrooms || 0,
      bathrooms: bathrooms,
      area: apiProp.size || 0,
      areaUnit: 'm²',
      type: propertyType,
      amenities: apiProp.features || []
    },
    source: apiProp.source,
    url: propertyUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      // Handle the nested data.properties structure from the API
      if (data.data && data.data.properties && endpoint.includes('/properties')) {
        // Map the API properties to our Property interface
        const mappedProperties = data.data.properties.map((prop: ApiProperty) => 
          mapApiPropertyToProperty(prop)
        );
        return {
          status: data.status,
          data: mappedProperties as T,
          meta: data.data.meta
        };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async checkHealth(): Promise<ApiResponse<{ status: string }>> {
    return this.fetch<{ status: string }>('/health');
  }

  async searchProperties(
    filters: SearchFilters
  ): Promise<ApiResponse<Property[]>> {
    const params = new URLSearchParams();
    
    // API requires at least one location parameter - default to Ciudad de México
    if (filters.city) {
      params.append('city', filters.city);
    } else if (!filters.zipCode && !filters.area) {
      params.append('city', 'Ciudad de México');
    }
    
    if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.features?.length) params.append('features', filters.features.join(','));
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.areaMin) params.append('sizeMin', filters.areaMin.toString());
    if (filters.areaMax) params.append('sizeMax', filters.areaMax.toString());

    return this.fetch<Property[]>(`/properties?${params.toString()}`);
  }

  async getProperty(id: string): Promise<ApiResponse<Property>> {
    return this.fetch<Property>(`/properties/${id}`);
  }

  async saveUserPreferences(
    preferences: UserPreferences
  ): Promise<ApiResponse<UserPreferences>> {
    return this.fetch<UserPreferences>('/user/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);