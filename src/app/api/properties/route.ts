import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { SearchFilters } from '@/types/property'

// Force this route to run on the server only
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse filters
    const filters: SearchFilters = {
      city: searchParams.get('city') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
      bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
      areaMin: searchParams.get('areaMin') ? Number(searchParams.get('areaMin')) : undefined,
      areaMax: searchParams.get('areaMax') ? Number(searchParams.get('areaMax')) : undefined,
      propertyType: searchParams.get('propertyType') as any || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      sort: searchParams.get('sort') as any || 'date',
    }

    // Build where clause for existing schema
    const where: Prisma.propertiesWhereInput = {}
    
    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' }
    }
    
    if (filters.priceMin || filters.priceMax) {
      where.price = {}
      if (filters.priceMin) where.price.gte = filters.priceMin
      if (filters.priceMax) where.price.lte = filters.priceMax
    }
    
    if (filters.bedrooms) {
      where.bedrooms = { gte: filters.bedrooms }
    }
    
    if (filters.bathrooms) {
      where.bathrooms = { gte: filters.bathrooms }
    }
    
    if (filters.areaMin || filters.areaMax) {
      where.size = {}
      if (filters.areaMin) where.size.gte = filters.areaMin
      if (filters.areaMax) where.size.lte = filters.areaMax
    }
    
    if (filters.propertyType) {
      where.property_type = filters.propertyType
    }

    // Build order by
    let orderBy: Prisma.propertiesOrderByWithRelationInput = { created_at: 'desc' }
    
    switch (filters.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'date':
        orderBy = { created_at: 'desc' }
        break
    }

    // Get total count
    const total = await prisma.properties.count({ where })
    
    // Get properties with pagination
    const skip = ((filters.page || 1) - 1) * (filters.limit || 20)
    const take = filters.limit || 20
    
    const properties = await prisma.properties.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        property_images: {
          orderBy: { is_primary: 'desc' }
        },
        property_features: true
      }
    })

    // Transform data to match frontend format
    const transformedProperties = properties.map(property => ({
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
    }))

    return NextResponse.json({
      status: 'success',
      data: transformedProperties,
      meta: {
        total,
        page: filters.page || 1,
        limit: filters.limit || 20,
        filters
      }
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch properties',
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}