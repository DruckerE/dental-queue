import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dentists = [
  { name: 'Dr. Maria Cruz', specialty: 'General Dentistry' },
  { name: 'Dr. Jose Reyes', specialty: 'Orthodontics' },
  { name: 'Dr. Anna Santos', specialty: 'Pediatric Dentistry' },
  { name: 'Dr. Mark Lim', specialty: 'Oral Surgery' },
]

const services = [
  'Consultation / Check-up',
  'Teeth Cleaning',
  'Tooth Extraction',
  'Dental Filling',
  'Braces / Orthodontics',
  'Teeth Whitening',
  'Root Canal',
  'Dentures',
  'Dental Implant',
  'Emergency / Pain',
]

async function main() {
  // Only seed when empty so re-running doesn't create duplicates.
  const [dentistCount, serviceCount] = await Promise.all([
    prisma.dentist.count(),
    prisma.service.count(),
  ])

  if (dentistCount === 0) {
    await prisma.dentist.createMany({ data: dentists })
    console.log(`Seeded ${dentists.length} dentists`)
  } else {
    console.log(`Dentists already present (${dentistCount}), skipping`)
  }

  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: services.map((name, sort) => ({ name, sort })),
    })
    console.log(`Seeded ${services.length} services`)
  } else {
    console.log(`Services already present (${serviceCount}), skipping`)
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
