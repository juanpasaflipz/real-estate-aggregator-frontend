import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create some amenities
  const amenities = await Promise.all([
    prisma.propertyAmenity.upsert({
      where: { name: 'Piscina' },
      update: {},
      create: { name: 'Piscina' }
    }),
    prisma.propertyAmenity.upsert({
      where: { name: 'Gimnasio' },
      update: {},
      create: { name: 'Gimnasio' }
    }),
    prisma.propertyAmenity.upsert({
      where: { name: 'Estacionamiento' },
      update: {},
      create: { name: 'Estacionamiento' }
    }),
    prisma.propertyAmenity.upsert({
      where: { name: 'Seguridad 24/7' },
      update: {},
      create: { name: 'Seguridad 24/7' }
    }),
    prisma.propertyAmenity.upsert({
      where: { name: 'Terraza' },
      update: {},
      create: { name: 'Terraza' }
    }),
    prisma.propertyAmenity.upsert({
      where: { name: 'Jardín' },
      update: {},
      create: { name: 'Jardín' }
    })
  ])

  // Create sample properties
  const properties = [
    {
      title: 'Departamento Moderno en Polanco',
      description: 'Hermoso departamento de lujo en el corazón de Polanco con acabados de primera calidad.',
      price: 4500000,
      currency: 'MXN',
      city: 'Ciudad de México',
      state: 'CDMX',
      address: 'Av. Presidente Masaryk 123, Polanco',
      latitude: 19.4326,
      longitude: -99.1893,
      bedrooms: 2,
      bathrooms: 2.5,
      area: 120,
      areaUnit: 'm2',
      type: 'apartment',
      source: 'Database',
      sourceUrl: 'https://example.com/property/1',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', order: 0 },
          { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', order: 1 },
          { url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6', order: 2 }
        ]
      },
      amenities: {
        connect: [
          { id: amenities[0].id }, // Piscina
          { id: amenities[1].id }, // Gimnasio
          { id: amenities[2].id }, // Estacionamiento
          { id: amenities[3].id }  // Seguridad 24/7
        ]
      }
    },
    {
      title: 'Casa con Jardín en Coyoacán',
      description: 'Espaciosa casa familiar con amplio jardín en zona residencial de Coyoacán.',
      price: 6800000,
      currency: 'MXN',
      city: 'Ciudad de México',
      state: 'CDMX',
      address: 'Calle Francisco Sosa 456, Coyoacán',
      latitude: 19.3437,
      longitude: -99.1561,
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      areaUnit: 'm2',
      type: 'house',
      source: 'Database',
      sourceUrl: 'https://example.com/property/2',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', order: 0 },
          { url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1', order: 1 },
          { url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77', order: 2 }
        ]
      },
      amenities: {
        connect: [
          { id: amenities[2].id }, // Estacionamiento
          { id: amenities[3].id }, // Seguridad 24/7
          { id: amenities[5].id }  // Jardín
        ]
      }
    },
    {
      title: 'Penthouse en Santa Fe',
      description: 'Espectacular penthouse con vista panorámica de la ciudad.',
      price: 12000000,
      currency: 'MXN',
      city: 'Ciudad de México',
      state: 'CDMX',
      address: 'Av. Santa Fe 789, Santa Fe',
      latitude: 19.3663,
      longitude: -99.2595,
      bedrooms: 3,
      bathrooms: 3.5,
      area: 250,
      areaUnit: 'm2',
      type: 'apartment',
      source: 'Database',
      sourceUrl: 'https://example.com/property/3',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', order: 0 },
          { url: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393', order: 1 },
          { url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e', order: 2 }
        ]
      },
      amenities: {
        connect: [
          { id: amenities[0].id }, // Piscina
          { id: amenities[1].id }, // Gimnasio
          { id: amenities[2].id }, // Estacionamiento
          { id: amenities[3].id }, // Seguridad 24/7
          { id: amenities[4].id }  // Terraza
        ]
      }
    }
  ]

  // Insert properties
  for (const property of properties) {
    await prisma.property.create({
      data: property
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })