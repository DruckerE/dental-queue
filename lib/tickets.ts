import { prisma } from './prisma'
import {
  decodeServices,
  encodeServices,
  formatTicketCode,
  startOfDay,
  type TicketStatus,
} from './ticket'
import type { TicketView } from './types'
import type { CheckInInput, UpdateTicketInput } from './validation'

const ticketInclude = {
  preferredDentist: { select: { name: true } },
  assignedDentist: { select: { name: true } },
} as const

type TicketRow = {
  id: string
  number: number
  code: string
  patientName: string
  phone: string | null
  services: string
  notes: string | null
  status: string
  branchId: string | null
  preferredDentistId: string | null
  assignedDentistId: string | null
  createdAt: Date
  calledAt: Date | null
  completedAt: Date | null
  preferredDentist: { name: string } | null
  assignedDentist: { name: string } | null
}

function toView(row: TicketRow): TicketView {
  return {
    id: row.id,
    number: row.number,
    code: row.code,
    patientName: row.patientName,
    phone: row.phone,
    services: decodeServices(row.services),
    notes: row.notes,
    status: row.status as TicketStatus,
    branchId: row.branchId,
    preferredDentistId: row.preferredDentistId,
    preferredDentistName: row.preferredDentist?.name ?? null,
    assignedDentistId: row.assignedDentistId,
    assignedDentistName: row.assignedDentist?.name ?? null,
    createdAt: row.createdAt.toISOString(),
    calledAt: row.calledAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
  }
}

// Creates a ticket with the next per-day sequential number, scoped to the
// branch. Wrapped in a transaction so concurrent check-ins at the same branch
// don't collide on the same number.
export async function createTicket(input: CheckInInput): Promise<TicketView> {
  const dayStart = startOfDay()

  const row = await prisma.$transaction(async (tx) => {
    const todayCount = await tx.ticket.count({
      where: { branchId: input.branchId, createdAt: { gte: dayStart } },
    })
    const number = todayCount + 1

    return tx.ticket.create({
      data: {
        number,
        code: formatTicketCode(number),
        branchId: input.branchId,
        patientName: input.patientName,
        phone: input.phone ?? null,
        services: encodeServices(input.services),
        notes: input.notes ?? null,
        preferredDentistId: input.preferredDentistId ?? null,
      },
      include: ticketInclude,
    })
  })

  return toView(row)
}

// Lists a branch's tickets for today, in queue order. Optional status filter.
export async function listTickets(
  branchId: string,
  statuses?: readonly TicketStatus[],
): Promise<TicketView[]> {
  const rows = await prisma.ticket.findMany({
    where: {
      branchId,
      createdAt: { gte: startOfDay() },
      ...(statuses && statuses.length > 0 ? { status: { in: [...statuses] } } : {}),
    },
    include: ticketInclude,
    orderBy: { number: 'asc' },
  })
  return rows.map(toView)
}

export async function getTicketByCode(branchId: string, code: string): Promise<TicketView | null> {
  const row = await prisma.ticket.findFirst({
    where: { branchId, code, createdAt: { gte: startOfDay() } },
    include: ticketInclude,
  })
  return row ? toView(row) : null
}

// How many waiting tickets are ahead of the given number within the branch.
export async function waitingAhead(branchId: string, number: number): Promise<number> {
  return prisma.ticket.count({
    where: {
      branchId,
      status: 'waiting',
      number: { lt: number },
      createdAt: { gte: startOfDay() },
    },
  })
}

// Applies a staff update, stamping timestamps when the status transitions.
export async function updateTicket(id: string, input: UpdateTicketInput): Promise<TicketView> {
  const data: Record<string, unknown> = {}

  if (input.status !== undefined) {
    data.status = input.status
    if (input.status === 'serving') data.calledAt = new Date()
    if (input.status === 'completed') data.completedAt = new Date()
  }
  if (input.assignedDentistId !== undefined) {
    data.assignedDentistId = input.assignedDentistId || null
  }

  const row = await prisma.ticket.update({
    where: { id },
    data,
    include: ticketInclude,
  })
  return toView(row)
}
