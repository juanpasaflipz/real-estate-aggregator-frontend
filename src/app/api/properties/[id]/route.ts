import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force this route to run on the server only
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await prisma.properties.findUnique({
      where: { external_id: id },
      include: {
        property_images: {
          orderBy: { is_primary: 'desc' }
        },
        property_features: true
      }
    })

    if (!property) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Property not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Transform data to match frontend format
    const transformedProperty = {
      id: property.external_id,
      title: property.title,
      description: property.description || '',
      price: property.price ? Number(property.price) : 0,
      currency: property.currency || 'MXN',
      location: {
        city: property.city || '',
        state: property.state || '',
        address: property.location || '',
        coordinates: undefined
      },
      images: property.property_images.map(img => img.image_url || ''),
      features: {
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.size ? Number(property.size) : 0,
        areaUnit: 'm2',
        type: (property.property_type || 'apartment') as any,
        amenities: property.property_features.map(f => f.feature || '')
      },
      source: property.source || '',
      url: property.link || '',
      createdAt: property.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: property.updated_at?.toISOString() || new Date().toISOString()
    }

    return NextResponse.json({
      status: 'success',
      data: transformedProperty
    })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch property',
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}