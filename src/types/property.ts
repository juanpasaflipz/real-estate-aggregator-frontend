export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: {
    city: string;
    state: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    areaUnit: string;
    type: PropertyType;
    amenities: string[];
  };
  source: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'apartment' | 'house' | 'condo' | 'land' | 'commercial';

export interface SearchFilters {
  city?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaMin?: number;
  areaMax?: number;
  propertyType?: PropertyType;
  features?: string[];
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'date' | 'relevance';
  zipCode?: string;
  area?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  code?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    filters?: any;
  };
}

export interface UserPreferences {
  id?: string;
  searchFilters?: SearchFilters;
  favoriteProperties?: string[];
  emailAlerts?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    filters?: SearchFilters;
  };
}