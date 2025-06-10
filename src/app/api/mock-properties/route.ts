import { NextResponse } from 'next/server';
import { Property } from '@/types/property';

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Casa moderna en Polanco',
    description: 'Hermosa casa con acabados de lujo en la mejor zona de Polanco. Cuenta con amplios espacios, cocina integral, jardín y alberca.',
    price: 15000000,
    currency: 'MXN',
    location: {
      city: 'Ciudad de México',
      state: 'CDMX',
      address: 'Polanco, Miguel Hidalgo',
      coordinates: { lat: 19.4326, lng: -99.1332 },
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      areaUnit: 'm²',
      type: 'house',
      amenities: ['pool', 'garage', 'garden', 'security'],
    },
    source: 'inmuebles24',
    url: 'https://example.com/property1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Departamento con vista al mar',
    description: 'Espectacular departamento frente al mar en la zona hotelera de Cancún. Totalmente amueblado y equipado.',
    price: 8500000,
    currency: 'MXN',
    location: {
      city: 'Cancún',
      state: 'Quintana Roo',
      address: 'Zona Hotelera',
      coordinates: { lat: 21.1619, lng: -86.8515 },
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      areaUnit: 'm²',
      type: 'apartment',
      amenities: ['pool', 'gym', 'security', 'furnished'],
    },
    source: 'vivanuncios',
    url: 'https://example.com/property2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Casa en condominio privado',
    description: 'Casa nueva en condominio con seguridad 24/7. Excelente ubicación cerca de centros comerciales.',
    price: 3500000,
    currency: 'MXN',
    location: {
      city: 'Guadalajara',
      state: 'Jalisco',
      address: 'Zapopan',
      coordinates: { lat: 20.6597, lng: -103.3496 },
    },
    images: [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
      'https://images.unsplash.com/photo-1584752242818-b4bd7fb3fe10?w=800',
    ],
    features: {
      bedrooms: 3,
      bathrooms: 2.5,
      area: 200,
      areaUnit: 'm²',
      type: 'house',
      amenities: ['garage', 'garden', 'security'],
    },
    source: 'lamudi',
    url: 'https://example.com/property3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Penthouse de lujo en Santa Fe',
    description: 'Impresionante penthouse con terraza panorámica y vistas espectaculares de la ciudad.',
    price: 25000000,
    currency: 'MXN',
    location: {
      city: 'Ciudad de México',
      state: 'CDMX',
      address: 'Santa Fe',
      coordinates: { lat: 19.3650, lng: -99.2603 },
    },
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
    ],
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 280,
      areaUnit: 'm²',
      type: 'apartment',
      amenities: ['pool', 'gym', 'terrace', 'elevator'],
    },
    source: 'inmuebles24',
    url: 'https://example.com/property4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Terreno en desarrollo residencial',
    description: 'Excelente terreno para construir la casa de tus sueños en zona residencial exclusiva.',
    price: 2000000,
    currency: 'MXN',
    location: {
      city: 'Monterrey',
      state: 'Nuevo León',
      address: 'Carretera Nacional',
      coordinates: { lat: 25.6866, lng: -100.3161 },
    },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    ],
    features: {
      bedrooms: 0,
      bathrooms: 0,
      area: 500,
      areaUnit: 'm²',
      type: 'land',
      amenities: [],
    },
    source: 'propiedades.com',
    url: 'https://example.com/property5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Departamento en Roma Norte',
    description: 'Moderno departamento en el corazón de Roma Norte, cerca de restaurantes y cafeterías.',
    price: 4500000,
    currency: 'MXN',
    location: {
      city: 'Ciudad de México',
      state: 'CDMX',
      address: 'Roma Norte, Cuauhtémoc',
      coordinates: { lat: 19.4199, lng: -99.1605 },
    },
    images: [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
    ],
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      areaUnit: 'm²',
      type: 'apartment',
      amenities: ['elevator', 'terrace'],
    },
    source: 'vivanuncios',
    url: 'https://example.com/property6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  let filteredProperties = [...MOCK_PROPERTIES];
  
  // Filter by city
  const city = searchParams.get('city');
  if (city) {
    filteredProperties = filteredProperties.filter(
      p => p.location.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  // Filter by price range
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  if (priceMin) {
    filteredProperties = filteredProperties.filter(p => p.price >= Number(priceMin));
  }
  if (priceMax) {
    filteredProperties = filteredProperties.filter(p => p.price <= Number(priceMax));
  }
  
  // Filter by property type
  const propertyType = searchParams.get('propertyType');
  if (propertyType) {
    filteredProperties = filteredProperties.filter(p => p.features.type === propertyType);
  }
  
  // Sort
  const sort = searchParams.get('sort');
  if (sort === 'price_asc') {
    filteredProperties.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filteredProperties.sort((a, b) => b.price - a.price);
  }
  
  // Pagination
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const start = (page - 1) * limit;
  const paginatedProperties = filteredProperties.slice(start, start + limit);
  
  return NextResponse.json({
    status: 'success',
    data: paginatedProperties,
    meta: {
      total: filteredProperties.length,
      page,
      limit,
      filters: {
        city,
        priceMin,
        priceMax,
        propertyType,
      },
    },
  });
}