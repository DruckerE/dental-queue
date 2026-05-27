import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dentists = [
  { name: 'Christine Bautista' },
  { name: 'Renz WWE' },
  { name: 'Kath We Ran' },
  { name: 'Pat O Pat' },
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
  // Dentists: sync the table to exactly the list above (matched by name).
  // Removing a dentist sets any ticket references to null (FK is ON DELETE SET
  // NULL), so this is safe. Idempotent — once names match, nothing changes.
  const desiredNames = dentists.map((d) => d.name)
  const removed = await prisma.dentist.deleteMany({
    where: { name: { notIn: desiredNames } },
  })
  if (removed.count > 0) console.log(`Removed ${removed.count} dentist(s) no longer in the list`)

  for (const dentist of dentists) {
    const existing = await prisma.dentist.findFirst({ where: { name: dentist.name } })
    if (!existing) {
      await prisma.dentist.create({ data: dentist })
      console.log(`Added dentist: ${dentist.name}`)
    }
  }

  // Services: seed only when the table is empty (names aren't changing).
  const serviceCount = await prisma.service.count()
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
