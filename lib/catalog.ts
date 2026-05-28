import { prisma } from './prisma'
import type { BranchView, DentistView, ServiceView } from './types'

export async function listBranches(): Promise<BranchView[]> {
  const rows = await prisma.branch.findMany({
    where: { active: true },
    orderBy: [{ sort: 'asc' }, { name: 'asc' }],
    select: { id: true, slug: true, name: true },
  })
  return rows
}

export async function getBranchBySlug(slug: string): Promise<BranchView | null> {
  const row = await prisma.branch.findFirst({
    where: { slug, active: true },
    select: { id: true, slug: true, name: true },
  })
  return row
}

export async function listDentists(): Promise<DentistView[]> {
  const rows = await prisma.dentist.findMany({
    where: { active: true },
    orderBy: [{ sort: 'asc' }, { name: 'asc' }],
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
