import { prisma } from './prisma'
import type { DentistView, ServiceView } from './types'

export async function listDentists(): Promise<DentistView[]> {
  const rows = await prisma.dentist.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, specialty: true },
  })
  return rows
}

export async function listServices(): Promise<ServiceView[]> {
  const rows = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ sort: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true },
  })
  return rows
}
