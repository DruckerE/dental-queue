import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const branches = [
  { slug: 'las-pinas', name: 'Las Piñas' },
  { slug: 'imus', name: 'Imus' },
  { slug: 'muntinlupa', name: 'Muntinlupa' },
]

// Dentists are shared across all branches (they alternate between locations).
const dentists = ['Dr. Tin', 'Dr. Renz', 'Dr. Kath', 'Dr. Pat', 'Dr. Eli']

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
  // Branches: sync to exactly the list above (matched by slug). Removing a
  // branch sets its tickets' branchId to null (FK ON DELETE SET NULL).
  const branchSlugs = branches.map((b) => b.slug)
  const removedBranches = await prisma.branch.deleteMany({
    where: { slug: { notIn: branchSlugs } },
  })
  if (removedBranches.count > 0) console.log(`Removed ${removedBranches.count} branch(es)`)
  for (const [sort, branch] of branches.entries()) {
    await prisma.branch.upsert({
      where: { slug: branch.slug },
      update: { name: branch.name, sort },
      create: { ...branch, sort },
    })
  }
  console.log(`Branches ready: ${branchSlugs.join(', ')}`)

  // Dentists: sync to exactly the list above (matched by name).
  const removedDentists = await prisma.dentist.deleteMany({
    where: { name: { notIn: dentists } },
  })
  if (removedDentists.count > 0) console.log(`Removed ${removedDentists.count} dentist(s)`)
  for (const [sort, name] of dentists.entries()) {
    const existing = await prisma.dentist.findFirst({ where: { name } })
    if (existing) {
      await prisma.dentist.update({ where: { id: existing.id }, data: { sort } })
    } else {
      await prisma.dentist.create({ data: { name, sort } })
    }
  }
  console.log(`Dentists ready: ${dentists.join(', ')}`)

  // Services: seed only when empty (names aren't changing).
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
