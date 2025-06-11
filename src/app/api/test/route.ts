import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: [
      {
        id: 'test-1',
        title: 'Test Property',
        description: 'This is a test property',
        price: 1000000,
        currency: 'MXN',
        location: {
          city: 'Test City',
          state: 'Test State',
          address: 'Test Address'
        },
        images: ['https://via.placeholder.com/400x300'],
        features: {
          bedrooms: 3,
          bathrooms: 2,
          area: 120,
          areaUnit: 'm2',
          type: 'house',
          amenities: ['parking', 'pool']
        },
        source: 'test',
        url: 'https://example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    meta: {
      total: 1,
      page: 1,
      limit: 20
    }
  })
}