import type { NextRequest } from 'next/server'
import { createTicket, listTickets } from '@/lib/tickets'
import { checkInSchema } from '@/lib/validation'
import { isTicketStatus, type TicketStatus } from '@/lib/ticket'
import { fail, handleError, ok } from '@/lib/api'

// GET /api/tickets?branchId=...&status=waiting,serving — a branch's tickets today.
export async function GET(request: NextRequest) {
  try {
    const branchId = request.nextUrl.searchParams.get('branchId')
    if (!branchId) {
      return fail('Missing branchId', 400)
    }
    const raw = request.nextUrl.searchParams.get('status')
    const statuses = raw
      ? raw
          .split(',')
          .map((s) => s.trim())
          .filter(isTicketStatus)
      : undefined
    const tickets = await listTickets(branchId, statuses as TicketStatus[] | undefined)
    return ok(tickets)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/tickets — patient check-in. Returns the created ticket.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const input = checkInSchema.parse(body)
    const ticket = await createTicket(input)
    return ok(ticket, 201)
  } catch (error) {
    return handleError(error)
  }
}
